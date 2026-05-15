import { randomUUID } from "node:crypto";

import OpenAI from "openai";
import { z } from "zod";

import { env, integrationMode } from "../../config/env.js";
import type { CommitDetail, PostRecord } from "../../types.js";
import { getCommitDetail } from "../github/github.service.js";
import { insertPost } from "../posts/posts.repository.js";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

const generateBlogInputSchema = z.object({
  repositoryOwner: z.string().trim().min(1),
  repositoryName: z.string().trim().min(1),
  branch: z.string().trim().min(1),
  commitShas: z.array(z.string().trim().min(1)).min(1).max(8)
});

const generatedDraftSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  content: z.string().trim().min(1)
});

type GenerateBlogInput = z.infer<typeof generateBlogInputSchema>;

function truncatePatch(patch: string | null) {
  if (!patch) {
    return "텍스트 patch 없음";
  }

  if (patch.length <= 900) {
    return patch;
  }

  return `${patch.slice(0, 900)}\n...<truncated>`;
}

function buildPrompt(input: GenerateBlogInput, commitDetails: CommitDetail[]) {
  const commitBlocks = commitDetails
    .map((commit, index) => {
      const files = commit.files
        .map(
          (file) =>
            `- ${file.filename} (${file.status}, +${file.additions} / -${file.deletions})\n${truncatePatch(file.patch)}`
        )
        .join("\n");

      return [
        `커밋 ${index + 1}`,
        `SHA: ${commit.sha}`,
        `메시지: ${commit.message}`,
        `작성자: ${commit.authorName}`,
        `시각: ${commit.committedAt}`,
        commit.body ? `설명: ${commit.body}` : null,
        "변경 파일:",
        files
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return [
    `저장소: ${input.repositoryOwner}/${input.repositoryName}`,
    `브랜치: ${input.branch}`,
    `선택된 커밋 수: ${commitDetails.length}`,
    "",
    "다음 자료를 바탕으로 한국어 개발 블로그 초안을 작성해줘.",
    "- 실제 변경 사항에 기반해 작성한다.",
    "- 과장된 성과 표현은 피한다.",
    "- 사용자가 수정하기 쉽도록 마크다운으로 작성한다.",
    "- 섹션은 '배경', '무엇을 만들었는가', '구현 포인트', '다음 개선점' 순서를 기본으로 한다.",
    "- title, summary, content 키를 가진 JSON 객체만 반환한다.",
    "",
    commitBlocks
  ].join("\n");
}

function buildLocalDraft(input: GenerateBlogInput, commitDetails: CommitDetail[]) {
  const uniqueFiles = Array.from(new Set(commitDetails.flatMap((commit) => commit.files.map((file) => file.filename)))).slice(0, 6);
  const titleSeed = commitDetails[0]?.message.replace(/^[a-z]+:\s*/i, "") ?? `${input.repositoryName} 작업 요약`;
  const title = `${titleSeed} 중심의 ${input.repositoryName} 개발 정리`;
  const summary = `${input.branch} 브랜치에서 선택한 ${commitDetails.length}개의 커밋을 바탕으로 저장소 선택, 커밋 분석, 글 초안 생성 흐름을 정리한 글입니다.`;

  const content = [
    `# ${title}`,
    "",
    "## 배경",
    `${input.repositoryOwner}/${input.repositoryName} 저장소에서 의미 있는 커밋 묶음을 골라 개발 블로그 초안으로 정리하는 흐름을 구성했다.`,
    "",
    "## 무엇을 만들었는가",
    ...commitDetails.map((commit) => `- \`${commit.sha.slice(0, 7)}\` ${commit.message}`),
    "",
    "## 구현 포인트",
    "### 커밋 선택과 요약 입력",
    "선택된 커밋들의 메시지와 파일 변경 정보를 함께 수집해 블로그 초안의 근거 데이터로 사용했다.",
    "",
    "### 눈에 띄는 변경 파일",
    ...uniqueFiles.map((file) => `- ${file}`),
    "",
    "### 왜 이렇게 구성했는가",
    "사용자는 완성된 글보다 편집 가능한 초안을 원하므로, 생성 즉시 저장하고 에디터로 이동하는 흐름을 우선했다.",
    "",
    "## 다음 개선점",
    "- 커밋 diff 중요도에 따라 본문 구조를 더 정교하게 나누기",
    "- 생성된 문장의 톤과 길이를 템플릿별로 선택할 수 있게 만들기",
    "- 발행 대상을 실제 블로그 플랫폼으로 확장하기"
  ].join("\n");

  return {
    title,
    summary,
    content,
    mode: "demo" as const
  };
}

async function buildOpenAIDraft(input: GenerateBlogInput, commitDetails: CommitDetail[]) {
  if (!openai || integrationMode.openAI === "demo") {
    return buildLocalDraft(input, commitDetails);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "당신은 개발자의 작업 로그를 읽고, 사실 기반의 한국어 개발 블로그 초안을 쓰는 테크니컬 라이터입니다. 응답은 반드시 JSON 객체 하나만 반환하세요."
        },
        {
          role: "user",
          content: buildPrompt(input, commitDetails)
        }
      ]
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error("OpenAI returned an empty response.");
    }

    const parsedDraft = generatedDraftSchema.parse(JSON.parse(rawContent));
    return {
      ...parsedDraft,
      mode: "live" as const
    };
  } catch (error) {
    console.error("OpenAI generation failed. Falling back to local draft builder.", error);
    return buildLocalDraft(input, commitDetails);
  }
}

export async function generateBlogDraft(input: GenerateBlogInput): Promise<PostRecord> {
  const parsedInput = generateBlogInputSchema.parse(input);
  const commitDetails = await Promise.all(
    parsedInput.commitShas.map((sha) => getCommitDetail(parsedInput.repositoryOwner, parsedInput.repositoryName, sha))
  );
  const generatedDraft = await buildOpenAIDraft(parsedInput, commitDetails);
  const now = new Date().toISOString();

  const post: PostRecord = {
    id: randomUUID(),
    repositoryOwner: parsedInput.repositoryOwner,
    repositoryName: parsedInput.repositoryName,
    branch: parsedInput.branch,
    commitShas: parsedInput.commitShas,
    sourceCommits: commitDetails.map(({ sha, message, authorName, committedAt, url }) => ({
      sha,
      message,
      authorName,
      committedAt,
      url
    })),
    title: generatedDraft.title,
    summary: generatedDraft.summary,
    content: generatedDraft.content,
    status: "draft",
    generationMode: generatedDraft.mode,
    createdAt: now,
    updatedAt: now,
    publishedAt: null
  };

  return insertPost(post);
}


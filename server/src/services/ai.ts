import { GoogleGenAI } from '@google/genai';
import type { CommitDetail } from '../github.js';

export class MissingGeminiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY not set');
    this.name = 'MissingGeminiKeyError';
  }
}

/**
 * Build a Gemini client using the current GEMINI_API_KEY env var.
 * Read on every call so tests can swap the env var per-case.
 */
export function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new MissingGeminiKeyError();
  }
  return new GoogleGenAI({ apiKey });
}

const MODEL = 'gemini-2.5-flash';
const MAX_TOKENS = 4096;

const SYSTEM_PROMPT =
  '당신은 개발자의 GitHub 커밋들을 분석해 한국어 개발 블로그 초안을 작성하는 어시스턴트입니다. ' +
  '입력으로 받은 커밋 메시지와 코드 변경(diff)을 바탕으로, 무엇을 왜 바꿨는지, ' +
  '어떤 결정을 했는지 자연스럽게 markdown으로 정리하세요. ' +
  '결과는 순수 markdown만 반환합니다 (코드블록 ```으로 감싸지 마세요). ' +
  '제목은 # 로 시작하는 적절한 한 줄로 정합니다.';

export function buildPrompt(commits: CommitDetail[]): string {
  const sections = commits.map((commit) => {
    const shortSha = commit.sha.slice(0, 7);
    const fileList =
      commit.files.length > 0
        ? commit.files.map((f) => `- ${f.status} ${f.filename}`).join('\n')
        : '(no files)';

    const diffBlocks = commit.files
      .map((file) => {
        if (file.patch && file.patch.length > 0) {
          return `--- ${file.filename}\n\`\`\`\n${file.patch}\n\`\`\``;
        }
        return `--- ${file.filename}\n(binary or no patch)`;
      })
      .join('\n\n');

    return [
      `## Commit ${shortSha}`,
      'Message:',
      commit.message,
      '',
      'Changed files:',
      fileList,
      '',
      'Diff:',
      diffBlocks,
    ].join('\n');
  });

  return sections.join('\n\n');
}

export async function generateDraft(commits: CommitDetail[]): Promise<string> {
  const client = getGemini();
  const userPrompt = buildPrompt(commits);

  const response = await client.models.generateContent({
    model: MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: MAX_TOKENS,
    },
  });

  const text =
    response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || text.length === 0) {
    throw new Error('Gemini response missing text content');
  }
  return text;
}

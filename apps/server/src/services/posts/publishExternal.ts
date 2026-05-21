import type { Post } from "@commit-to-blog/shared";
import { ApiError } from "../../lib/ApiError.js";
import { hasGithubToken } from "../../config/env.js";
import { githubRest } from "../github/client.js";

function parseRepoFullName(fullName: string): [string, string] {
  const [owner, repo] = fullName.split("/", 2);
  if (!owner || !repo) {
    throw ApiError.badRequest(`repoFullName 형식이 잘못되었습니다: ${fullName}`);
  }
  return [owner, repo];
}

function buildIssueBody(post: Post, note?: string): string {
  const tagLine =
    post.tags.length > 0 ? `Tags: ${post.tags.map((t) => `\`${t}\``).join(", ")}\n\n` : "";
  const commitLine = post.source.commitShas.length
    ? `Source commits (${post.source.branch}): ${post.source.commitShas
        .map((s) => `\`${s.slice(0, 7)}\``)
        .join(", ")}\n\n`
    : "";
  const noteBlock = note ? `> ${note}\n\n` : "";
  const footer = `\n\n---\n_Published from Smart Blog (commit-to-blog)._`;
  return `${noteBlock}${tagLine}${commitLine}${post.body}${footer}`;
}

/**
 * 포스트를 source 저장소의 GitHub Issue 로 발행한다.
 * 토큰이 없으면 mock URL 반환.
 */
export async function publishToGithubIssue(
  post: Post,
  note?: string,
): Promise<string> {
  if (!hasGithubToken()) {
    const stamp = Date.now();
    return `https://github.com/${post.source.repoFullName}/issues/mock-${stamp}`;
  }

  const [owner, repo] = parseRepoFullName(post.source.repoFullName);
  const body = buildIssueBody(post, note);

  try {
    const res = await githubRest().issues.create({
      owner,
      repo,
      title: post.title,
      body,
      labels: ["smart-blog", ...post.tags.slice(0, 5)],
    });
    return res.data.html_url;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "GitHub Issue 생성 중 오류";
    throw new ApiError(
      502,
      "INTERNAL_ERROR",
      `GitHub Issue 발행에 실패했습니다: ${message}`,
    );
  }
}

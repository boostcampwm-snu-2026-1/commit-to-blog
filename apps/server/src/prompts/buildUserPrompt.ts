import type { SummarizeRequest, SummarizeStyle } from "../types/index.js";

const STYLE_HINT: Record<SummarizeStyle, string> = {
  default: "",
  short: "전체 글을 평소보다 30% 짧게 작성하세요.",
  technical: "기술 용어와 코드 인용 비중을 늘려 동료 시니어 개발자에게 맞추세요.",
  casual: "딱딱한 문어체 대신 가볍고 친근한 톤을 유지하세요.",
};

const FILE_LIST_LIMIT = 20;

export function buildUserPrompt(req: SummarizeRequest): string {
  const styleHint = STYLE_HINT[req.style ?? "default"];

  const commitBlocks = req.commits.map((c, idx) => {
    const fileLines = c.files.slice(0, FILE_LIST_LIMIT).map((f) => {
      const sign = `+${f.additions} / -${f.deletions}`;
      return `- (${f.status}) ${f.filename} [${sign}]`;
    });
    const truncated =
      c.files.length > FILE_LIST_LIMIT
        ? `\n... 외 ${c.files.length - FILE_LIST_LIMIT}개 파일 생략`
        : "";

    const patchBlocks = c.files
      .filter((f) => f.patch)
      .slice(0, 5)
      .map(
        (f) => `\n\`\`\`diff
# ${f.filename}
${f.patch}
\`\`\``,
      )
      .join("");

    return [
      `## Commit ${idx + 1} (${c.sha.slice(0, 7)})`,
      `Message: ${c.message}`,
      c.body ? `Body:\n${c.body}` : "",
      `Stats: +${c.stats.additions} / -${c.stats.deletions} (${c.stats.total} lines)`,
      `Files:`,
      ...fileLines,
      truncated,
      patchBlocks,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    `Repository: ${req.repo}`,
    `Branch: ${req.branch}`,
    styleHint,
    "",
    "다음 커밋(들)을 기반으로 블로그 초안 JSON을 작성하세요.",
    "",
    ...commitBlocks,
  ]
    .filter(Boolean)
    .join("\n");
}

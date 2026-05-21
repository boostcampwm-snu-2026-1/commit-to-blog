import { createHash } from "node:crypto";

/**
 * Draft 캐시 키 — 같은 입력이면 같은 키.
 * sha256(repo + branch + sortedShas + model)
 */
export function makeContextKey(input: {
  repoFullName: string;
  branch: string;
  commitShas: string[];
  model: string;
}): string {
  const sorted = [...input.commitShas].sort();
  const material = `${input.repoFullName}|${input.branch}|${sorted.join(",")}|${input.model}`;
  return `sha256-${createHash("sha256").update(material).digest("hex")}`;
}

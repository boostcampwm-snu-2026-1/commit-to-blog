import { describe, expect, it } from "vitest";
import { squashDiffsForLlm, type CommitDiff } from "./getDiff.js";

function diff(sha: string, patches: string[]): CommitDiff {
  return {
    sha,
    shortSha: sha.slice(0, 7),
    message: "test",
    files: patches.map((p, i) => ({
      filename: `f${i}.ts`,
      status: "modified",
      additions: 1,
      deletions: 0,
      patch: p,
      truncated: false,
    })),
  };
}

describe("squashDiffsForLlm", () => {
  it("총량이 한도 이하면 그대로 통과", () => {
    const small = "a".repeat(100);
    const result = squashDiffsForLlm([diff("aaa", [small])]);
    expect(result.globallyTruncated).toBe(false);
    expect(result.totalPatchChars).toBe(100);
  });

  it("총량이 한도 초과면 뒤 파일부터 truncated", () => {
    const big = "x".repeat(20 * 1024);
    const result = squashDiffsForLlm([
      diff("aaa", [big, big, big]), // 60KB > 32KB
    ]);
    expect(result.globallyTruncated).toBe(true);
    const trimmed = result.diffs[0]!.files.filter((f) => f.truncated);
    expect(trimmed.length).toBeGreaterThan(0);
  });

  it("여러 커밋에 걸쳐 누적 한도 적용", () => {
    const med = "y".repeat(15 * 1024);
    const result = squashDiffsForLlm([
      diff("aaa", [med]),
      diff("bbb", [med]),
      diff("ccc", [med]), // 누적 45KB > 32KB
    ]);
    expect(result.globallyTruncated).toBe(true);
  });
});

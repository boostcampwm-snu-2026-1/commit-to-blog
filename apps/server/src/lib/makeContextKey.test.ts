import { describe, expect, it } from "vitest";
import { makeContextKey } from "./makeContextKey.js";

describe("makeContextKey", () => {
  it("같은 입력은 같은 키를 만든다", () => {
    const a = makeContextKey({
      repoFullName: "jj1kim/commit-to-blog",
      branch: "main",
      commitShas: ["abc1234", "def5678"],
      model: "gpt-4o-mini",
    });
    const b = makeContextKey({
      repoFullName: "jj1kim/commit-to-blog",
      branch: "main",
      commitShas: ["abc1234", "def5678"],
      model: "gpt-4o-mini",
    });
    expect(a).toBe(b);
  });

  it("커밋 순서가 달라도 같은 키 (정렬 후 해시)", () => {
    const a = makeContextKey({
      repoFullName: "jj1kim/repo",
      branch: "main",
      commitShas: ["abc1234", "def5678"],
      model: "gpt-4o-mini",
    });
    const b = makeContextKey({
      repoFullName: "jj1kim/repo",
      branch: "main",
      commitShas: ["def5678", "abc1234"],
      model: "gpt-4o-mini",
    });
    expect(a).toBe(b);
  });

  it("브랜치가 다르면 다른 키", () => {
    const a = makeContextKey({
      repoFullName: "jj1kim/repo",
      branch: "main",
      commitShas: ["abc1234"],
      model: "gpt-4o-mini",
    });
    const b = makeContextKey({
      repoFullName: "jj1kim/repo",
      branch: "feature/x",
      commitShas: ["abc1234"],
      model: "gpt-4o-mini",
    });
    expect(a).not.toBe(b);
  });

  it("모델이 다르면 다른 키", () => {
    const a = makeContextKey({
      repoFullName: "jj1kim/repo",
      branch: "main",
      commitShas: ["abc1234"],
      model: "gpt-4o-mini",
    });
    const b = makeContextKey({
      repoFullName: "jj1kim/repo",
      branch: "main",
      commitShas: ["abc1234"],
      model: "gpt-4o",
    });
    expect(a).not.toBe(b);
  });

  it("`sha256-` prefix 가 붙는다", () => {
    const k = makeContextKey({
      repoFullName: "x/y",
      branch: "main",
      commitShas: ["abcdef0"],
      model: "m",
    });
    expect(k).toMatch(/^sha256-[a-f0-9]{64}$/);
  });
});

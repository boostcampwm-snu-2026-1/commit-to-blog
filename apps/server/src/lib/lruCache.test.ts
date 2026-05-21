import { describe, expect, it } from "vitest";
import { LruCache } from "./lruCache.js";

describe("LruCache", () => {
  it("기본 get/set", () => {
    const c = new LruCache<string, number>(3);
    c.set("a", 1);
    expect(c.get("a")).toBe(1);
    expect(c.get("b")).toBeUndefined();
  });

  it("용량 초과 시 가장 오래된 항목 제거", () => {
    const c = new LruCache<string, number>(2);
    c.set("a", 1);
    c.set("b", 2);
    c.set("c", 3); // a 제거
    expect(c.get("a")).toBeUndefined();
    expect(c.get("b")).toBe(2);
    expect(c.get("c")).toBe(3);
  });

  it("get 호출이 최근 사용으로 갱신", () => {
    const c = new LruCache<string, number>(2);
    c.set("a", 1);
    c.set("b", 2);
    c.get("a"); // a 가 최근으로 이동
    c.set("c", 3); // b 가 제거되어야 함
    expect(c.get("a")).toBe(1);
    expect(c.get("b")).toBeUndefined();
    expect(c.get("c")).toBe(3);
  });

  it("같은 키에 다시 set 하면 갱신만 (크기 증가 X)", () => {
    const c = new LruCache<string, number>(2);
    c.set("a", 1);
    c.set("a", 99);
    expect(c.size).toBe(1);
    expect(c.get("a")).toBe(99);
  });

  it("capacity 0 또는 음수는 거부", () => {
    expect(() => new LruCache(0)).toThrow();
    expect(() => new LruCache(-1)).toThrow();
  });
});

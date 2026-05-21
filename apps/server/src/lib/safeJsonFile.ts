import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * 파일을 안전하게 JSON 으로 읽고 쓴다.
 * - 읽기: 파일이 없으면 fallback 반환.
 * - 쓰기: <path>.tmp 로 먼저 쓴 뒤 rename — 부분 쓰기로 인한 손상 방지.
 */
export async function readJsonFile<T>(path: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path, "utf-8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(value, null, 2), "utf-8");
  await rename(tmp, path);
}

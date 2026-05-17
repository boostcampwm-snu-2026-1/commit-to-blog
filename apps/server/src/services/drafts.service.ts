import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BlogDraft } from "../types/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, "../../data/drafts.json");

async function readAll(): Promise<BlogDraft[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as BlogDraft[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(drafts: BlogDraft[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(drafts, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

export async function listDrafts(): Promise<BlogDraft[]> {
  const drafts = await readAll();
  return [...drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getDraft(id: string): Promise<BlogDraft | undefined> {
  const drafts = await readAll();
  return drafts.find((d) => d.id === id);
}

export type CreateDraftInput = Omit<
  BlogDraft,
  "id" | "createdAt" | "updatedAt"
>;

export async function createDraft(input: CreateDraftInput): Promise<BlogDraft> {
  const now = new Date().toISOString();
  const draft: BlogDraft = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const drafts = await readAll();
  drafts.push(draft);
  await writeAll(drafts);
  return draft;
}

export type UpdateDraftInput = Partial<
  Pick<BlogDraft, "title" | "excerpt" | "contentMd" | "status">
>;

export async function updateDraft(
  id: string,
  patch: UpdateDraftInput,
): Promise<BlogDraft | undefined> {
  const drafts = await readAll();
  const idx = drafts.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  const existing = drafts[idx]!;
  const updated: BlogDraft = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  drafts[idx] = updated;
  await writeAll(drafts);
  return updated;
}

export async function deleteDraft(id: string): Promise<boolean> {
  const drafts = await readAll();
  const next = drafts.filter((d) => d.id !== id);
  if (next.length === drafts.length) return false;
  await writeAll(next);
  return true;
}

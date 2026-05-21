import { resolve } from "node:path";
import type { Post, PostStatus } from "@commit-to-blog/shared";
import { env } from "../../config/env.js";
import { readJsonFile, writeJsonFile } from "../../lib/safeJsonFile.js";

type StoreShape = {
  version: 1;
  posts: Post[];
};

const STORE_PATH = resolve(process.cwd(), env.DATA_DIR, "posts.json");
const FLUSH_DEBOUNCE_MS = 200;

class PostsRepository {
  private readonly map = new Map<string, Post>();
  private loaded = false;
  private flushTimer: NodeJS.Timeout | null = null;
  private flushPromise: Promise<void> = Promise.resolve();

  private async load(): Promise<void> {
    if (this.loaded) return;
    const store = await readJsonFile<StoreShape>(STORE_PATH, {
      version: 1,
      posts: [],
    });
    this.map.clear();
    for (const p of store.posts) {
      // 이전 버전 호환: tags / publishedExternalUrl 가 없는 레코드를 채워준다.
      const filled: Post = {
        ...p,
        tags: Array.isArray(p.tags) ? p.tags : [],
        publishedExternalUrl: p.publishedExternalUrl ?? null,
      };
      this.map.set(filled.id, filled);
    }
    this.loaded = true;
  }

  private scheduleFlush(): void {
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      const snapshot: StoreShape = {
        version: 1,
        posts: [...this.map.values()],
      };
      this.flushPromise = this.flushPromise.then(() =>
        writeJsonFile(STORE_PATH, snapshot).catch((err) => {
          console.error("[postsRepository] flush 실패", err);
        }),
      );
    }, FLUSH_DEBOUNCE_MS);
  }

  /** 테스트/종료 시 강제 flush. */
  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    const snapshot: StoreShape = {
      version: 1,
      posts: [...this.map.values()],
    };
    this.flushPromise = this.flushPromise.then(() =>
      writeJsonFile(STORE_PATH, snapshot),
    );
    await this.flushPromise;
  }

  async list(filter?: { status?: PostStatus | "all" }): Promise<Post[]> {
    await this.load();
    const status = filter?.status ?? "all";
    const items = [...this.map.values()];
    items.sort((a, b) =>
      (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
    );
    if (status === "all") return items;
    return items.filter((p) => p.status === status);
  }

  async get(id: string): Promise<Post | null> {
    await this.load();
    return this.map.get(id) ?? null;
  }

  async insert(post: Post): Promise<Post> {
    await this.load();
    this.map.set(post.id, post);
    this.scheduleFlush();
    return post;
  }

  async update(id: string, patch: Partial<Post>): Promise<Post | null> {
    await this.load();
    const existing = this.map.get(id);
    if (!existing) return null;
    const next: Post = {
      ...existing,
      ...patch,
      id: existing.id, // immutable
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.map.set(id, next);
    this.scheduleFlush();
    return next;
  }

  async delete(id: string): Promise<boolean> {
    await this.load();
    const had = this.map.delete(id);
    if (had) this.scheduleFlush();
    return had;
  }
}

export const postsRepository = new PostsRepository();

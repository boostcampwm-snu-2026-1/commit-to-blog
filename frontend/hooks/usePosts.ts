"use client";

import { useEffect, useState } from "react";
import { api, BlogPost, Draft } from "@/lib/api";

export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.posts().then(setPosts).catch(() => setPosts([]));
  }, []);

  function upsertPost(post: BlogPost) {
    setPosts((current) => {
      const exists = current.some((item) => item.id === post.id);
      return exists ? current.map((item) => (item.id === post.id ? post : item)) : [post, ...current];
    });
  }

  async function updatePost(id: number, payload: Draft) {
    const updated = await api.updatePost(id, payload);
    upsertPost(updated);
    return updated;
  }

  return { posts, upsertPost, updatePost };
}

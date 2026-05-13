"use client";

import { useEffect, useState } from "react";
import { api, BlogPost, Draft, PostAnalytics, PostStatus } from "@/lib/api";

export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<PostAnalytics | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  useEffect(() => {
    const status = statusFilter === "all" ? undefined : statusFilter;
    api.posts({ status }).then(setPosts).catch(() => setPosts([]));
  }, [statusFilter]);

  useEffect(() => {
    refreshAnalytics();
  }, []);

  function refreshAnalytics() {
    api.postAnalytics().then(setAnalytics).catch(() => setAnalytics(null));
  }

  function upsertPost(post: BlogPost) {
    setPosts((current) => {
      const exists = current.some((item) => item.id === post.id);
      const next = exists ? current.map((item) => (item.id === post.id ? post : item)) : [post, ...current];
      return statusFilter === "all" || post.status === statusFilter ? next : next.filter((item) => item.id !== post.id);
    });
    refreshAnalytics();
  }

  async function updatePost(id: number, payload: Draft) {
    const updated = await api.updatePost(id, payload);
    upsertPost(updated);
    return updated;
  }

  async function likePost(id: number) {
    const updated = await api.likePost(id);
    upsertPost(updated);
  }

  async function commentPost(id: number) {
    const updated = await api.commentPost(id);
    upsertPost(updated);
  }

  return {
    posts,
    analytics,
    statusFilter,
    setStatusFilter,
    upsertPost,
    updatePost,
    likePost,
    commentPost,
  };
}

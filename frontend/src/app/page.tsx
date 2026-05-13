"use client";

import { useState } from "react";
import { InsightRail } from "@/features/feed/components/InsightRail";
import { SavedPosts } from "@/features/feed/components/SavedPosts";
import { usePosts } from "@/features/feed/usePosts";
import { CreateBlog } from "@/features/studio/components/CreateBlog";
import { EditPost } from "@/features/studio/components/EditPost";
import { RepositoryStories } from "@/features/studio/components/RepositoryStories";
import { useRepositories } from "@/features/studio/hooks/useRepositories";
import { AppHeader } from "@/shared/components/AppHeader";
import { BlogPost, Draft } from "@/shared/api/client";

type Tab = "saved" | "create";

export default function Home() {
  const [tab, setTab] = useState<Tab>("saved");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const repositories = useRepositories();
  const { posts, analytics, statusFilter, setStatusFilter, upsertPost, updatePost, likePost, commentPost } = usePosts();

  function handleSaved(post: BlogPost) {
    upsertPost(post);
    setTab("saved");
  }

  async function saveEditing(payload: Draft) {
    if (!editing) return;
    await updatePost(editing.id, payload);
    setEditing(null);
    setTab("saved");
  }

  return (
    <div className="appShell">
      <AppHeader tab={tab} onTabChange={setTab} />

      <main className="main">
        <RepositoryStories repositories={repositories} onSelect={() => setTab("create")} />

        <div className="layoutGrid">
          <div>
            <div className="feedToolbar">
              <button className={statusFilter === "all" ? "active" : ""} onClick={() => setStatusFilter("all")}>
                All
              </button>
              <button className={statusFilter === "draft" ? "active" : ""} onClick={() => setStatusFilter("draft")}>
                Drafts
              </button>
              <button className={statusFilter === "published" ? "active" : ""} onClick={() => setStatusFilter("published")}>
                Published
              </button>
            </div>
            {tab === "saved" ? (
              <SavedPosts
                posts={posts}
                onChanged={upsertPost}
                onLike={likePost}
                onComment={commentPost}
                onEdit={(post) => {
                  setEditing(post);
                  setTab("create");
                }}
              />
            ) : editing ? (
              <EditPost post={editing} onCancel={() => setEditing(null)} onSave={saveEditing} />
            ) : (
              <CreateBlog onSaved={handleSaved} />
            )}
          </div>
          <InsightRail posts={posts} analytics={analytics} />
        </div>
      </main>
    </div>
  );
}

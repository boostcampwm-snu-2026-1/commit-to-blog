"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CreateBlog } from "@/components/CreateBlog";
import { EditPost } from "@/components/EditPost";
import { InsightRail } from "@/components/InsightRail";
import { RepositoryStories } from "@/components/RepositoryStories";
import { SavedPosts } from "@/components/SavedPosts";
import { usePosts } from "@/hooks/usePosts";
import { useRepositories } from "@/hooks/useRepositories";
import { BlogPost, Draft } from "@/lib/api";

type Tab = "saved" | "create";

export default function Home() {
  const [tab, setTab] = useState<Tab>("saved");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const repositories = useRepositories();
  const { posts, upsertPost, updatePost } = usePosts();

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
            {tab === "saved" ? (
              <SavedPosts
                posts={posts}
                onChanged={upsertPost}
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
          <InsightRail posts={posts} />
        </div>
      </main>
    </div>
  );
}

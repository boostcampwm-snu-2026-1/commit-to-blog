"use client";

import { BookOpenText, FilePlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateBlog } from "@/components/CreateBlog";
import { SavedPosts } from "@/components/SavedPosts";
import { api, BlogPost, Draft } from "@/lib/api";

type Tab = "saved" | "create";

export default function Home() {
  const [tab, setTab] = useState<Tab>("saved");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  useEffect(() => {
    api.posts().then(setPosts).catch(() => setPosts([]));
  }, []);

  function upsertPost(post: BlogPost) {
    setPosts((current) => {
      const exists = current.some((item) => item.id === post.id);
      return exists ? current.map((item) => (item.id === post.id ? post : item)) : [post, ...current];
    });
    setTab("saved");
  }

  async function saveEditing(payload: Draft) {
    if (!editing) return;
    const updated = await api.updatePost(editing.id, payload);
    setEditing(null);
    upsertPost(updated);
  }

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brand">
          <BookOpenText size={22} />
          <span>Commit to Blog</span>
        </div>
        <nav className="navTabs" aria-label="화면 선택">
          <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
            저장된 포스트
          </button>
          <button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}>
            <FilePlus2 size={16} /> 포스트 작성
          </button>
        </nav>
      </header>

      <main className="main">
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
          <CreateBlog onSaved={upsertPost} />
        )}
      </main>
    </div>
  );
}

function EditPost({ post, onCancel, onSave }: { post: BlogPost; onCancel: () => void; onSave: (draft: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>({
    title: post.title,
    branch: post.branch,
    summary: post.summary,
    content: post.content,
  });

  return (
    <section className="panel editorGrid" aria-label="포스트 수정">
      <h2>포스트 수정</h2>
      <div className="field">
        <label htmlFor="edit-title">Title</label>
        <input id="edit-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="edit-summary">Summary</label>
        <textarea
          id="edit-summary"
          rows={3}
          value={draft.summary}
          onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="edit-content">Content</label>
        <textarea
          id="edit-content"
          rows={18}
          value={draft.content}
          onChange={(event) => setDraft({ ...draft, content: event.target.value })}
        />
      </div>
      <div className="actions">
        <button onClick={onCancel}>취소</button>
        <button className="primary" onClick={() => onSave(draft)}>
          저장
        </button>
      </div>
    </section>
  );
}

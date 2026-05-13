"use client";

import { BookOpenText, FilePlus2, Home as HomeIcon, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateBlog } from "@/components/CreateBlog";
import { SavedPosts } from "@/components/SavedPosts";
import { api, BlogPost, Draft, Repository } from "@/lib/api";

type Tab = "saved" | "create";

export default function Home() {
  const [tab, setTab] = useState<Tab>("saved");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  useEffect(() => {
    api.posts().then(setPosts).catch(() => setPosts([]));
    api.repositories().then(setRepositories).catch(() => setRepositories([]));
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
          <span className="brandMark">
            <BookOpenText size={19} />
          </span>
          <span>Commitgram</span>
        </div>
        <div className="searchBox">
          <Search size={16} />
          <span>Search repositories, branches, posts</span>
        </div>
        <nav className="navTabs" aria-label="화면 선택">
          <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
            <HomeIcon size={16} /> Feed
          </button>
          <button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}>
            <FilePlus2 size={16} /> Studio
          </button>
        </nav>
      </header>

      <main className="main">
        <section className="stories" aria-label="저장소 스토리">
          {repositories.map((repo) => (
            <button className="story" key={repo.id} onClick={() => setTab("create")}>
              <span className="avatarRing">
                <span className="avatarInner">{repo.name.slice(0, 1).toUpperCase()}</span>
              </span>
              <span>{repo.name}</span>
            </button>
          ))}
        </section>

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
              <CreateBlog onSaved={upsertPost} />
            )}
          </div>
          <aside className="rail">
            <section className="panel">
              <h3>MVP Scope</h3>
              <p className="muted">GitHub 활동을 선택하고 Claude 형식의 LLM 요약을 거쳐 바로 공유 가능한 개발 포스트로 저장합니다.</p>
            </section>
            <section className="panel">
              <h3>Mock Safe</h3>
              <p className="muted">키가 없어도 Repository, Commit, Diff summary, AI draft, Publish 흐름이 동작합니다.</p>
            </section>
            <section className="panel">
              <h3>
                <Sparkles size={16} /> Signal
              </h3>
              <div className="metricGrid">
                <div className="metric">
                  <strong>{posts.length}</strong>
                  <span>posts</span>
                </div>
                <div className="metric">
                  <strong>{posts.filter((post) => post.status === "published").length}</strong>
                  <span>live</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function EditPost({ post, onCancel, onSave }: { post: BlogPost; onCancel: () => void; onSave: (draft: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>({
    title: post.title,
    repository_full_name: post.repository_full_name,
    branch: post.branch,
    summary: post.summary,
    content: post.content,
    hero_emoji: post.hero_emoji,
    author: post.author,
    reading_minutes: post.reading_minutes,
  });

  return (
    <section className="panel editorGrid" aria-label="포스트 수정">
      <div className="composerPreview">
        <span className="emoji">{draft.hero_emoji}</span>
        <strong>{draft.title}</strong>
        <span>{draft.summary}</span>
      </div>
      <div className="field">
        <label htmlFor="edit-title">Title</label>
        <input id="edit-title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="edit-summary">Caption</label>
        <textarea
          id="edit-summary"
          rows={3}
          value={draft.summary}
          onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="edit-content">Markdown Body</label>
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

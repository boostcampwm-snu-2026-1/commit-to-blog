"use client";

import { FilePenLine, GitBranch, RefreshCw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, BlogPost, Branch, Commit, Draft, Repository } from "@/lib/api";

type Props = {
  onSaved: (post: BlogPost) => void;
};

const emptyDraft: Draft = {
  title: "",
  branch: "",
  summary: "",
  content: "",
};

export function CreateBlog({ onSaved }: Props) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [repository, setRepository] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .repositories()
      .then((items) => {
        setRepositories(items);
        if (items[0]) {
          setRepository(items[0].full_name);
        }
      })
      .catch(() => setError("저장소 목록을 불러오지 못했습니다."));
  }, []);

  useEffect(() => {
    if (!repository) return;
    api
      .branches(repository)
      .then((items) => {
        setBranches(items);
        setBranch(items[0]?.name ?? "");
      })
      .catch(() => setError("브랜치 목록을 불러오지 못했습니다."));
  }, [repository]);

  useEffect(() => {
    if (!repository || !branch) return;
    api
      .commits(repository, branch)
      .then((items) => {
        setCommits(items);
        setSelectedCommits(items.slice(0, 2).map((commit) => commit.sha));
      })
      .catch(() => setError("커밋 목록을 불러오지 못했습니다."));
  }, [repository, branch]);

  const canGenerate = useMemo(() => repository && branch && selectedCommits.length > 0, [repository, branch, selectedCommits]);
  const canSave = draft.title.trim() && draft.summary.trim() && draft.content.trim();

  function toggleCommit(sha: string) {
    setSelectedCommits((current) => (current.includes(sha) ? current.filter((item) => item !== sha) : [...current, sha]));
  }

  async function generateDraft() {
    if (!canGenerate) return;
    setLoading(true);
    setError("");
    try {
      const generated = await api.draft({
        repository_full_name: repository,
        branch,
        commit_shas: selectedCommits,
      });
      setDraft(generated);
    } catch {
      setError("AI 초안 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft() {
    if (!canSave) return;
    setLoading(true);
    setError("");
    try {
      const saved = await api.createPost(draft);
      onSaved(saved);
    } catch {
      setError("포스트 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="workspace" aria-label="포스트 작성">
      <aside className="panel">
        <h2>포스트 작성</h2>
        <div className="field">
          <label htmlFor="repository">Repository</label>
          <select id="repository" value={repository} onChange={(event) => setRepository(event.target.value)}>
            {repositories.map((item) => (
              <option key={item.id} value={item.full_name}>
                {item.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="branch">Branch</label>
          <select id="branch" value={branch} onChange={(event) => setBranch(event.target.value)}>
            {branches.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="tagRow">
          <span className="tag">
            <GitBranch size={13} /> {branch || "branch"}
          </span>
          <span className="muted">{selectedCommits.length} commits selected</span>
        </div>
        <div className="commitList">
          {commits.map((commit) => (
            <label className="commitItem" key={commit.sha}>
              <input type="checkbox" checked={selectedCommits.includes(commit.sha)} onChange={() => toggleCommit(commit.sha)} />
              <span>
                <strong>{commit.message}</strong>
                <span className="muted">
                  {commit.sha} · {commit.author}
                </span>
              </span>
            </label>
          ))}
        </div>
        <button className="primary" onClick={generateDraft} disabled={!canGenerate || loading} title="AI 초안 생성">
          {loading ? <RefreshCw size={16} /> : <FilePenLine size={16} />} Create Blog
        </button>
        {error ? <p className="error">{error}</p> : null}
      </aside>

      <article className="panel editorGrid">
        <h2>편집기</h2>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            rows={3}
            value={draft.summary}
            onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            rows={16}
            value={draft.content}
            onChange={(event) => setDraft({ ...draft, content: event.target.value })}
          />
        </div>
        <div className="actions">
          <button className="primary" onClick={saveDraft} disabled={!canSave || loading} title="저장">
            <Save size={16} /> 저장
          </button>
        </div>
      </article>
    </section>
  );
}

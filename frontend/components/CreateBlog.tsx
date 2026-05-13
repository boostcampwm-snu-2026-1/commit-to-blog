"use client";

import { FilePenLine, GitBranch, RefreshCw, Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, BlogPost, Branch, Commit, Draft, Repository } from "@/lib/api";

type Props = {
  onSaved: (post: BlogPost) => void;
};

const emptyDraft: Draft = {
  title: "",
  repository_full_name: "",
  branch: "",
  summary: "",
  content: "",
  hero_emoji: "🚀",
  author: "AI Devlog",
  reading_minutes: 3,
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
        if (items[0]) setRepository(items[0].full_name);
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

  const selected = useMemo(() => commits.filter((commit) => selectedCommits.includes(commit.sha)), [commits, selectedCommits]);
  const metrics = useMemo(
    () => ({
      commits: selected.length,
      files: selected.reduce((sum, commit) => sum + commit.changed_files, 0),
      additions: selected.reduce((sum, commit) => sum + commit.additions, 0),
      deletions: selected.reduce((sum, commit) => sum + commit.deletions, 0),
    }),
    [selected],
  );
  const canGenerate = repository && branch && selectedCommits.length > 0;
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
      setDraft(emptyDraft);
    } catch {
      setError("포스트 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="workspace" aria-label="포스트 작성">
      <aside className="panel">
        <h2>Post Studio</h2>
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
        <div className="metricGrid">
          <Metric label="commits" value={metrics.commits} />
          <Metric label="files" value={metrics.files} />
          <Metric label="add" value={`+${metrics.additions}`} />
          <Metric label="del" value={`-${metrics.deletions}`} />
        </div>
        <div className="tagRow">
          <span className="tag">
            <GitBranch size={13} /> {branch || "branch"}
          </span>
          <span className="muted">{selectedCommits.length} selected</span>
        </div>
        <div className="commitList">
          {commits.map((commit) => (
            <label className="commitItem" key={commit.sha}>
              <input type="checkbox" checked={selectedCommits.includes(commit.sha)} onChange={() => toggleCommit(commit.sha)} />
              <span>
                <strong>{commit.message}</strong>
                <span className="commitStats">
                  {commit.sha} · {commit.changed_files} files · +{commit.additions}/-{commit.deletions}
                </span>
              </span>
            </label>
          ))}
        </div>
        <button className="primary" onClick={generateDraft} disabled={!canGenerate || loading} title="AI 초안 생성">
          {loading ? <RefreshCw size={16} /> : <Sparkles size={16} />} Create Blog
        </button>
        {error ? <p className="error">{error}</p> : null}
      </aside>

      <article className="panel editorGrid">
        <div className="composerPreview">
          <span className="emoji">{draft.hero_emoji}</span>
          <strong>{draft.title || "AI가 생성할 개발 포스트 미리보기"}</strong>
          <span>{draft.summary || "커밋을 선택하고 Create Blog를 누르면 SNS 피드형 초안이 채워집니다."}</span>
        </div>
        <div className="field">
          <label htmlFor="hero">Hero</label>
          <input id="hero" value={draft.hero_emoji} onChange={(event) => setDraft({ ...draft, hero_emoji: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="summary">Caption</label>
          <textarea
            id="summary"
            rows={3}
            value={draft.summary}
            onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="content">Markdown Body</label>
          <textarea
            id="content"
            rows={14}
            value={draft.content}
            onChange={(event) => setDraft({ ...draft, content: event.target.value })}
          />
        </div>
        <div className="actions">
          <button className="primary" onClick={saveDraft} disabled={!canSave || loading} title="저장">
            <Save size={16} /> 저장
          </button>
          <button className="ghost" onClick={generateDraft} disabled={!canGenerate || loading}>
            <FilePenLine size={16} /> 다시 생성
          </button>
        </div>
      </article>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

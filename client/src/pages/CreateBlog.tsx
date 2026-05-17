import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ApiError,
  createPost,
  generateDraft,
  listBranches,
  listCommits,
  listRepos,
  type BranchSummary,
  type CommitSummary,
  type RepoSummary,
} from '../api';

type Step = 'select' | 'generating' | 'edit' | 'saving';

function firstLine(s: string): string {
  const idx = s.indexOf('\n');
  return idx === -1 ? s : s.slice(0, idx);
}

function extractTitle(markdown: string): string {
  const first = firstLine(markdown).trim();
  if (first.startsWith('# ')) return first.slice(2).trim();
  return '';
}

function formatDate(iso: string): string {
  // Robust YYYY-MM-DD extraction; falls back to original string on parse failure.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return String(e);
}

export default function CreateBlog() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('select');
  const [error, setError] = useState<string | null>(null);

  const [repos, setRepos] = useState<RepoSummary[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<RepoSummary | null>(null);

  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [selectedCommitShas, setSelectedCommitShas] = useState<Set<string>>(
    () => new Set(),
  );

  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load repos on mount.
  useEffect(() => {
    let cancelled = false;
    setReposLoading(true);
    setError(null);
    listRepos()
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(errorMessage(e));
      })
      .finally(() => {
        if (cancelled) return;
        setReposLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load branches when repo changes.
  useEffect(() => {
    if (!selectedRepo) {
      setBranches([]);
      return;
    }
    let cancelled = false;
    setBranchesLoading(true);
    setError(null);
    listBranches(selectedRepo.owner, selectedRepo.name)
      .then((data) => {
        if (cancelled) return;
        setBranches(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(errorMessage(e));
      })
      .finally(() => {
        if (cancelled) return;
        setBranchesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRepo]);

  // Load commits when branch changes.
  useEffect(() => {
    if (!selectedRepo || !selectedBranch) {
      setCommits([]);
      return;
    }
    let cancelled = false;
    setCommitsLoading(true);
    setError(null);
    listCommits(selectedRepo.owner, selectedRepo.name, selectedBranch)
      .then((data) => {
        if (cancelled) return;
        setCommits(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(errorMessage(e));
      })
      .finally(() => {
        if (cancelled) return;
        setCommitsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRepo, selectedBranch]);

  function onChangeRepo(fullName: string) {
    const next = repos.find((r) => r.fullName === fullName) ?? null;
    setSelectedRepo(next);
    setSelectedBranch(null);
    setCommits([]);
    setSelectedCommitShas(new Set());
  }

  function onChangeBranch(name: string) {
    setSelectedBranch(name || null);
    setSelectedCommitShas(new Set());
  }

  function toggleCommit(sha: string) {
    setSelectedCommitShas((prev) => {
      const next = new Set(prev);
      if (next.has(sha)) next.delete(sha);
      else next.add(sha);
      return next;
    });
  }

  const canGenerate =
    step === 'select' &&
    !!selectedRepo &&
    !!selectedBranch &&
    selectedCommitShas.size > 0;

  async function onGenerate() {
    if (!selectedRepo || !selectedBranch) return;
    setError(null);
    setStep('generating');
    try {
      const { markdown } = await generateDraft({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
        branch: selectedBranch,
        commits: Array.from(selectedCommitShas),
      });
      setGeneratedMarkdown(markdown);
      setTitle(extractTitle(markdown));
      setContent(markdown);
      setStep('edit');
    } catch (e) {
      setError(errorMessage(e));
      setStep('select');
    }
  }

  const canSave =
    step === 'edit' && title.trim() !== '' && content.trim() !== '' && !!selectedBranch;

  async function onSave() {
    if (!selectedBranch) return;
    setError(null);
    setStep('saving');
    try {
      await createPost({
        title: title.trim(),
        content,
        branch: selectedBranch,
        status: 'draft',
      });
      navigate('/posts');
    } catch (e) {
      setError(errorMessage(e));
      setStep('edit');
    }
  }

  const previewSource = useMemo(() => content, [content]);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Blog</h1>
        <p className="text-sm text-gray-600">
          Repository / Branch / Commit을 선택하면 AI가 블로그 초안을 작성합니다.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {step !== 'edit' && step !== 'saving' && (
        <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm">
          {/* Repository */}
          <div>
            <label
              htmlFor="repo-select"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Repository
            </label>
            <select
              id="repo-select"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              value={selectedRepo?.fullName ?? ''}
              onChange={(e) => onChangeRepo(e.target.value)}
              disabled={reposLoading || step === 'generating'}
            >
              <option value="">
                {reposLoading ? '불러오는 중...' : '저장소를 선택하세요'}
              </option>
              {repos.map((r) => (
                <option key={r.fullName} value={r.fullName}>
                  {r.fullName}
                  {r.private ? ' (private)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label
              htmlFor="branch-select"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <select
              id="branch-select"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              value={selectedBranch ?? ''}
              onChange={(e) => onChangeBranch(e.target.value)}
              disabled={!selectedRepo || branchesLoading || step === 'generating'}
            >
              <option value="">
                {!selectedRepo
                  ? '먼저 저장소를 선택하세요'
                  : branchesLoading
                    ? '불러오는 중...'
                    : '브랜치를 선택하세요'}
              </option>
              {branches.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Commits */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Commits</span>
              <span className="text-xs text-gray-500">
                {selectedCommitShas.size}개 선택됨
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto rounded border border-gray-200 bg-gray-50">
              {!selectedBranch && (
                <p className="p-4 text-sm text-gray-500">
                  먼저 브랜치를 선택하세요.
                </p>
              )}
              {selectedBranch && commitsLoading && (
                <p className="p-4 text-sm text-gray-500">불러오는 중...</p>
              )}
              {selectedBranch && !commitsLoading && commits.length === 0 && (
                <p className="p-4 text-sm text-gray-500">커밋이 없습니다.</p>
              )}
              {selectedBranch &&
                !commitsLoading &&
                commits.map((c) => {
                  const checked = selectedCommitShas.has(c.sha);
                  return (
                    <label
                      key={c.sha}
                      className={`flex cursor-pointer items-start gap-3 border-b border-gray-200 px-3 py-2 last:border-b-0 hover:bg-white ${
                        checked ? 'bg-white' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={checked}
                        onChange={() => toggleCommit(c.sha)}
                        disabled={step === 'generating'}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {firstLine(c.message)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.author} · {formatDate(c.date)} · {c.sha.slice(0, 7)}
                        </p>
                      </div>
                    </label>
                  );
                })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {step === 'generating' && (
              <span className="text-sm text-gray-500">초안 생성 중...</span>
            )}
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              초안 생성
            </button>
          </div>
        </div>
      )}

      {(step === 'edit' || step === 'saving') && generatedMarkdown !== null && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">초안 편집</h2>
            <div className="flex items-center gap-3">
              {step === 'saving' && (
                <span className="text-sm text-gray-500">저장 중...</span>
              )}
              <button
                type="button"
                onClick={() => {
                  setStep('select');
                  setGeneratedMarkdown(null);
                  setTitle('');
                  setContent('');
                }}
                disabled={step === 'saving'}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                다시 선택
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!canSave}
                className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                저장
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm">
              <div>
                <label
                  htmlFor="post-title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  제목
                </label>
                <input
                  id="post-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={step === 'saving'}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                  placeholder="블로그 제목을 입력하세요"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="post-content"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  본문 (Markdown)
                </label>
                <textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={step === 'saving'}
                  className="h-96 w-full resize-y rounded border border-gray-300 p-3 font-mono text-sm focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-medium text-gray-700">미리보기</p>
              <article className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewSource}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

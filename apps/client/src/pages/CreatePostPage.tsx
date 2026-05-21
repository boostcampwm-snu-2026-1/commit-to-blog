import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Draft, Repo } from "@commit-to-blog/shared";
import { useRepos } from "../features/repos/useRepos.js";
import { RepoCard } from "../features/repos/RepoCard.js";
import { useBranches } from "../features/commits/useBranches.js";
import { useCommits } from "../features/commits/useCommits.js";
import { BranchSelect } from "../features/commits/BranchSelect.js";
import { CommitPicker } from "../features/commits/CommitPicker.js";
import { AiSummaryPanel } from "../features/drafts/AiSummaryPanel.js";
import { useGenerateDraft } from "../features/drafts/useGenerateDraft.js";
import { PostEditor } from "../features/posts/PostEditor.js";
import { useCreatePost } from "../features/posts/usePosts.js";
import { Spinner } from "../components/Spinner.js";
import { Card } from "../components/Card.js";

function splitFullName(fullName: string): [string, string] {
  const [owner = "", repo = ""] = fullName.split("/", 2);
  return [owner, repo];
}

export function CreatePostPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedShas, setSelectedShas] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editorState, setEditorState] = useState<{
    title: string;
    summary: string;
    body: string;
    tags: string[];
  }>({ title: "", summary: "", body: "", tags: [] });

  const repoQuery = useRepos(query || undefined);
  const [owner, repo] = selectedRepo
    ? splitFullName(selectedRepo.fullName)
    : [null, null];
  const branchQuery = useBranches(owner, repo);
  const commitsQuery = useCommits(owner, repo, selectedBranch);

  const generateMut = useGenerateDraft();
  const createMut = useCreatePost();

  useEffect(() => {
    if (!selectedRepo) {
      setSelectedBranch(null);
      setSelectedShas([]);
      setDraft(null);
      return;
    }
    setSelectedBranch(selectedRepo.defaultBranch);
    setSelectedShas([]);
    setDraft(null);
  }, [selectedRepo]);

  useEffect(() => {
    setSelectedShas([]);
    setDraft(null);
  }, [selectedBranch]);

  const toggleSha = (sha: string) => {
    setSelectedShas((prev) =>
      prev.includes(sha) ? prev.filter((s) => s !== sha) : [...prev, sha],
    );
  };

  const canGenerate = useMemo(
    () => Boolean(selectedRepo && selectedBranch && selectedShas.length > 0),
    [selectedRepo, selectedBranch, selectedShas.length],
  );

  const handleGenerate = () => {
    if (!selectedRepo || !selectedBranch) return;
    generateMut.mutate(
      {
        repoFullName: selectedRepo.fullName,
        branch: selectedBranch,
        commitShas: selectedShas,
      },
      {
        onSuccess: ({ draft: d }) => {
          setDraft(d);
          setEditorState({
            title: d.title,
            summary: d.summary,
            body: d.body,
            tags: [],
          });
        },
      },
    );
  };

  const handleEditorChange = useCallback(
    (next: { title: string; body: string; summary: string; tags: string[] }) => {
      setEditorState(next);
    },
    [],
  );

  const handleSave = () => {
    if (!selectedRepo || !selectedBranch || !draft) return;
    createMut.mutate(
      {
        title: editorState.title,
        body: editorState.body,
        summary: editorState.summary,
        tags: editorState.tags,
        source: {
          repoFullName: selectedRepo.fullName,
          branch: selectedBranch,
          commitShas: selectedShas,
        },
      },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">블로그 생성</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          저장소를 선택하고 커밋을 골라 AI 초안을 받습니다.
        </p>
      </header>

      {/* Step 1: 저장소 선택 */}
      {!selectedRepo && (
        <>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              저장소 검색
            </label>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Repository name…"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {repoQuery.isLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Spinner /> 저장소를 불러오는 중…
            </div>
          )}

          {repoQuery.error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-900/10">
              <p className="text-sm text-red-700 dark:text-red-300">
                저장소 목록을 불러오지 못했습니다: {repoQuery.error.message}
              </p>
            </Card>
          )}

          {repoQuery.data && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {repoQuery.data.repos.map((r) => (
                <RepoCard key={r.id} repo={r} onSelect={setSelectedRepo} />
              ))}
              {repoQuery.data.repos.length === 0 && (
                <p className="col-span-full text-sm text-slate-400 dark:text-slate-500">
                  일치하는 저장소가 없습니다.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Step 2~4: 브랜치/커밋/AI/편집 */}
      {selectedRepo && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* 왼쪽: 저장소 + 브랜치 + 커밋 */}
          <div className="space-y-4">
            <Card className="border-brand/40 bg-brand-subtle/30 dark:border-brand/40 dark:bg-brand/10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand">
                    선택된 저장소
                  </p>
                  <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                    {selectedRepo.fullName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRepo(null)}
                  className="shrink-0 text-xs text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
                >
                  변경
                </button>
              </div>
            </Card>

            {branchQuery.isLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Spinner /> 브랜치를 불러오는 중…
              </div>
            )}

            {branchQuery.data && (
              <BranchSelect
                branches={branchQuery.data.branches}
                value={selectedBranch}
                onChange={setSelectedBranch}
              />
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                최근 커밋 ({selectedShas.length}개 선택됨)
              </label>
              <CommitPicker
                commits={commitsQuery.data?.commits}
                isLoading={commitsQuery.isLoading}
                error={commitsQuery.error}
                selectedShas={selectedShas}
                onToggle={toggleSha}
              />
            </div>
          </div>

          {/* 오른쪽: AI 패널 + (초안이 있으면) 편집기 */}
          <div className="space-y-4">
            <AiSummaryPanel
              draft={draft}
              isPending={generateMut.isPending}
              error={generateMut.error}
              onGenerate={handleGenerate}
              canGenerate={canGenerate}
            />

            {draft && (
              <Card>
                <h2 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  📝 편집기
                </h2>
                <PostEditor
                  initialTitle={draft.title}
                  initialSummary={draft.summary}
                  initialBody={draft.body}
                  initialTags={[]}
                  onChange={handleEditorChange}
                  disabled={createMut.isPending}
                />

                {createMut.error && (
                  <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                    저장 실패: {createMut.error.message}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(null);
                      setEditorState({ title: "", summary: "", body: "", tags: [] });
                    }}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    disabled={createMut.isPending}
                    onClick={handleSave}
                    className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {createMut.isPending
                      ? "저장 중…"
                      : "블로그 포스트로 저장 및 게시"}
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

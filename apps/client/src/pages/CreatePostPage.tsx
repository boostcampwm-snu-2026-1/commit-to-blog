import { useEffect, useState } from "react";
import type { Repo } from "@commit-to-blog/shared";
import { useRepos } from "../features/repos/useRepos.js";
import { RepoCard } from "../features/repos/RepoCard.js";
import { useBranches } from "../features/commits/useBranches.js";
import { useCommits } from "../features/commits/useCommits.js";
import { BranchSelect } from "../features/commits/BranchSelect.js";
import { CommitPicker } from "../features/commits/CommitPicker.js";
import { Spinner } from "../components/Spinner.js";
import { Card } from "../components/Card.js";

function splitFullName(fullName: string): [string, string] {
  const [owner = "", repo = ""] = fullName.split("/", 2);
  return [owner, repo];
}

export function CreatePostPage() {
  const [query, setQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedShas, setSelectedShas] = useState<string[]>([]);

  const repoQuery = useRepos(query || undefined);

  const [owner, repo] = selectedRepo
    ? splitFullName(selectedRepo.fullName)
    : [null, null];

  const branchQuery = useBranches(owner, repo);
  const commitsQuery = useCommits(owner, repo, selectedBranch);

  // 저장소 선택 시 기본 브랜치로 초기화
  useEffect(() => {
    if (!selectedRepo) {
      setSelectedBranch(null);
      setSelectedShas([]);
      return;
    }
    setSelectedBranch(selectedRepo.defaultBranch);
    setSelectedShas([]);
  }, [selectedRepo]);

  // 브랜치 바뀌면 선택 초기화
  useEffect(() => {
    setSelectedShas([]);
  }, [selectedBranch]);

  const toggleSha = (sha: string) => {
    setSelectedShas((prev) =>
      prev.includes(sha) ? prev.filter((s) => s !== sha) : [...prev, sha],
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">블로그 생성</h1>
        <p className="mt-1 text-sm text-slate-500">
          저장소를 선택하고 커밋을 골라 AI 초안을 받습니다.
        </p>
      </header>

      {/* Step 1: 저장소 선택 */}
      {!selectedRepo && (
        <>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              저장소 검색
            </label>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Repository name…"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {repoQuery.isLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Spinner /> 저장소를 불러오는 중…
            </div>
          )}

          {repoQuery.error && (
            <Card className="border-red-200 bg-red-50">
              <p className="text-sm text-red-700">
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
                <p className="col-span-full text-sm text-slate-400">
                  일치하는 저장소가 없습니다.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Step 2: 브랜치 + 커밋 선택 */}
      {selectedRepo && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-4">
            <Card className="border-brand/40 bg-brand-subtle/30">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand">선택된 저장소</p>
                  <p className="truncate text-base font-semibold text-slate-900">
                    {selectedRepo.fullName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRepo(null)}
                  className="shrink-0 text-xs text-slate-500 underline-offset-2 hover:underline"
                >
                  변경
                </button>
              </div>
            </Card>

            {branchQuery.isLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Spinner /> 브랜치를 불러오는 중…
              </div>
            )}

            {branchQuery.error && (
              <Card className="border-red-200 bg-red-50">
                <p className="text-sm text-red-700">
                  브랜치를 불러오지 못했습니다: {branchQuery.error.message}
                </p>
              </Card>
            )}

            {branchQuery.data && (
              <BranchSelect
                branches={branchQuery.data.branches}
                value={selectedBranch}
                onChange={setSelectedBranch}
              />
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
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

          <div>
            <Card className="border-dashed border-slate-300 bg-white">
              <h2 className="text-sm font-medium text-slate-700">선택된 커밋</h2>
              {selectedShas.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">
                  왼쪽에서 커밋을 선택하면 AI 요약 단계로 진행할 수 있습니다.
                </p>
              ) : (
                <ul className="mt-3 space-y-1 text-xs text-slate-700">
                  {selectedShas.map((sha) => (
                    <li key={sha} className="font-mono">
                      {sha.slice(0, 7)}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 text-xs text-slate-400">
                ▶ 다음 단계 (AI 요약 / 편집 / 저장) 는 Phase 2 이후 활성화됩니다.
              </p>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useRepos } from '../hooks/useRepos';
import { useBranches } from '../hooks/useBranches';
import { useCommits } from '../hooks/useCommits';
import { useGenerateDraft } from '../hooks/useGenerateDraft';
import RepoSearchInput from '../components/repo/RepoSearchInput';
import BranchSelect from '../components/repo/BranchSelect';
import CommitList from '../components/commit/CommitList';

function MyBlogPage() {
  const [repoQuery, setRepoQuery] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('');
  const [selectedSha, setSelectedSha] = useState<string | null>(null);

  const reposQuery = useRepos(repoQuery);
  const branchesQuery = useBranches(repo);
  const commitsQuery = useCommits(repo, branch);
  const generate = useGenerateDraft();

  // Auto-select first branch when branches load for a newly chosen repo
  useEffect(() => {
    if (branchesQuery.data?.length && !branch) {
      setBranch(branchesQuery.data[0] ?? '');
    }
  }, [branchesQuery.data, branch]);

  const handleGenerate = (sha: string) => {
    if (!repo || !branch) return;
    setSelectedSha(sha);
    generate.mutate({ repo, branch, sha });
  };

  return (
    <main className="mx-auto max-w-7xl px-8 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">저장소 검색</label>
            <RepoSearchInput value={repoQuery} onChange={setRepoQuery} />
            {reposQuery.data && reposQuery.data.length > 0 && (
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                {reposQuery.data.map((r) => (
                  <li key={r.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setRepo(r.name);
                        setBranch('');
                        setSelectedSha(null);
                      }}
                      className={[
                        'w-full rounded px-3 py-1.5 text-left text-sm hover:bg-gray-100',
                        repo === r.name ? 'bg-gray-100 font-semibold' : 'text-gray-700',
                      ].join(' ')}
                    >
                      {r.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">브랜치 선택</label>
            <BranchSelect
              branches={branchesQuery.data ?? []}
              value={branch}
              onChange={(v) => {
                setBranch(v);
                setSelectedSha(null);
              }}
              disabled={!repo}
            />
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium text-gray-700">최근 커밋</h2>
            {commitsQuery.isLoading && (
              <div className="text-sm text-gray-500">로딩 중...</div>
            )}
            {commitsQuery.data && (
              <CommitList
                commits={commitsQuery.data}
                selectedSha={selectedSha}
                onSelect={(c) => setSelectedSha(c.sha)}
                onGenerateSummary={(c) => handleGenerate(c.sha)}
              />
            )}
          </div>
        </aside>

        <section className="rounded-md border border-gray-200 bg-white p-6">
          {generate.isIdle && (
            <p className="text-sm text-gray-500">
              왼쪽에서 커밋을 선택해 "요약 생성"을 누르세요.
            </p>
          )}
          {generate.isPending && (
            <p className="text-sm text-gray-500">요약 생성 중...</p>
          )}
          {generate.isError && (
            <p className="text-sm text-red-600">{generate.error.message}</p>
          )}
          {generate.data && (
            <article>
              <h2 className="text-xl font-bold text-gray-900">{generate.data.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{generate.data.summary}</p>
              <div className="mt-4 whitespace-pre-wrap text-sm text-gray-800">
                {generate.data.body}
              </div>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}

export default MyBlogPage;

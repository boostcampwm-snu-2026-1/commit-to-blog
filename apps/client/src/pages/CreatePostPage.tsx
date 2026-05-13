import { useState } from "react";
import type { Repo } from "@commit-to-blog/shared";
import { useRepos } from "../features/repos/useRepos.js";
import { RepoCard } from "../features/repos/RepoCard.js";
import { Spinner } from "../components/Spinner.js";
import { Card } from "../components/Card.js";

export function CreatePostPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Repo | null>(null);
  const { data, isLoading, error } = useRepos(query || undefined);

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">블로그 생성</h1>
        <p className="mt-1 text-sm text-slate-500">
          저장소를 선택하고 커밋을 골라 AI 초안을 받습니다. (week11: 저장소
          선택까지)
        </p>
      </header>

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

      {selected && (
        <Card className="mb-6 border-brand/40 bg-brand-subtle/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-brand">선택된 저장소</p>
              <p className="text-lg font-semibold text-slate-900">
                {selected.fullName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs text-slate-500 underline-offset-2 hover:underline"
            >
              선택 해제
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            ▶ 다음 단계 (브랜치 / 커밋 선택 / AI 요약) 는 week12에서 구현됩니다.
          </p>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner /> 저장소를 불러오는 중…
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">
            저장소 목록을 불러오지 못했습니다: {error.message}
          </p>
        </Card>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} onSelect={setSelected} />
          ))}
          {data.repos.length === 0 && (
            <p className="col-span-full text-sm text-slate-400">
              일치하는 저장소가 없습니다.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

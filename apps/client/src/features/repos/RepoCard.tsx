import type { Repo } from "@commit-to-blog/shared";
import { Card } from "../../components/Card.js";
import { formatDate } from "../../lib/formatDate.js";

type Props = {
  repo: Repo;
  onSelect?: (repo: Repo) => void;
};

export function RepoCard({ repo, onSelect }: Props) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <img
          src={repo.owner.avatarUrl}
          alt={`${repo.owner.login} avatar`}
          className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {repo.name}
            </h3>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {repo.defaultBranch}
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">{repo.fullName}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-700">
            {repo.description ?? "설명이 없습니다."}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>업데이트: {formatDate(repo.updatedAt)}</span>
            {onSelect && (
              <button
                type="button"
                onClick={() => onSelect(repo)}
                className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
              >
                선택
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

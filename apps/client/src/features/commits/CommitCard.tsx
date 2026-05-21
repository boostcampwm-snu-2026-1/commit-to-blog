import type { Commit } from "@commit-to-blog/shared";
import { formatDate } from "../../lib/formatDate.js";

type Props = {
  commit: Commit;
  selected: boolean;
  onToggle: () => void;
};

export function CommitCard({ commit, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full rounded-lg border p-3 text-left transition-colors ${
        selected
          ? "border-brand bg-brand-subtle/60 dark:border-brand dark:bg-brand/20"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {commit.message}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {commit.author.login ?? commit.author.name} ·{" "}
            {formatDate(commit.committedAt)}
          </p>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-xs font-mono ${
            selected
              ? "bg-brand text-white"
              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          {commit.shortSha}
        </span>
      </div>
    </button>
  );
}

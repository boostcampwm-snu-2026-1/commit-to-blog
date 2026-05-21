import type { Commit } from "@commit-to-blog/shared";
import { Spinner } from "../../components/Spinner.js";
import { CommitCard } from "./CommitCard.js";

type Props = {
  commits: Commit[] | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedShas: string[];
  onToggle: (sha: string) => void;
};

export function CommitPicker({
  commits,
  isLoading,
  error,
  selectedShas,
  onToggle,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner /> 커밋을 불러오는 중…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        커밋을 불러오지 못했습니다: {error.message}
      </div>
    );
  }

  if (!commits || commits.length === 0) {
    return (
      <p className="text-sm text-slate-400">표시할 커밋이 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {commits.map((c) => (
        <CommitCard
          key={c.sha}
          commit={c}
          selected={selectedShas.includes(c.sha)}
          onToggle={() => onToggle(c.sha)}
        />
      ))}
    </div>
  );
}

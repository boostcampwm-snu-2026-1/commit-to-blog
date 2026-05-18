import type { CommitSummary } from 'shared';
import CommitListItem from './CommitListItem';

type Props = {
  commits: CommitSummary[];
  selectedSha: string | null;
  onSelect: (commit: CommitSummary) => void;
  onGenerateSummary: (commit: CommitSummary) => void;
};

function CommitList({ commits, selectedSha, onSelect, onGenerateSummary }: Props) {
  if (commits.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        표시할 커밋이 없습니다.
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {commits.map((commit) => (
        <CommitListItem
          key={commit.sha}
          commit={commit}
          selected={commit.sha === selectedSha}
          onSelect={onSelect}
          onGenerateSummary={onGenerateSummary}
        />
      ))}
    </ul>
  );
}

export default CommitList;

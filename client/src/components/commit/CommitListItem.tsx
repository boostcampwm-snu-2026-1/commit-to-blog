import type { CommitSummary } from 'shared';

type Props = {
  commit: CommitSummary;
  selected: boolean;
  onSelect: (commit: CommitSummary) => void;
  onGenerateSummary: (commit: CommitSummary) => void;
};

function CommitListItem({ commit, selected, onSelect, onGenerateSummary }: Props) {
  const date = commit.date.slice(0, 10);
  return (
    <li
      onClick={() => onSelect(commit)}
      className={[
        'flex cursor-pointer items-center gap-3 rounded-md border bg-white p-4 transition-colors',
        selected
          ? 'border-gray-900 ring-1 ring-gray-900'
          : 'border-gray-200 hover:border-gray-400',
      ].join(' ')}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-gray-900">{commit.message}</div>
        <div className="mt-1 text-xs text-gray-500">
          {commit.author} · {date}
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onGenerateSummary(commit);
        }}
        className={[
          'inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          selected
            ? 'bg-gray-900 text-white hover:bg-gray-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ].join(' ')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v3M5 6l2 2M19 6l-2 2M12 8l1.5 4.5L18 14l-4.5 1.5L12 20l-1.5-4.5L6 14l4.5-1.5L12 8Z" />
        </svg>
        요약 생성
      </button>
    </li>
  );
}

export default CommitListItem;

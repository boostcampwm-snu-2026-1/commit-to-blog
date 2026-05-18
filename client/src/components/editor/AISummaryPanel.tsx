import type { Draft } from 'shared';

type Props = {
  draft: Draft;
};

function AISummaryPanel({ draft }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-blue-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M12 4v4" />
          <circle cx="9" cy="14" r="1" />
          <circle cx="15" cy="14" r="1" />
          <path d="M8 18h8" />
        </svg>
        <h3 className="font-bold">AI 요약</h3>
      </div>

      <div className="relative min-h-[200px] rounded-md bg-gray-100 p-4">
        <h4 className="text-base font-semibold text-gray-900">{draft.title}</h4>
        <p className="mt-1 text-sm text-gray-600">{draft.summary}</p>
        <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {draft.body}
        </div>
        <div className="mt-4 flex items-center justify-end gap-1 text-xs text-gray-500">
          <span>{draft.body.length} chars</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default AISummaryPanel;

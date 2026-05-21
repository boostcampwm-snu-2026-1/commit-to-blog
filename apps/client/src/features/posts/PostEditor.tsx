import { useEffect, useId, useState } from "react";

type Props = {
  initialTitle: string;
  initialBody: string;
  initialSummary: string;
  onChange: (next: { title: string; body: string; summary: string }) => void;
  disabled?: boolean;
};

export function PostEditor({
  initialTitle,
  initialBody,
  initialSummary,
  onChange,
  disabled,
}: Props) {
  const titleId = useId();
  const summaryId = useId();
  const bodyId = useId();

  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [body, setBody] = useState(initialBody);

  // 외부에서 새 초안이 들어오면 동기화 (예: 다시 요약 클릭).
  useEffect(() => setTitle(initialTitle), [initialTitle]);
  useEffect(() => setSummary(initialSummary), [initialSummary]);
  useEffect(() => setBody(initialBody), [initialBody]);

  useEffect(() => {
    onChange({ title, body, summary });
  }, [title, body, summary, onChange]);

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor={titleId}
          className="mb-1 block text-xs font-medium text-slate-600"
        >
          제목
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor={summaryId}
          className="mb-1 block text-xs font-medium text-slate-600"
        >
          한 줄 요약 (카드 미리보기)
        </label>
        <input
          id={summaryId}
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={disabled}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor={bodyId}
          className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600"
        >
          <span>본문 (마크다운)</span>
          <span className="text-slate-400">{body.length} chars</span>
        </label>
        <textarea
          id={bodyId}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={disabled}
          rows={14}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100"
        />
      </div>
    </div>
  );
}

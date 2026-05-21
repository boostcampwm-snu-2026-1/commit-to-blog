import { useEffect, useId, useState } from "react";
import { Markdown } from "../../components/Markdown.js";

type Props = {
  initialTitle: string;
  initialBody: string;
  initialSummary: string;
  initialTags?: string[];
  onChange: (next: {
    title: string;
    body: string;
    summary: string;
    tags: string[];
  }) => void;
  disabled?: boolean;
};

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function formatTags(tags: string[]): string {
  return tags.join(", ");
}

export function PostEditor({
  initialTitle,
  initialBody,
  initialSummary,
  initialTags = [],
  onChange,
  disabled,
}: Props) {
  const titleId = useId();
  const summaryId = useId();
  const bodyId = useId();
  const tagsId = useId();

  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [body, setBody] = useState(initialBody);
  const [tagsRaw, setTagsRaw] = useState(formatTags(initialTags));
  const [previewMode, setPreviewMode] = useState<"edit" | "split" | "preview">(
    "split",
  );

  useEffect(() => setTitle(initialTitle), [initialTitle]);
  useEffect(() => setSummary(initialSummary), [initialSummary]);
  useEffect(() => setBody(initialBody), [initialBody]);
  useEffect(() => setTagsRaw(formatTags(initialTags)), [initialTags]);

  useEffect(() => {
    onChange({ title, body, summary, tags: parseTags(tagsRaw) });
  }, [title, body, summary, tagsRaw, onChange]);

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor={titleId}
          className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          제목
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
        />
      </div>

      <div>
        <label
          htmlFor={summaryId}
          className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          한 줄 요약 (카드 미리보기)
        </label>
        <input
          id={summaryId}
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={disabled}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
        />
      </div>

      <div>
        <label
          htmlFor={tagsId}
          className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          태그 (쉼표로 구분)
        </label>
        <input
          id={tagsId}
          type="text"
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
          placeholder="react, typescript, refactor"
          disabled={disabled}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
          <label htmlFor={bodyId}>본문 (마크다운)</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{body.length} chars</span>
            <div className="flex overflow-hidden rounded border border-slate-300 dark:border-slate-600">
              {(["edit", "split", "preview"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPreviewMode(m)}
                  className={`px-2 py-0.5 text-[11px] ${
                    previewMode === m
                      ? "bg-brand text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {m === "edit" ? "편집" : m === "split" ? "분할" : "미리보기"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`grid gap-3 ${
            previewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {previewMode !== "preview" && (
            <textarea
              id={bodyId}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={disabled}
              rows={14}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
            />
          )}
          {previewMode !== "edit" && (
            <div className="min-h-[200px] rounded border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              {body.trim() ? (
                <Markdown body={body} />
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  본문이 비어 있습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

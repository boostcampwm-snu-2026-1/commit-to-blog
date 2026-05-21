import type { Draft } from "@commit-to-blog/shared";
import { Spinner } from "../../components/Spinner.js";
import { Card } from "../../components/Card.js";

type Props = {
  draft: Draft | null;
  isPending: boolean;
  error: Error | null;
  onGenerate: () => void;
  canGenerate: boolean;
};

export function AiSummaryPanel({
  draft,
  isPending,
  error,
  onGenerate,
  canGenerate,
}: Props) {
  return (
    <Card className="border-slate-200">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-slate-700">🤖 AI 요약</h2>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || isPending}
          className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "분석 중…" : draft ? "다시 요약" : "요약 생성"}
        </button>
      </div>

      <div className="mt-4">
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Spinner /> AI가 변경 사항을 분석 중입니다…
          </div>
        )}

        {error && !isPending && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            요약을 생성하지 못했습니다: {error.message}
          </div>
        )}

        {!isPending && !error && !draft && (
          <p className="text-sm text-slate-400">
            왼쪽에서 커밋을 선택한 뒤 “요약 생성” 을 눌러주세요.
          </p>
        )}

        {draft && !isPending && (
          <div className="space-y-2 text-sm text-slate-700">
            <p className="text-base font-semibold text-slate-900">
              {draft.title}
            </p>
            <p className="text-xs text-slate-500">
              모델: {draft.model} · {new Date(draft.generatedAt).toLocaleString("ko-KR")}
            </p>
            <p className="rounded bg-slate-50 p-3 text-sm text-slate-700">
              {draft.summary}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

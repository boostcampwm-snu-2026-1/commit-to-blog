import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/Card.js";
import { Spinner } from "../components/Spinner.js";
import { PostEditor } from "../features/posts/PostEditor.js";
import {
  usePostDetail,
  useUpdatePost,
} from "../features/posts/usePosts.js";

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const detail = usePostDetail(id ?? null);
  const updateMut = useUpdatePost(id ?? null);

  const [draft, setDraft] = useState<{
    title: string;
    summary: string;
    body: string;
  }>({ title: "", summary: "", body: "" });

  useEffect(() => {
    if (detail.data?.post) {
      setDraft({
        title: detail.data.post.title,
        summary: detail.data.post.summary,
        body: detail.data.post.body,
      });
    }
  }, [detail.data?.post]);

  if (!id) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">포스트 수정</h1>
          {detail.data?.post && (
            <p className="mt-1 text-sm text-slate-500">
              {detail.data.post.source.repoFullName} ·{" "}
              {detail.data.post.source.branch}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm text-slate-500 underline-offset-2 hover:underline"
        >
          ← 목록으로
        </button>
      </header>

      {detail.isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner /> 포스트를 불러오는 중…
        </div>
      )}

      {detail.error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">
            포스트를 불러오지 못했습니다: {detail.error.message}
          </p>
        </Card>
      )}

      {detail.data?.post && (
        <Card>
          <PostEditor
            initialTitle={detail.data.post.title}
            initialBody={detail.data.post.body}
            initialSummary={detail.data.post.summary}
            onChange={setDraft}
            disabled={updateMut.isPending}
          />

          {updateMut.error && (
            <p className="mt-3 text-sm text-red-700">
              저장 실패: {updateMut.error.message}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              disabled={updateMut.isPending}
              onClick={() => {
                updateMut.mutate(draft, {
                  onSuccess: () => navigate("/"),
                });
              }}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {updateMut.isPending ? "저장 중…" : "저장"}
            </button>
          </div>
        </Card>
      )}
    </section>
  );
}

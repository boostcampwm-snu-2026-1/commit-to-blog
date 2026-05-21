import { Link, useParams } from "react-router-dom";
import { Card } from "../components/Card.js";
import { Markdown } from "../components/Markdown.js";
import { Spinner } from "../components/Spinner.js";
import { TagChips } from "../features/posts/TagChips.js";
import { usePostDetail } from "../features/posts/usePosts.js";
import { formatDate } from "../lib/formatDate.js";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = usePostDetail(id ?? null);

  const copyShareUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      window.alert(`URL을 복사했습니다:\n${url}`);
    } catch {
      window.prompt("아래 URL 을 복사하세요:", url);
    }
  };

  return (
    <article className="mx-auto max-w-4xl px-6 py-8">
      <nav className="mb-6 flex items-center justify-between text-sm">
        <Link
          to="/"
          className="text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
        >
          ← 저장된 포스트
        </Link>
        {data?.post && (
          <button
            type="button"
            onClick={copyShareUrl}
            className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            공유 URL 복사
          </button>
        )}
      </nav>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner /> 포스트를 불러오는 중…
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-900/10">
          <p className="text-sm text-red-700 dark:text-red-300">
            포스트를 불러오지 못했습니다: {error.message}
          </p>
        </Card>
      )}

      {data?.post && (
        <Card>
          <header className="mb-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-700 dark:text-slate-200">
                {data.post.source.branch}
              </span>
              <span>{data.post.source.repoFullName}</span>
              <span>·</span>
              <span>업데이트: {formatDate(data.post.updatedAt)}</span>
              {data.post.status === "published" && (
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  ✓ 발행됨
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {data.post.title}
            </h1>
            <p className="text-base text-slate-700 dark:text-slate-300">
              {data.post.summary}
            </p>
            <TagChips tags={data.post.tags} size="md" />
            {data.post.publishedExternalUrl && (
              <p className="text-sm">
                <a
                  href={data.post.publishedExternalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand underline underline-offset-2 hover:opacity-80"
                >
                  🔗 GitHub Issue 에서 보기
                </a>
              </p>
            )}
          </header>

          <hr className="my-6 border-slate-200 dark:border-slate-700" />

          <Markdown body={data.post.body} />

          <hr className="my-6 border-slate-200 dark:border-slate-700" />

          <footer className="text-xs text-slate-500 dark:text-slate-400">
            <p>
              Source commits ({data.post.source.commitShas.length}):{" "}
              {data.post.source.commitShas.map((sha) => (
                <code
                  key={sha}
                  className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-700"
                >
                  {sha.slice(0, 7)}
                </code>
              ))}
            </p>
          </footer>
        </Card>
      )}
    </article>
  );
}

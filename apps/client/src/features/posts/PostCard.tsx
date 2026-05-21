import { Link } from "react-router-dom";
import type { Post } from "@commit-to-blog/shared";
import { Card } from "../../components/Card.js";
import { formatDate } from "../../lib/formatDate.js";

type Props = {
  post: Post;
  onPublishToggle: (id: string, publish: boolean) => void;
  onDelete?: (id: string) => void;
  isPublishing: boolean;
};

export function PostCard({
  post,
  onPublishToggle,
  onDelete,
  isPublishing,
}: Props) {
  const isPublished = post.status === "published";

  return (
    <Card className={isPublished ? "border-emerald-200 bg-emerald-50/50" : ""}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {post.source.branch}
        </span>
        <span className="text-xs text-slate-400">
          {formatDate(post.updatedAt)}
        </span>
      </div>

      <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900">
        {post.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
        {post.summary}
      </p>

      <p className="mt-2 truncate text-xs text-slate-400">
        {post.source.repoFullName} · {post.source.commitShas.length} 커밋
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            to={`/posts/${post.id}/edit`}
            className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            수정하기
          </Link>
          <button
            type="button"
            onClick={() => onPublishToggle(post.id, !isPublished)}
            disabled={isPublishing}
            className={`rounded-md px-3 py-1 text-xs font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isPublished
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-brand text-white hover:bg-blue-700"
            }`}
          >
            {isPublished ? "게시 취소" : "발행하기"}
          </button>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`'${post.title}' 포스트를 삭제할까요?`)) {
                onDelete(post.id);
              }
            }}
            className="text-xs text-slate-400 underline-offset-2 hover:text-red-600 hover:underline"
          >
            삭제
          </button>
        )}
      </div>

      {isPublished && (
        <p className="mt-3 text-[11px] text-emerald-700">
          ✓ 발행됨
          {post.publishedAt
            ? ` · ${formatDate(post.publishedAt)}`
            : ""}
        </p>
      )}
    </Card>
  );
}

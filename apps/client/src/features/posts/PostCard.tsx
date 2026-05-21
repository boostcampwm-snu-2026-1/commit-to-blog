import { Link } from "react-router-dom";
import type { Post } from "@commit-to-blog/shared";
import { Card } from "../../components/Card.js";
import { formatDate } from "../../lib/formatDate.js";
import { TagChips } from "./TagChips.js";

type Props = {
  post: Post;
  onPublishToggle: (id: string, publish: boolean) => void;
  onPublishExternal?: (id: string) => void;
  onDelete?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  isPublishing: boolean;
  isPublishingExternal?: boolean;
  activeTag?: string | null;
};

export function PostCard({
  post,
  onPublishToggle,
  onPublishExternal,
  onDelete,
  onTagClick,
  isPublishing,
  isPublishingExternal,
  activeTag,
}: Props) {
  const isPublished = post.status === "published";

  return (
    <Card
      className={
        isPublished
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-900/10"
          : ""
      }
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {post.source.branch}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {formatDate(post.updatedAt)}
        </span>
      </div>

      <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
        <Link
          to={`/posts/${post.id}`}
          className="hover:underline underline-offset-2"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
        {post.summary}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-2">
          <TagChips
            tags={post.tags}
            activeTag={activeTag ?? null}
            onToggle={onTagClick}
          />
        </div>
      )}

      <p className="mt-2 truncate text-xs text-slate-400 dark:text-slate-500">
        {post.source.repoFullName} · {post.source.commitShas.length} 커밋
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/posts/${post.id}/edit`}
            className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
          {isPublished && onPublishExternal && (
            <button
              type="button"
              onClick={() => onPublishExternal(post.id)}
              disabled={isPublishingExternal}
              className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isPublishingExternal ? "전송 중…" : "GitHub Issue 로 보내기"}
            </button>
          )}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`'${post.title}' 포스트를 삭제할까요?`)) {
                onDelete(post.id);
              }
            }}
            className="text-xs text-slate-400 underline-offset-2 hover:text-red-600 hover:underline dark:text-slate-500"
          >
            삭제
          </button>
        )}
      </div>

      {isPublished && (
        <p className="mt-3 text-[11px] text-emerald-700 dark:text-emerald-400">
          ✓ 발행됨
          {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
        </p>
      )}
      {post.publishedExternalUrl && (
        <p className="mt-1 truncate text-[11px]">
          <a
            href={post.publishedExternalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand underline underline-offset-2 hover:opacity-80"
          >
            🔗 외부 발행 링크
          </a>
        </p>
      )}
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card.js";
import { Spinner } from "../components/Spinner.js";
import { PostCard } from "../features/posts/PostCard.js";
import {
  useDeletePost,
  usePostsList,
  usePublishExternal,
  usePublishPost,
} from "../features/posts/usePosts.js";

export function SavedPostsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, error } = usePostsList({
    status: "all",
    q: debouncedQ || undefined,
    tag: activeTag || undefined,
  });
  const publishMut = usePublishPost();
  const externalMut = usePublishExternal();
  const deleteMut = useDeletePost();

  const handlePublishToggle = (id: string, publish: boolean) => {
    publishMut.mutate({ id, publish });
  };

  const handlePublishExternal = (id: string) => {
    externalMut.mutate(
      { id },
      {
        onSuccess: ({ url }) => {
          window.alert(`GitHub Issue 에 발행되었습니다:\n${url}`);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteMut.mutate(id);
  };

  const handleTagToggle = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            저장된 포스트
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            AI가 생성한 초안과 발행된 커밋 로그 목록입니다.
          </p>
        </div>
        <Link
          to="/create"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          + 블로그 생성
        </Link>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="제목 / 요약 / 본문 검색…"
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        {activeTag && (
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="rounded-md bg-brand-subtle px-3 py-2 text-xs font-medium text-brand hover:opacity-80 dark:bg-brand/20"
          >
            태그 필터: #{activeTag} ✕
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner /> 포스트를 불러오는 중…
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-900/10">
          <p className="text-sm text-red-700 dark:text-red-300">
            포스트 목록을 불러오지 못했습니다: {error.message}
          </p>
        </Card>
      )}

      {data && data.posts.length === 0 && (
        <Card>
          <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
            {debouncedQ || activeTag ? (
              <>일치하는 포스트가 없습니다.</>
            ) : (
              <>
                아직 저장된 포스트가 없습니다. <br />
                오른쪽 위의 “+ 블로그 생성” 버튼으로 첫 포스트를 만들어보세요.
              </>
            )}
          </p>
        </Card>
      )}

      {data && data.posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onPublishToggle={handlePublishToggle}
              onPublishExternal={handlePublishExternal}
              onDelete={handleDelete}
              onTagClick={handleTagToggle}
              activeTag={activeTag}
              isPublishing={
                (publishMut.isPending && publishMut.variables?.id === p.id) ||
                (deleteMut.isPending && deleteMut.variables === p.id)
              }
              isPublishingExternal={
                externalMut.isPending && externalMut.variables?.id === p.id
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

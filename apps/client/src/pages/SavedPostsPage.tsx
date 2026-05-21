import { Link } from "react-router-dom";
import { Card } from "../components/Card.js";
import { Spinner } from "../components/Spinner.js";
import { PostCard } from "../features/posts/PostCard.js";
import {
  useDeletePost,
  usePostsList,
  usePublishPost,
} from "../features/posts/usePosts.js";

export function SavedPostsPage() {
  const { data, isLoading, error } = usePostsList("all");
  const publishMut = usePublishPost();
  const deleteMut = useDeletePost();

  const handlePublishToggle = (id: string, publish: boolean) => {
    publishMut.mutate({ id, publish });
  };

  const handleDelete = (id: string) => {
    deleteMut.mutate(id);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">저장된 포스트</h1>
          <p className="mt-1 text-sm text-slate-500">
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

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner /> 포스트를 불러오는 중…
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">
            포스트 목록을 불러오지 못했습니다: {error.message}
          </p>
        </Card>
      )}

      {data && data.posts.length === 0 && (
        <Card>
          <p className="py-12 text-center text-sm text-slate-400">
            아직 저장된 포스트가 없습니다. <br />
            오른쪽 위의 “+ 블로그 생성” 버튼으로 첫 포스트를 만들어보세요.
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
              onDelete={handleDelete}
              isPublishing={
                (publishMut.isPending && publishMut.variables?.id === p.id) ||
                (deleteMut.isPending && deleteMut.variables === p.id)
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

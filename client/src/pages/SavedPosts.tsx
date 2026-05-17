export default function SavedPosts() {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Posts</h1>
          <p className="text-sm text-gray-600">저장된 블로그 초안과 발행된 글들.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" />
    </section>
  );
}

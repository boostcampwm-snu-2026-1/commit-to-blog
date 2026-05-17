export function SavedPostsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">저장된 포스트</h2>
          <p className="mt-1 text-sm text-slate-500">
            AI가 생성한 초안과 백업된 커밋 로그 목록입니다.
          </p>
        </div>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          + 블로그 생성
        </button>
      </div>
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        아직 저장된 포스트가 없습니다. 2주차에 카드 그리드를 채웁니다.
      </div>
    </section>
  );
}

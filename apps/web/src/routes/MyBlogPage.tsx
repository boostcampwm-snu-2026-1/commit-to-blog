export function MyBlogPage() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-12 gap-6 px-6 py-10">
      <aside className="col-span-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">
            저장소 검색
          </label>
          <input
            placeholder="Repository name..."
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            disabled
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">
            브랜치 선택
          </label>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled
          >
            <option>main</option>
          </select>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">최근 커밋</h3>
          <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
            저장소를 선택하면 커밋이 표시됩니다.
          </div>
        </div>
      </aside>

      <div className="col-span-8 rounded-md border border-slate-200 bg-white p-6">
        <div className="text-sm text-slate-500">
          선택된 커밋이 없습니다. 좌측에서 커밋을 골라 "요약 생성"을 눌러주세요.
        </div>
      </div>
    </section>
  );
}

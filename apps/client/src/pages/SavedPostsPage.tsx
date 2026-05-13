import { Link } from "react-router-dom";
import { Card } from "../components/Card.js";

export function SavedPostsPage() {
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

      <Card>
        <p className="py-12 text-center text-sm text-slate-400">
          아직 저장된 포스트가 없습니다. <br />
          오른쪽 위의 “+ 블로그 생성” 버튼으로 첫 포스트를 만들어보세요.
        </p>
      </Card>

      <p className="mt-4 text-xs text-slate-400">
        ※ week11 프로토타입 — 실제 포스트 CRUD는 week12에서 구현됩니다.
      </p>
    </section>
  );
}

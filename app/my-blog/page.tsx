'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CommitListSkeleton, SummarySkeleton, PostCardSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';

export default function MyBlogPage() {
  return (
    <div className="p-8 flex flex-col gap-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">UI 컴포넌트 미리보기</h1>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-600 text-sm">Badge</h2>
        <div className="flex gap-2">
          <Badge label="main" />
          <Badge label="feature/login" />
          <Badge label="develop" />
          <Badge label="hotfix/bug" />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-600 text-sm">Button</h2>
        <div className="flex gap-3 flex-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button isLoading>로딩 중</Button>
          <Button disabled>비활성화</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-600 text-sm">Toast</h2>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => toast('저장되었습니다.', 'success')}>
            성공 토스트
          </Button>
          <Button variant="secondary" onClick={() => toast('오류가 발생했습니다.', 'error')}>
            에러 토스트
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-600 text-sm">Card</h2>
        <Card>
          <p className="text-sm text-gray-700">카드 컴포넌트 — rounded-xl border p-5 shadow-sm</p>
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold text-gray-600 text-sm">Skeleton</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">CommitList</p>
            <CommitListSkeleton />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">AiSummaryBox</p>
            <SummarySkeleton />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">PostCard</p>
            <PostCardSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}

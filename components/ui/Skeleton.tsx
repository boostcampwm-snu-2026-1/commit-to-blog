import { cn } from '@/lib/cn';

function SkeletonBase({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />;
}

// CommitList 로딩: h-16 × 4
export function CommitListSkeleton() {
  return (
    <ul className="flex flex-col gap-2 p-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <SkeletonBase className="h-16" />
        </li>
      ))}
    </ul>
  );
}

// AiSummaryBox 로딩: 텍스트 3줄 (100% / 80% / 60%)
export function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-4/5" />
      <SkeletonBase className="h-4 w-3/5" />
    </div>
  );
}

// PostCard 로딩: 이미지 영역 + 텍스트 2줄
export function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-5">
      <SkeletonBase className="h-40 w-full" />
      <SkeletonBase className="h-4 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
    </div>
  );
}

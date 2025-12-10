/**
 * @file skeleton.tsx
 * @description 스켈레톤 UI 컴포넌트
 *
 * 이 파일은 로딩 상태를 표시하는 스켈레톤 컴포넌트를 제공합니다.
 *
 * 주요 컴포넌트:
 * - Skeleton: 기본 스켈레톤
 * - SkeletonCard: 카드 형태 스켈레톤
 * - SkeletonList: 리스트 형태 스켈레톤
 *
 * @dependencies
 * - lib/utils.ts: cn 함수
 */

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

/**
 * 관광지 카드 형태의 스켈레톤
 * 실제 관광지 카드 레이아웃과 유사한 구조
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm',
        className,
      )}
    >
      {/* 이미지 영역 */}
      <Skeleton className="h-48 w-full" />

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * 리스트 형태의 스켈레톤
 * 여러 개의 SkeletonCard를 그리드로 배치
 *
 * @param count - 표시할 카드 개수 (기본값: 6)
 * @param className - 추가 CSS 클래스
 */
export function SkeletonList({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
      aria-label="로딩 중"
      role="status"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export { Skeleton };

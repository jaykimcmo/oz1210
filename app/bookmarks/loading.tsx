/**
 * @file loading.tsx
 * @description 북마크 페이지 로딩 UI
 *
 * 북마크 목록 페이지가 로딩 중일 때 표시되는 Skeleton UI입니다.
 *
 * @dependencies
 * - components/ui/skeleton.tsx: Skeleton
 */

import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookmarksLoading() {
  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* 페이지 제목 섹션 */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Star
              className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500"
              aria-hidden="true"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              내 북마크
            </h1>
          </div>
          <Skeleton className="h-5 w-32" />
        </section>

        {/* 북마크 목록 스켈레톤 */}
        <section aria-label="북마크 목록 로딩 중">
          <BookmarkListSkeleton />
        </section>
      </div>
    </main>
  );
}

/**
 * 북마크 목록 스켈레톤 컴포넌트
 */
function BookmarkListSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      aria-label="북마크 목록 로딩 중"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <BookmarkCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * 북마크 카드 스켈레톤 컴포넌트
 */
function BookmarkCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      {/* 이미지 영역 */}
      <Skeleton className="aspect-video w-full" />

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-2 p-4">
        {/* 관광지명 */}
        <Skeleton className="h-6 w-3/4" />

        {/* 주소 */}
        <Skeleton className="h-4 w-full" />

        {/* 타입 뱃지 */}
        <Skeleton className="h-5 w-16 rounded-full" />

        {/* 개요 */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}


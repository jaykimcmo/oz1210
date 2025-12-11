/**
 * @file loading.tsx
 * @description 상세페이지 로딩 UI
 *
 * 이 파일은 상세페이지 로딩 중에 표시되는 스켈레톤 UI를 제공합니다.
 *
 * @dependencies
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function DetailPageLoading() {
  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 뒤로가기 버튼 스켈레톤 */}
        <Skeleton className="h-9 w-24" />

        {/* 메인 컨텐츠 스켈레톤 */}
        <div className="mt-8 space-y-8">
          {/* 제목 스켈레톤 */}
          <Skeleton className="h-12 w-3/4" />

          {/* 이미지 스켈레톤 */}
          <Skeleton className="h-64 w-full rounded-lg" />

          {/* 정보 섹션 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* 추가 정보 스켈레톤 */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </main>
  );
}


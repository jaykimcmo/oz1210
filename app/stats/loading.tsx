/**
 * @file loading.tsx
 * @description 통계 대시보드 로딩 UI
 *
 * 이 파일은 통계 대시보드 페이지의 로딩 상태를 표시하는 컴포넌트입니다.
 *
 * @dependencies
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 * - components/stats/stats-summary.tsx: StatsSummarySkeleton 컴포넌트
 * - components/stats/region-chart.tsx: RegionChartSkeleton 컴포넌트
 */

import { Skeleton } from '@/components/ui/skeleton';
import { StatsSummarySkeleton } from '@/components/stats/stats-summary';
import { RegionChartSkeleton } from '@/components/stats/region-chart';

export default function StatsLoading() {
  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* 페이지 제목 스켈레톤 */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded" />
            <Skeleton className="h-9 sm:h-10 lg:h-12 w-48" />
          </div>
          <Skeleton className="h-5 sm:h-6 w-64" />
        </div>

        {/* 콘텐츠 영역 스켈레톤 */}
        <div className="space-y-6 sm:space-y-8">
          {/* 통계 요약 카드 스켈레톤 */}
          <section aria-label="통계 요약">
            <StatsSummarySkeleton />
          </section>

          {/* 지역별 분포 차트 스켈레톤 */}
          <section aria-label="지역별 분포">
            <RegionChartSkeleton />
          </section>

          {/* 타입별 분포 차트 스켈레톤 */}
          <section aria-label="타입별 분포">
            <Skeleton className="h-64 w-full rounded-lg" />
          </section>
        </div>
      </div>
    </main>
  );
}


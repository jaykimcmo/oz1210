/**
 * @file page.tsx
 * @description 통계 대시보드 페이지
 *
 * 이 페이지는 전국 관광지 통계를 시각화하여 보여주는 대시보드입니다.
 *
 * 주요 기능:
 * 1. 통계 요약 카드 (전체 관광지 수, Top 3 지역, Top 3 타입)
 * 2. 지역별 분포 차트 (Bar Chart)
 * 3. 타입별 분포 차트 (Donut Chart)
 *
 * 레이아웃 구조:
 * - PAGE TITLE SECTION (제목, 설명)
 * - STATS SUMMARY SECTION (통계 요약 카드)
 * - REGION CHART SECTION (지역별 분포 차트)
 * - TYPE CHART SECTION (타입별 분포 차트)
 *
 * @dependencies
 * - next: Metadata, Server Component
 * - lucide-react: BarChart3 아이콘
 * - lib/api/stats-api.ts: getStatsSummary 함수
 * - components/stats/stats-summary.tsx: StatsSummaryCards 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 통계 대시보드 요구사항
 */

import type { Metadata } from 'next';
import { BarChart3 } from 'lucide-react';
import { getStatsSummary, getRegionStats, getTypeStats } from '@/lib/api/stats-api';
import { StatsSummaryCards } from '@/components/stats/stats-summary';
import { RegionChart } from '@/components/stats/region-chart';
import { TypeChart } from '@/components/stats/type-chart';

// 동적 렌더링 강제 (빌드 시 API 호출 방지)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '통계 대시보드',
  description:
    '전국 관광지 통계를 한눈에 확인하세요. 지역별, 타입별 분포를 차트로 시각화합니다.',
  keywords: ['관광지 통계', '지역별 관광지', '관광 타입 분포', '대시보드'],
  openGraph: {
    title: '통계 대시보드 | My Trip',
    description: '전국 관광지 통계를 한눈에 확인하세요.',
    type: 'website',
    url: '/stats',
    siteName: 'My Trip',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '통계 대시보드 | My Trip',
    description: '전국 관광지 통계를 한눈에 확인하세요.',
  },
};

export default async function StatsPage() {
  // 통계 데이터 병렬 fetch
  const [summary, regionStats, typeStats] = await Promise.all([
    getStatsSummary(),
    getRegionStats(),
    getTypeStats(),
  ]);

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* 페이지 제목 섹션 */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3
              className="h-6 w-6 sm:h-8 sm:w-8 text-primary"
              aria-hidden="true"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              관광지 통계
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            전국 관광지 현황을 한눈에 확인하세요
          </p>
        </section>

        {/* 콘텐츠 영역 */}
        <div className="space-y-6 sm:space-y-8">
          {/* 통계 요약 카드 영역 */}
          <section aria-label="통계 요약">
            <StatsSummaryCards summary={summary} />
          </section>

          {/* 지역별 분포 차트 영역 */}
          <section aria-label="지역별 분포">
            <RegionChart data={regionStats} />
          </section>

          {/* 타입별 분포 차트 영역 */}
          <section aria-label="타입별 분포">
            <TypeChart data={typeStats} />
          </section>
        </div>
      </div>
    </main>
  );
}


/**
 * @file page.tsx
 * @description My Trip 홈페이지 - 관광지 목록
 *
 * 이 페이지는 전국 관광지 정보를 검색하고 조회할 수 있는 메인 페이지입니다.
 *
 * 주요 기능:
 * 1. 관광지 목록 표시 (Phase 2.2)
 * 2. 필터 및 검색 기능 (Phase 2.3)
 * 3. 네이버 지도 연동 (Phase 2.5)
 *
 * 레이아웃 구조:
 * - HERO SECTION (선택 사항)
 * - FILTERS & CONTROLS SECTION
 * - CONTENT SECTION (리스트 + 지도)
 *
 * @dependencies
 * - components/Navbar: 헤더 네비게이션
 * - components/Footer: 푸터
 * - components/tour-list.tsx: 관광지 목록 컴포넌트
 * - lib/api/tour-api.ts: getAreaBasedList 함수
 */

import { TourList } from '@/components/tour-list';
import { getAreaBasedList } from '@/lib/api/tour-api';

export default async function HomePage() {
  // API 호출 (Server Component)
  let tours = [];
  let error: Error | null = null;

  try {
    const result = await getAreaBasedList({
      numOfRows: 20,
      pageNo: 1,
    });
    tours = result.items;
  } catch (err) {
    error = err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
    console.error('[HomePage] API 호출 실패:', err);
  }
  return (
    <main className="w-full" role="main">
      {/* HERO SECTION (선택 사항) */}
      {/* Phase 2.3에서 검색 기능 구현 시 고려 */}
      {/* 
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            한국의 아름다운 관광지를 탐험하세요
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            전국 관광지 정보를 한눈에 확인하고 나만의 여행을 계획해보세요
          </p>
        </div>
      </section>
      */}

      {/* FILTERS & CONTROLS SECTION */}
      {/* Phase 2.3에서 구현 예정 */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        aria-label="필터 및 정렬"
      >
        <div className="flex flex-col gap-4">
          {/* 필터 영역 플레이스홀더 */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />
          </div>
          {/* 필터 적용 상태 표시 영역 */}
          <div className="flex flex-wrap gap-2">
            {/* 선택된 필터 표시 영역 (Phase 2.3에서 구현) */}
          </div>
        </div>
      </section>

      {/* CONTENT SECTION: LIST + MAP */}
      {/* Phase 2.2 (목록), Phase 2.5 (지도)에서 구현 예정 */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12"
        aria-label="관광지 목록 및 지도"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* LIST VIEW (좌측 또는 전체) */}
          <article className="order-2 lg:order-1" aria-label="관광지 목록">
            {/* 관광지 목록 영역 */}
            <TourList tours={tours} error={error} />
          </article>

          {/* MAP VIEW (우측 또는 탭) */}
          <aside className="order-1 lg:order-2" aria-label="지도">
            {/* 네이버 지도 영역 (Phase 2.5에서 구현) */}
            <div
              className="flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] rounded-lg border border-dashed bg-muted/20"
              role="status"
              aria-live="polite"
            >
              <p className="text-sm text-muted-foreground">
                네이버 지도가 여기에 표시됩니다
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Phase 2.5에서 구현 예정
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

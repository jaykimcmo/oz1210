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
 * - components/tour-filters.tsx: 필터 컴포넌트
 * - lib/api/tour-api.ts: getAreaCode, getAreaBasedList 함수
 */

import { TourList } from '@/components/tour-list';
import { TourFilters } from '@/components/tour-filters';
import { TourSearch } from '@/components/tour-search';
import { getAreaCode, getAreaBasedList, searchKeyword } from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // searchParams 처리 (Next.js 15는 Promise)
  const params = await searchParams;

  // 검색 파라미터 확인
  const keyword =
    typeof params.keyword === 'string' && params.keyword.trim()
      ? params.keyword.trim()
      : undefined;

  // 필터 파라미터 변환
  const areaCode =
    typeof params.areaCode === 'string' && params.areaCode
      ? params.areaCode
      : undefined;

  // contentTypeId는 쉼표로 구분된 문자열이므로 첫 번째 타입만 사용
  // (API는 단일 contentTypeId만 지원)
  const contentTypeId =
    typeof params.contentTypeId === 'string' && params.contentTypeId
      ? params.contentTypeId.split(',')[0]
      : undefined;

  // 정렬 옵션
  const sort = params.sort === 'name' ? 'name' : 'latest';

  // 지역 목록 로드 (캐싱 적용)
  let areaCodes = [];
  try {
    areaCodes = await getAreaCode();
  } catch (err) {
    console.error('[HomePage] 지역 목록 로드 실패:', err);
    // 에러 발생 시 빈 배열 사용 (필터는 동작하지 않지만 페이지는 표시)
  }

  // 관광지 목록 로드 (검색 모드 vs 목록 모드)
  let tours: TourItem[] = [];
  let totalCount = 0;
  let error: Error | null = null;

  try {
    if (keyword) {
      // 검색 모드
      const result = await searchKeyword({
        keyword,
        areaCode,
        contentTypeId,
        numOfRows: 20,
        pageNo: 1,
      });
      tours = result.items;
      totalCount = result.totalCount;
    } else {
      // 목록 모드
      const result = await getAreaBasedList({
        areaCode,
        contentTypeId,
        numOfRows: 20,
        pageNo: 1,
      });
      tours = result.items;
      totalCount = result.totalCount;
    }

    // 클라이언트 측 정렬 처리
    if (sort === 'name') {
      // 이름순 정렬 (가나다순)
      tours = [...tours].sort((a, b) =>
        a.title.localeCompare(b.title, 'ko'),
      );
    } else {
      // 최신순 정렬 (modifiedtime 내림차순)
      tours = [...tours].sort((a, b) => {
        const timeA = a.modifiedtime || '0';
        const timeB = b.modifiedtime || '0';
        return timeB.localeCompare(timeA);
      });
    }
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

      {/* SEARCH SECTION */}
      <section
        id="search-section"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        aria-label="검색"
      >
        <TourSearch initialKeyword={keyword} />
      </section>

      {/* FILTERS & CONTROLS SECTION */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        aria-label="필터 및 정렬"
      >
        <TourFilters areaCodes={areaCodes} />
      </section>

      {/* CONTENT SECTION: LIST + MAP */}
      {/* Phase 2.2 (목록), Phase 2.5 (지도)에서 구현 예정 */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12"
        aria-label="관광지 목록 및 지도"
      >
        {/* 검색 결과 개수 표시 */}
        {keyword && (
          <div className="mb-4 text-sm text-muted-foreground">
            &quot;{keyword}&quot; 검색 결과: {totalCount}개
          </div>
        )}

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

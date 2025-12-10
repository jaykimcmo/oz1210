/**
 * @file tour-content-section.tsx
 * @description 관광지 목록 및 지도 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록과 네이버 지도를 함께 표시하고, 양방향 연동을 제공합니다.
 *
 * 주요 기능:
 * 1. 관광지 목록 표시
 * 2. 네이버 지도 표시
 * 3. 리스트-지도 양방향 연동
 * 4. 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
 *
 * @dependencies
 * - components/tour-list.tsx: TourList 컴포넌트
 * - components/naver-map.tsx: NaverMap 컴포넌트
 * - components/ui/tabs.tsx: Tabs 컴포넌트 (모바일용)
 * - lib/types/tour.ts: TourItem 타입
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { TourItem } from '@/lib/types/tour';
import { TourList } from './tour-list';
import { NaverMap } from './naver-map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { List, MapPin } from 'lucide-react';
import { fetchAreaBasedList, fetchSearchKeyword } from '@/actions/tour-actions';

interface TourContentSectionProps {
  initialTours: TourItem[];
  error: Error | null;
  keyword?: string;
  areaCode?: string;
  contentTypeId?: string;
  sort?: 'name' | 'latest';
  totalCount?: number;
  numOfRows?: number;
}

/**
 * 관광지 목록 및 지도 섹션 컴포넌트
 *
 * @param initialTours - 초기 관광지 목록 (첫 페이지)
 * @param error - 에러 객체
 * @param keyword - 검색 키워드
 * @param areaCode - 지역코드
 * @param contentTypeId - 콘텐츠 타입 ID
 * @param sort - 정렬 옵션
 * @param totalCount - 전체 개수
 * @param numOfRows - 페이지당 항목 수
 */
export function TourContentSection({
  initialTours,
  error: initialError,
  keyword,
  areaCode,
  contentTypeId,
  sort = 'latest',
  totalCount = 0,
  numOfRows = 20,
}: TourContentSectionProps) {
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>();
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [error, setError] = useState<Error | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialTours.length < totalCount && totalCount > 0,
  );
  const [resetMapMarkers, setResetMapMarkers] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 필터 파라미터가 변경되면 데이터 리셋
  useEffect(() => {
    setTours(initialTours);
    setPageNo(1);
    setHasMore(initialTours.length < totalCount && totalCount > 0);
    setError(initialError);
    // 지도 마커 리셋 플래그 설정
    setResetMapMarkers(true);
    // 다음 렌더링에서 플래그 리셋
    setTimeout(() => setResetMapMarkers(false), 0);
  }, [initialTours, totalCount, initialError, keyword, areaCode, contentTypeId, sort]);

  // 다음 페이지 로드
  const loadNextPage = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    // 중복 요청 방지: 약간의 지연을 두어 빠른 스크롤 시 중복 요청 방지
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const nextPage = pageNo + 1;
      let result;

      if (keyword) {
        // 검색 모드
        result = await fetchSearchKeyword({
          keyword,
          areaCode,
          contentTypeId,
          numOfRows,
          pageNo: nextPage,
        });
      } else {
        // 목록 모드
        result = await fetchAreaBasedList({
          areaCode,
          contentTypeId,
          numOfRows,
          pageNo: nextPage,
        });
      }

      if (result.items.length === 0) {
        setHasMore(false);
      } else {
        // 클라이언트 측 정렬 처리
        let sortedItems = result.items;
        if (sort === 'name') {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.title.localeCompare(b.title, 'ko'),
          );
        } else {
          sortedItems = [...sortedItems].sort((a, b) => {
            const timeA = a.modifiedtime || '0';
            const timeB = b.modifiedtime || '0';
            return timeB.localeCompare(timeA);
          });
        }

        // 기존 데이터와 병합
        setTours((prev) => {
          const newTours = [...prev, ...sortedItems];
          // hasMore 업데이트
          setHasMore(newTours.length < result.totalCount);
          return newTours;
        });
        setPageNo(nextPage);
      }
    } catch (err) {
      console.error('[TourContentSection] 다음 페이지 로드 실패:', err);
      // 에러 발생 시에도 hasMore를 false로 설정하지 않음 (재시도 가능하도록)
      setError(
        err instanceof Error
          ? err
          : new Error('다음 페이지를 불러오는 중 오류가 발생했습니다.'),
      );
      // 에러 발생 시 자동으로 hasMore를 false로 설정하지 않고, 사용자가 재시도할 수 있도록 함
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    hasMore,
    pageNo,
    keyword,
    areaCode,
    contentTypeId,
    numOfRows,
    sort,
  ]);

  // Intersection Observer 설정
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      {
        rootMargin: '100px', // 100px 전에 미리 로드
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadNextPage]);

  // 재시도 함수
  const handleRetry = useCallback(() => {
    setError(null);
    // 현재 페이지 다시 로드
    if (hasMore && !isLoading) {
      loadNextPage();
    } else {
      // 초기 로드 실패 시 페이지 새로고침
      window.location.reload();
    }
  }, [hasMore, isLoading, loadNextPage]);

  // 관광지 클릭 핸들러
  const handleTourClick = useCallback((tour: TourItem) => {
    setSelectedTourId(tour.contentid);
  }, []);

  // 지도 클릭 핸들러 (선택 해제)
  const handleMapClick = useCallback(() => {
    setSelectedTourId(undefined);
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback((tour: TourItem) => {
    setSelectedTourId(tour.contentid);
    // 리스트 항목으로 스크롤 (선택 사항)
    const element = document.querySelector(
      `[data-tour-id="${tour.contentid}"]`,
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12"
      aria-label="관광지 목록 및 지도"
    >
      {/* 검색 결과 개수 표시 */}
      {keyword && (
        <div className="mb-4 text-sm text-muted-foreground" role="status" aria-live="polite">
          &quot;{keyword}&quot; 검색 결과: <strong>{totalCount}</strong>개
        </div>
      )}

      {/* 데스크톱: 그리드 레이아웃 */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        {/* LIST VIEW (좌측) */}
        <article className="lg:order-1" aria-label="관광지 목록">
          <TourList
            tours={tours}
            error={error}
            onRetry={handleRetry}
            selectedTourId={selectedTourId}
            onTourClick={handleTourClick}
          />
          {/* 무한 스크롤 트리거 및 로딩 인디케이터 */}
          {hasMore && (
            <div
              ref={observerTarget}
              className="flex items-center justify-center py-8"
              aria-label="다음 페이지 로딩"
            >
              {isLoading && (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">
                    더 많은 관광지를 불러오는 중...
                  </p>
                </div>
              )}
            </div>
          )}
          {!hasMore && tours.length > 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                모든 관광지를 불러왔습니다.
              </p>
            </div>
          )}
        </article>

        {/* MAP VIEW (우측) */}
        <aside className="lg:order-2" aria-label="지도">
          <NaverMap
            tours={tours}
            selectedTourId={selectedTourId}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            resetMarkers={resetMapMarkers}
          />
        </aside>
      </div>

      {/* 모바일: 탭 레이아웃 */}
      <div className="lg:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              목록
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="h-4 w-4" />
              지도
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <TourList
              tours={tours}
              error={error}
              onRetry={handleRetry}
              selectedTourId={selectedTourId}
              onTourClick={handleTourClick}
            />
            {/* 무한 스크롤 트리거 및 로딩 인디케이터 */}
            {hasMore && (
              <div
                ref={observerTarget}
                className="flex items-center justify-center py-8"
                aria-label="다음 페이지 로딩"
              >
                {isLoading && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">
                      더 많은 관광지를 불러오는 중...
                    </p>
                  </div>
                )}
              </div>
            )}
            {!hasMore && tours.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  모든 관광지를 불러왔습니다.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="map"
            className="mt-4 transition-opacity duration-200"
            onFocus={() => {
              // 탭 전환 시 지도 리사이즈를 위해 window resize 이벤트 트리거
              setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
              }, 100);
            }}
            aria-label="지도 뷰"
          >
            <NaverMap
              tours={tours}
              selectedTourId={selectedTourId}
              onMarkerClick={handleMarkerClick}
              onMapClick={handleMapClick}
              resetMarkers={resetMapMarkers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}


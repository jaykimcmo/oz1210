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

import { useState, useCallback } from 'react';
import type { TourItem } from '@/lib/types/tour';
import { TourList } from './tour-list';
import { NaverMap } from './naver-map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { List, MapPin } from 'lucide-react';

interface TourContentSectionProps {
  tours: TourItem[];
  error: Error | null;
  keyword?: string;
  totalCount?: number;
}

/**
 * 관광지 목록 및 지도 섹션 컴포넌트
 *
 * @param tours - 관광지 목록
 * @param error - 에러 객체
 * @param keyword - 검색 키워드 (검색 결과 개수 표시용)
 * @param totalCount - 전체 개수 (검색 결과 개수 표시용)
 */
export function TourContentSection({
  tours,
  error,
  keyword,
  totalCount = 0,
}: TourContentSectionProps) {
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>();

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
        <div className="mb-4 text-sm text-muted-foreground">
          &quot;{keyword}&quot; 검색 결과: {totalCount}개
        </div>
      )}

      {/* 데스크톱: 그리드 레이아웃 */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        {/* LIST VIEW (좌측) */}
        <article className="lg:order-1" aria-label="관광지 목록">
          <TourList
            tours={tours}
            error={error}
            selectedTourId={selectedTourId}
            onTourClick={handleTourClick}
          />
        </article>

        {/* MAP VIEW (우측) */}
        <aside className="lg:order-2" aria-label="지도">
          <NaverMap
            tours={tours}
            selectedTourId={selectedTourId}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
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
              selectedTourId={selectedTourId}
              onTourClick={handleTourClick}
            />
          </TabsContent>
          <TabsContent
            value="map"
            className="mt-4"
            onFocus={() => {
              // 탭 전환 시 지도 리사이즈를 위해 window resize 이벤트 트리거
              setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
              }, 100);
            }}
          >
            <NaverMap
              tours={tours}
              selectedTourId={selectedTourId}
              onMarkerClick={handleMarkerClick}
              onMapClick={handleMapClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}


'use client';

/**
 * @file detail-recommendations.tsx
 * @description 관광지 추천 섹션 컴포넌트 (Client Component)
 *
 * 이 컴포넌트는 현재 관광지와 유사한 다른 관광지들을 추천하여 표시합니다.
 * TourCard를 사용하므로 클라이언트 컴포넌트로 구현되었습니다.
 * 데이터는 Server Component(page.tsx)에서 전달받습니다.
 *
 * 주요 기능:
 * 1. 추천 관광지 목록 표시
 * 2. 카드 그리드 레이아웃 (반응형)
 * 3. 빈 상태 처리 (추천 관광지 없을 때)
 *
 * 핵심 구현 로직:
 * - Client Component로 구현 (TourCard가 클라이언트 컴포넌트이므로)
 * - TourCard 컴포넌트 재사용
 * - 반응형 그리드 레이아웃 (모바일: 1열, 태블릿: 2열, 데스크톱: 3-4열)
 * - 데이터는 Server Component에서 전달받음
 *
 * @dependencies
 * - lib/types/tour.ts: TourItem 타입
 * - components/tour-card.tsx: TourCard 컴포넌트
 */

import { TourCard } from '@/components/tour-card';
import type { TourItem } from '@/lib/types/tour';

interface DetailRecommendationsProps {
  recommendations: TourItem[];
}

/**
 * 관광지 추천 섹션 컴포넌트
 *
 * @param recommendations - 추천 관광지 목록
 */
export function DetailRecommendations({
  recommendations,
}: DetailRecommendationsProps) {
  // 추천 관광지가 없으면 섹션 숨김
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section aria-label="추천 관광지" className="space-y-4 pt-6 border-t">
      <h2 className="text-2xl font-semibold mb-4">이런 관광지는 어때요?</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        role="list"
        aria-label="추천 관광지 목록"
      >
        {recommendations.map(tour => (
          <div key={tour.contentid} role="listitem">
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
    </section>
  );
}


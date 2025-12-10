/**
 * @file tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 이 컴포넌트는 여러 관광지 카드를 그리드 레이아웃으로 표시합니다.
 *
 * 주요 기능:
 * 1. 그리드 레이아웃 (반응형)
 * 2. TourCard 반복 렌더링
 * 3. 로딩 상태 (SkeletonList)
 * 4. 에러 상태 (ApiError)
 * 5. 빈 상태 (EmptyState)
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard 컴포넌트
 * - components/ui/skeleton.tsx: SkeletonList 컴포넌트
 * - components/ui/error.tsx: EmptyState, ApiError 컴포넌트
 * - lib/types/tour.ts: TourItem 타입
 */

import type { TourItem } from '@/lib/types/tour';
import { TourCard } from './tour-card';
import { SkeletonList } from './ui/skeleton';
import { EmptyState, ApiError } from './ui/error';
import { MapPin } from 'lucide-react';

interface TourListProps {
  tours: TourItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  selectedTourId?: string;
  onTourClick?: (tour: TourItem) => void;
}

/**
 * 관광지 목록 컴포넌트
 *
 * @param tours - 관광지 목록
 * @param isLoading - 로딩 상태
 * @param error - 에러 객체
 * @param onRetry - 재시도 함수
 * @param selectedTourId - 선택된 관광지 ID
 * @param onTourClick - 관광지 클릭 콜백
 */
export function TourList({
  tours,
  isLoading = false,
  error = null,
  onRetry,
  selectedTourId,
  onTourClick,
}: TourListProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div aria-label="로딩 중" role="status" aria-busy="true">
        <SkeletonList count={6} />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-full">
        <ApiError error={error} onRetry={onRetry} />
      </div>
    );
  }

  // 빈 상태
  if (tours.length === 0) {
    return (
      <EmptyState
        title="관광지가 없습니다"
        message="조건에 맞는 관광지를 찾을 수 없습니다. 다른 필터를 시도해보세요."
        icon={MapPin}
      />
    );
  }

  // 목록 표시
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="관광지 목록"
      role="list"
    >
      {tours.map((tour) => (
        <div
          key={tour.contentid}
          role="listitem"
          data-tour-id={tour.contentid}
        >
          <TourCard
            tour={tour}
            isSelected={selectedTourId === tour.contentid}
            onCardClick={onTourClick}
          />
        </div>
      ))}
    </div>
  );
}


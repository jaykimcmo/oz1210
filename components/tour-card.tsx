'use client';

/**
 * @file tour-card.tsx
 * @description 관광지 카드 컴포넌트 (Client Component)
 *
 * 이 컴포넌트는 개별 관광지 정보를 카드 형태로 표시합니다.
 * Link와 onClick 핸들러를 사용하므로 클라이언트 컴포넌트로 구현되었습니다.
 *
 * 주요 기능:
 * 1. 썸네일 이미지 표시 (기본 이미지 fallback)
 * 2. 관광지명, 주소, 타입 뱃지, 개요 표시
 * 3. 호버 효과 (scale, shadow)
 * 4. 클릭 시 상세페이지 이동
 *
 * @dependencies
 * - next/image: 이미지 최적화
 * - next/link: 페이지 이동
 * - lib/types/tour.ts: TourItem 타입
 * - lib/types/stats.ts: CONTENT_TYPE_NAMES 상수
 * - lib/utils.ts: cn 함수
 */

import Image from 'next/image';
import Link from 'next/link';
import type { TourItem } from '@/lib/types/tour';
import { CONTENT_TYPE_NAMES } from '@/lib/types/stats';
import type { ContentTypeId } from '@/lib/types/tour';
import { cn } from '@/lib/utils';

interface TourCardProps {
  tour: TourItem;
  isSelected?: boolean;
  onCardClick?: (tour: TourItem) => void;
  priority?: boolean;
}

/**
 * 관광지 카드 컴포넌트
 *
 * @param tour - 관광지 정보
 * @param isSelected - 선택된 상태
 * @param onCardClick - 카드 클릭 콜백 (지도 이동용)
 */
export function TourCard({
  tour,
  isSelected = false,
  onCardClick,
  priority = false,
}: TourCardProps) {
  // 이미지 URL 결정 (firstimage 우선, 없으면 firstimage2, 둘 다 없으면 null)
  const imageUrl = tour.firstimage || tour.firstimage2 || null;

  // 관광 타입명 변환
  const typeName =
    CONTENT_TYPE_NAMES[tour.contenttypeid as ContentTypeId] ?? '기타';

  // 주소 표시 (addr1 + addr2)
  const address = tour.addr2
    ? `${tour.addr1} ${tour.addr2}`
    : tour.addr1 || '주소 정보 없음';

  // 상세페이지 URL
  const detailUrl = `/places/${tour.contentid}`;

  const handleClick = () => {
    // 지도 이동 콜백 호출 (상세페이지 이동은 Link가 처리)
    if (onCardClick) {
      onCardClick(tour);
    }
  };

  return (
    <Link
      href={detailUrl}
      onClick={handleClick}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'active:scale-[0.98]',
        isSelected && 'ring-2 ring-primary ring-offset-2',
      )}
      aria-label={`${tour.title} 상세보기`}
      aria-current={isSelected ? 'true' : undefined}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            quality={85}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-2 p-4">
        {/* 관광지명 */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
          {tour.title}
        </h3>

        {/* 주소 */}
        <p className="line-clamp-1 text-sm text-muted-foreground">{address}</p>

        {/* 타입 뱃지 및 개요 */}
        <div className="flex flex-col gap-2">
          {/* 타입 뱃지 */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {typeName}
            </span>
          </div>

          {/* 개요 (있는 경우만 표시) */}
          {tour.overview && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {tour.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}


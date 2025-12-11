/**
 * @file bookmark-card.tsx
 * @description 북마크 카드 컴포넌트
 *
 * TourCard를 래핑하여 삭제 버튼을 추가한 컴포넌트입니다.
 * 북마크 목록 페이지에서 사용됩니다.
 *
 * 주요 기능:
 * 1. 관광지 정보 표시 (TourCard 재사용)
 * 2. 북마크 삭제 버튼
 * 3. 삭제 시 목록 새로고침
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard
 * - actions/bookmark-actions.ts: removeBookmarkAndRevalidate
 * - lucide-react: Trash2, Loader2
 * - sonner: toast
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { removeBookmarkAndRevalidate } from '@/actions/bookmark-actions';
import { CONTENT_TYPE_NAMES } from '@/lib/types/stats';
import { cn } from '@/lib/utils';
import type { TourItem, ContentTypeId } from '@/lib/types/tour';

interface BookmarkCardProps {
  tour: TourItem;
  priority?: boolean;
}

/**
 * 북마크 카드 컴포넌트
 *
 * @param tour - 관광지 정보
 * @param priority - 이미지 우선 로딩 여부
 */
export function BookmarkCard({ tour, priority = false }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 이미지 URL 결정
  const imageUrl = tour.firstimage || tour.firstimage2 || null;

  // 관광 타입명 변환
  const typeName =
    CONTENT_TYPE_NAMES[tour.contenttypeid as ContentTypeId] ?? '기타';

  // 주소 표시
  const address = tour.addr2
    ? `${tour.addr1} ${tour.addr2}`
    : tour.addr1 || '주소 정보 없음';

  // 상세페이지 URL
  const detailUrl = `/places/${tour.contentid}`;

  // 북마크 삭제 처리
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이동 방지
    e.stopPropagation();

    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await removeBookmarkAndRevalidate(tour.contentid);
      toast.success('북마크가 제거되었습니다.');
    } catch (error) {
      console.error('[BookmarkCard] 북마크 삭제 실패:', error);
      const errorMessage =
        error instanceof Error ? error.message : '북마크 제거에 실패했습니다.';
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative group">
      {/* 삭제 버튼 */}
      <Button
        variant="destructive"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className={cn(
          'absolute top-2 right-2 z-10 h-8 w-8 sm:h-9 sm:w-9',
          'opacity-0 group-hover:opacity-100 focus:opacity-100',
          'transition-opacity duration-200',
          'shadow-md',
        )}
        aria-label={`${tour.title} 북마크 삭제`}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      {/* 카드 */}
      <Link
        href={detailUrl}
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm',
          'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'active:scale-[0.98]',
        )}
        aria-label={`${tour.title} 상세보기`}
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
    </div>
  );
}


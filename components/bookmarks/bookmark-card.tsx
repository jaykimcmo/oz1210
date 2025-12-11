/**
 * @file bookmark-card.tsx
 * @description 북마크 카드 컴포넌트
 *
 * TourCard를 래핑하여 삭제 버튼과 체크박스를 추가한 컴포넌트입니다.
 * 북마크 목록 페이지에서 사용됩니다.
 *
 * 주요 기능:
 * 1. 관광지 정보 표시 (TourCard 재사용)
 * 2. 북마크 삭제 버튼 (일반 모드)
 * 3. 체크박스 선택 (편집 모드)
 * 4. 삭제 시 목록 새로고침
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard
 * - components/ui/checkbox.tsx: Checkbox
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { removeBookmarkAndRevalidate } from '@/actions/bookmark-actions';
import { CONTENT_TYPE_NAMES } from '@/lib/types/stats';
import { cn } from '@/lib/utils';
import type { TourItem, ContentTypeId } from '@/lib/types/tour';

interface BookmarkCardProps {
  tour: TourItem;
  priority?: boolean;
  /** 편집 모드 여부 */
  isEditMode?: boolean;
  /** 선택 여부 */
  isSelected?: boolean;
  /** 선택 변경 핸들러 */
  onSelectChange?: (contentId: string, selected: boolean) => void;
}

/**
 * 북마크 카드 컴포넌트
 *
 * @param tour - 관광지 정보
 * @param priority - 이미지 우선 로딩 여부
 * @param isEditMode - 편집 모드 여부
 * @param isSelected - 선택 여부
 * @param onSelectChange - 선택 변경 핸들러
 */
export function BookmarkCard({
  tour,
  priority = false,
  isEditMode = false,
  isSelected = false,
  onSelectChange,
}: BookmarkCardProps) {
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

  // 체크박스 변경 처리
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    if (onSelectChange && typeof checked === 'boolean') {
      onSelectChange(tour.contentid, checked);
    }
  };

  // 편집 모드에서 카드 클릭 시 선택 토글
  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      if (onSelectChange) {
        onSelectChange(tour.contentid, !isSelected);
      }
    }
  };

  return (
    <div className="relative group">
      {/* 편집 모드: 체크박스 */}
      {isEditMode && (
        <div
          className={cn(
            'absolute top-2 left-2 z-10',
            'bg-background/90 rounded-md p-1',
            'shadow-md',
          )}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            aria-label={`${tour.title} 선택`}
            className="h-5 w-5"
          />
        </div>
      )}

      {/* 일반 모드: 삭제 버튼 */}
      {!isEditMode && (
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
      )}

      {/* 카드 */}
      <Link
        href={isEditMode ? '#' : detailUrl}
        onClick={handleCardClick}
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm',
          'transition-all duration-300',
          !isEditMode && 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // 편집 모드 선택 스타일
          isEditMode && isSelected && 'ring-2 ring-primary ring-offset-2',
          isEditMode && 'cursor-pointer',
        )}
        aria-label={isEditMode ? `${tour.title} 선택` : `${tour.title} 상세보기`}
      >
        {/* 이미지 영역 */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={tour.title}
              fill
              className={cn(
                'object-cover transition-transform duration-200',
                !isEditMode && 'group-hover:scale-105',
              )}
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

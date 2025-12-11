/**
 * @file bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 북마크된 관광지 목록을 TourCard 그리드 형태로 표시합니다.
 * 정렬, 선택, 일괄 삭제 기능을 포함합니다.
 *
 * 주요 기능:
 * 1. TourCard 그리드 렌더링
 * 2. 빈 상태 처리
 * 3. 정렬 기능 (최신순, 이름순, 지역별)
 * 4. 편집 모드 (체크박스 선택)
 * 5. 일괄 삭제 기능
 *
 * @dependencies
 * - components/bookmarks/bookmark-card.tsx: BookmarkCard
 * - components/bookmarks/bookmark-toolbar.tsx: BookmarkToolbar
 * - components/ui/alert-dialog.tsx: AlertDialog
 * - actions/bookmark-actions.ts: removeMultipleBookmarks
 * - lib/types/tour.ts: TourItem
 * - lib/types/stats.ts: AREA_CODE_NAMES
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { BookmarkCard } from '@/components/bookmarks/bookmark-card';
import { BookmarkToolbar, type SortOption } from '@/components/bookmarks/bookmark-toolbar';
import { removeMultipleBookmarks } from '@/actions/bookmark-actions';
import { AREA_CODE_NAMES } from '@/lib/types/stats';
import type { TourItem } from '@/lib/types/tour';

interface BookmarkListProps {
  tours: TourItem[];
}

/**
 * 북마크 목록 컴포넌트
 *
 * @param tours - 북마크된 관광지 목록
 */
export function BookmarkList({ tours }: BookmarkListProps) {
  // 정렬 상태
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  
  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 선택된 항목 ID 집합
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // 삭제 확인 다이얼로그 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // 삭제 중 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 정렬된 관광지 목록
  const sortedTours = useMemo(() => {
    const sorted = [...tours];
    
    switch (sortOption) {
      case 'name':
        // 이름순 (가나다순)
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        break;
      case 'region':
        // 지역별 (지역명 가나다순)
        sorted.sort((a, b) => {
          const aRegion = AREA_CODE_NAMES[a.areacode] || '기타';
          const bRegion = AREA_CODE_NAMES[b.areacode] || '기타';
          return aRegion.localeCompare(bRegion, 'ko');
        });
        break;
      case 'latest':
      default:
        // 최신순 (서버에서 이미 정렬됨, 그대로 유지)
        break;
    }
    
    return sorted;
  }, [tours, sortOption]);

  // 전체 선택 여부
  const isAllSelected = useMemo(() => {
    return tours.length > 0 && selectedIds.size === tours.length;
  }, [tours.length, selectedIds.size]);

  // 정렬 옵션 변경
  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  // 편집 모드 토글
  const handleEditModeToggle = useCallback(() => {
    setIsEditMode((prev) => {
      if (prev) {
        // 편집 모드 종료 시 선택 초기화
        setSelectedIds(new Set());
      }
      return !prev;
    });
  }, []);

  // 개별 항목 선택 변경
  const handleSelectChange = useCallback((contentId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(contentId);
      } else {
        next.delete(contentId);
      }
      return next;
    });
  }, []);

  // 전체 선택/해제
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      // 전체 해제
      setSelectedIds(new Set());
    } else {
      // 전체 선택
      setSelectedIds(new Set(tours.map((tour) => tour.contentid)));
    }
  }, [isAllSelected, tours]);

  // 선택 삭제 버튼 클릭 (다이얼로그 열기)
  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.size > 0) {
      setIsDeleteDialogOpen(true);
    }
  }, [selectedIds.size]);

  // 삭제 확인
  const handleConfirmDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);

    try {
      const contentIds = Array.from(selectedIds);
      const result = await removeMultipleBookmarks(contentIds);

      if (result.success > 0) {
        toast.success(`${result.success}개의 북마크가 삭제되었습니다.`);
      }

      if (result.failed > 0) {
        toast.warning(`${result.failed}개의 북마크 삭제에 실패했습니다.`);
      }

      // 선택 초기화 및 편집 모드 종료
      setSelectedIds(new Set());
      setIsEditMode(false);
    } catch (error) {
      console.error('[BookmarkList] 일괄 삭제 실패:', error);
      const errorMessage =
        error instanceof Error ? error.message : '북마크 삭제에 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }, [selectedIds]);

  // 빈 상태 처리
  if (tours.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* 툴바 */}
      <BookmarkToolbar
        sortOption={sortOption}
        onSortChange={handleSortChange}
        isEditMode={isEditMode}
        onEditModeToggle={handleEditModeToggle}
        totalCount={tours.length}
        selectedCount={selectedIds.size}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        isDeleting={isDeleting}
      />

      {/* 북마크 목록 */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        role="list"
        aria-label="북마크된 관광지 목록"
      >
        {sortedTours.map((tour, index) => (
          <div key={tour.contentid} role="listitem">
            <BookmarkCard
              tour={tour}
              priority={index < 4}
              isEditMode={isEditMode}
              isSelected={selectedIds.has(tour.contentid)}
              onSelectChange={handleSelectChange}
            />
          </div>
        ))}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>북마크 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selectedIds.size}개의 북마크를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * 빈 상태 컴포넌트
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      {/* 아이콘 */}
      <div className="mb-6 p-4 rounded-full bg-muted">
        <Star
          className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      {/* 메시지 */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
        저장된 북마크가 없습니다
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base text-center mb-8 max-w-md">
        마음에 드는 관광지를 발견하면 별 아이콘을 눌러 저장해보세요.
        <br />
        저장한 관광지는 이곳에서 확인할 수 있습니다.
      </p>

      {/* 홈으로 이동 버튼 */}
      <Link href="/">
        <Button
          size="lg"
          className="min-h-[44px] gap-2"
          aria-label="관광지 둘러보기"
        >
          <MapPin className="h-5 w-5" aria-hidden="true" />
          관광지 둘러보기
        </Button>
      </Link>
    </div>
  );
}

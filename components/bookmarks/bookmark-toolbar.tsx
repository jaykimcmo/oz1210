/**
 * @file bookmark-toolbar.tsx
 * @description 북마크 툴바 컴포넌트
 *
 * 북마크 목록 페이지의 정렬 및 편집 기능을 제공하는 툴바입니다.
 *
 * 주요 기능:
 * 1. 정렬 옵션 (최신순, 이름순, 지역별)
 * 2. 편집 모드 전환
 * 3. 전체 선택/해제
 * 4. 선택 삭제
 *
 * @dependencies
 * - components/ui/select.tsx: Select
 * - components/ui/button.tsx: Button
 * - components/ui/checkbox.tsx: Checkbox
 * - lucide-react: icons
 */

'use client';

import { ArrowDownAZ, MapPin, Clock, Pencil, X, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'latest' | 'name' | 'region';

interface BookmarkToolbarProps {
  /** 현재 정렬 옵션 */
  sortOption: SortOption;
  /** 정렬 옵션 변경 핸들러 */
  onSortChange: (option: SortOption) => void;
  /** 편집 모드 여부 */
  isEditMode: boolean;
  /** 편집 모드 토글 핸들러 */
  onEditModeToggle: () => void;
  /** 전체 항목 수 */
  totalCount: number;
  /** 선택된 항목 수 */
  selectedCount: number;
  /** 전체 선택 여부 */
  isAllSelected: boolean;
  /** 전체 선택/해제 핸들러 */
  onSelectAll: () => void;
  /** 선택 삭제 핸들러 */
  onDeleteSelected: () => void;
  /** 삭제 중 여부 */
  isDeleting: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'latest', label: '최신순', icon: <Clock className="h-4 w-4" /> },
  { value: 'name', label: '이름순', icon: <ArrowDownAZ className="h-4 w-4" /> },
  { value: 'region', label: '지역별', icon: <MapPin className="h-4 w-4" /> },
];

/**
 * 북마크 툴바 컴포넌트
 */
export function BookmarkToolbar({
  sortOption,
  onSortChange,
  isEditMode,
  onEditModeToggle,
  totalCount,
  selectedCount,
  isAllSelected,
  onSelectAll,
  onDeleteSelected,
  isDeleting,
}: BookmarkToolbarProps) {
  // 북마크가 없으면 툴바 숨김
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
      {isEditMode ? (
        // 편집 모드 UI
        <>
          <div className="flex items-center gap-3">
            {/* 전체 선택 체크박스 */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label={isAllSelected ? '전체 선택 해제' : '전체 선택'}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium cursor-pointer select-none"
              >
                전체 선택
              </label>
            </div>

            {/* 선택된 항목 수 */}
            <span className="text-sm text-muted-foreground">
              {selectedCount}개 선택됨
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 선택 삭제 버튼 */}
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              disabled={selectedCount === 0 || isDeleting}
              className="min-h-[36px] gap-2"
              aria-label={`선택한 ${selectedCount}개 북마크 삭제`}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">삭제</span>
            </Button>

            {/* 편집 완료 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={onEditModeToggle}
              className="min-h-[36px] gap-2"
              aria-label="편집 완료"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">완료</span>
            </Button>
          </div>
        </>
      ) : (
        // 일반 모드 UI
        <>
          {/* 정렬 옵션 */}
          <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[140px] h-9" aria-label="정렬 옵션 선택">
              <SelectValue placeholder="정렬 선택" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 편집 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onEditModeToggle}
            className="min-h-[36px] gap-2"
            aria-label="편집 모드 시작"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">편집</span>
          </Button>
        </>
      )}
    </div>
  );
}


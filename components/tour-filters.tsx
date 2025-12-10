/**
 * @file tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록을 필터링하기 위한 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 지역 필터 (시/도 선택)
 * 2. 관광 타입 필터 (다중 선택)
 * 3. 정렬 옵션 (최신순, 이름순)
 * 4. 필터 상태 표시 및 초기화
 *
 * 필터 상태는 URL 쿼리 파라미터로 관리되어 공유 및 북마크가 가능합니다.
 *
 * @dependencies
 * - next/navigation: useRouter, useSearchParams
 * - components/ui/select: Select 컴포넌트
 * - components/ui/button: Button 컴포넌트
 * - components/ui/badge: Badge 컴포넌트
 * - lib/types/tour.ts: AreaCode 타입
 * - lib/types/stats.ts: CONTENT_TYPE_NAMES 상수
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { X } from 'lucide-react';
import type { AreaCode } from '@/lib/types/tour';
import { CONTENT_TYPE_NAMES } from '@/lib/types/stats';
import type { ContentTypeId } from '@/lib/types/tour';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface TourFiltersProps {
  areaCodes: AreaCode[];
}

/**
 * 관광지 필터 컴포넌트
 *
 * @param areaCodes - 지역 목록 (Server Component에서 전달)
 */
export function TourFilters({ areaCodes }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 필터 값 읽기
  const currentAreaCode = searchParams.get('areaCode') || undefined;
  const currentContentTypeIds = useMemo(() => {
    const param = searchParams.get('contentTypeId');
    if (!param) return [];
    return param.split(',').filter(Boolean);
  }, [searchParams]);
  const currentSort = (searchParams.get('sort') as 'latest' | 'name') || 'latest';

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (updates: {
      areaCode?: string | null;
      contentTypeId?: string | null;
      sort?: string | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      // 각 파라미터 업데이트
      if (updates.areaCode === null || updates.areaCode === '') {
        params.delete('areaCode');
      } else if (updates.areaCode !== undefined) {
        params.set('areaCode', updates.areaCode);
      }

      if (updates.contentTypeId === null || updates.contentTypeId === '') {
        params.delete('contentTypeId');
      } else if (updates.contentTypeId !== undefined) {
        params.set('contentTypeId', updates.contentTypeId);
      }

      if (updates.sort === null || updates.sort === 'latest') {
        params.delete('sort');
      } else if (updates.sort !== undefined) {
        params.set('sort', updates.sort);
      }

      // URL 업데이트 (히스토리 스택에 추가하지 않음)
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 지역 필터 변경
  const handleAreaChange = useCallback(
    (value: string) => {
      updateUrl({ areaCode: value === 'all' ? null : value });
    },
    [updateUrl],
  );

  // 관광 타입 필터 토글
  const handleContentTypeToggle = useCallback(
    (typeId: ContentTypeId) => {
      const newIds = currentContentTypeIds.includes(typeId)
        ? currentContentTypeIds.filter((id) => id !== typeId)
        : [...currentContentTypeIds, typeId];

      updateUrl({
        contentTypeId: newIds.length > 0 ? newIds.join(',') : null,
      });
    },
    [currentContentTypeIds, updateUrl],
  );

  // 정렬 옵션 변경
  const handleSortChange = useCallback(
    (value: string) => {
      updateUrl({ sort: value === 'latest' ? null : value });
    },
    [updateUrl],
  );

  // 필터 초기화
  const handleReset = useCallback(() => {
    router.replace('/', { scroll: false });
  }, [router]);

  // 선택된 필터가 있는지 확인
  const hasActiveFilters =
    currentAreaCode || currentContentTypeIds.length > 0 || currentSort !== 'latest';

  // 관광 타입 목록
  const contentTypeList = Object.entries(CONTENT_TYPE_NAMES) as [
    ContentTypeId,
    string,
 ][];

  return (
    <div className="flex flex-col gap-4" aria-label="관광지 필터">
      {/* 필터 컨트롤 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        {/* 지역 필터 */}
        <div className="flex items-center gap-2">
          <label htmlFor="area-filter" className="text-sm font-medium whitespace-nowrap">
            지역:
          </label>
          <Select value={currentAreaCode || 'all'} onValueChange={handleAreaChange}>
            <SelectTrigger id="area-filter" className="w-[140px]" aria-label="지역 필터 선택">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {areaCodes.map((area) => (
                <SelectItem key={area.code} value={area.code}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 관광 타입 필터 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-medium whitespace-nowrap">타입:</label>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
            {contentTypeList.map(([typeId, typeName]) => {
              const isSelected = currentContentTypeIds.includes(typeId);
              return (
                <Button
                  key={typeId}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContentTypeToggle(typeId)}
                  className={cn(
                    'transition-all duration-200',
                    isSelected && 'shadow-sm',
                  )}
                  aria-pressed={isSelected}
                  aria-label={`${typeName} ${isSelected ? '선택됨' : '선택 안됨'}`}
                >
                  {typeName}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-filter" className="text-sm font-medium whitespace-nowrap">
            정렬:
          </label>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger id="sort-filter" className="w-[120px]" aria-label="정렬 옵션 선택">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 선택된 필터 표시 및 초기화 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">선택된 필터:</span>
          {currentAreaCode && (
            <Badge variant="secondary" className="gap-1">
              지역:{' '}
              {areaCodes.find((a) => a.code === currentAreaCode)?.name ||
                currentAreaCode}
              <button
                type="button"
                onClick={() => updateUrl({ areaCode: null })}
                className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"
                aria-label="지역 필터 제거"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentContentTypeIds.map((typeId) => {
            const typeName = CONTENT_TYPE_NAMES[typeId as ContentTypeId] || typeId;
            return (
              <Badge key={typeId} variant="secondary" className="gap-1">
                {typeName}
                <button
                  type="button"
                  onClick={() => handleContentTypeToggle(typeId as ContentTypeId)}
                  className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"
                  aria-label={`${typeName} 필터 제거`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {currentSort !== 'latest' && (
            <Badge variant="secondary" className="gap-1">
              정렬: {currentSort === 'name' ? '이름순' : '최신순'}
              <button
                type="button"
                onClick={() => updateUrl({ sort: null })}
                className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"
                aria-label="정렬 필터 제거"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-6 text-xs transition-colors"
            aria-label="모든 필터 초기화"
          >
            모두 초기화
          </Button>
        </div>
      )}
    </div>
  );
}


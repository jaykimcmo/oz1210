/**
 * @file tour-search.tsx
 * @description 관광지 검색 컴포넌트
 *
 * 이 컴포넌트는 키워드로 관광지를 검색하는 UI를 제공합니다.
 *
 * 주요 기능:
 * 1. 검색창 UI (Input + 검색 아이콘)
 * 2. 엔터 키 및 버튼 클릭으로 검색 실행
 * 3. URL 쿼리 파라미터로 검색어 관리
 * 4. 검색어 초기화 기능
 *
 * 검색 상태는 URL 쿼리 파라미터로 관리되어 공유 및 북마크가 가능합니다.
 *
 * @dependencies
 * - next/navigation: useRouter, useSearchParams
 * - components/ui/input: Input 컴포넌트
 * - components/ui/button: Button 컴포넌트
 * - lucide-react: Search, X 아이콘
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface TourSearchProps {
  initialKeyword?: string;
}

/**
 * 관광지 검색 컴포넌트
 *
 * @param initialKeyword - 초기 검색어 (URL에서 읽은 값)
 */
export function TourSearch({ initialKeyword }: TourSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(initialKeyword || '');

  // URL에서 검색어 읽기 (초기 로드 및 외부 변경 감지)
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    setKeyword(urlKeyword);
  }, [searchParams]);

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (newKeyword: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newKeyword === null || newKeyword.trim() === '') {
        params.delete('keyword');
      } else {
        params.set('keyword', newKeyword.trim());
      }

      // 페이지 번호는 검색 시 1로 리셋
      params.delete('pageNo');

      // URL 업데이트 (히스토리 스택에 추가하지 않음)
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 검색 실행
  const handleSearch = useCallback(() => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword === '') {
      // 빈 검색어인 경우 검색어 제거
      updateUrl(null);
    } else {
      // 검색 실행
      updateUrl(trimmedKeyword);
    }
  }, [keyword, updateUrl]);

  // 엔터 키 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch],
  );

  // 검색어 초기화
  const handleClear = useCallback(() => {
    setKeyword('');
    updateUrl(null);
  }, [updateUrl]);

  // 검색어 변경
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const hasKeyword = keyword.trim() !== '';

  return (
    <div className="flex flex-col gap-2" aria-label="관광지 검색">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="관광지명, 주소, 설명으로 검색..."
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full pl-10 pr-10',
              'min-w-0 sm:min-w-[500px]',
            )}
            aria-label="검색어 입력"
          />
          {hasKeyword && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="검색어 초기화"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          className="shrink-0 transition-all duration-200"
          aria-label="검색 실행"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">검색</span>
        </Button>
      </div>
    </div>
  );
}


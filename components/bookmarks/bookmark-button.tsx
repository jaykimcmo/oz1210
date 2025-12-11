/**
 * @file bookmark-button.tsx
 * @description 북마크 버튼 컴포넌트
 *
 * 이 컴포넌트는 관광지를 북마크할 수 있는 버튼을 제공합니다.
 * Clerk 인증과 Supabase를 연동하여 북마크 데이터를 관리합니다.
 *
 * 주요 기능:
 * 1. 북마크 상태 확인 및 표시
 * 2. 북마크 추가/제거
 * 3. 로그인하지 않은 경우 로그인 유도
 *
 * @dependencies
 * - @clerk/nextjs: useAuth, SignedIn, SignedOut, SignInButton
 * - actions/bookmark-actions.ts: getBookmark, addBookmark, removeBookmark
 * - lucide-react: Star, StarOff 아이콘
 * - components/ui/button.tsx: Button 컴포넌트
 * - sonner: toast 알림
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getBookmark, addBookmark, removeBookmark } from '@/actions/bookmark-actions';
import type { Bookmark } from '@/actions/bookmark-actions';

interface BookmarkButtonProps {
  contentId: string;
  className?: string;
}

/**
 * 북마크 버튼 컴포넌트
 *
 * @param contentId - 한국관광공사 API contentid
 * @param className - 추가 CSS 클래스
 */
export function BookmarkButton({ contentId, className }: BookmarkButtonProps) {
  const { isSignedIn, userId } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // 북마크 상태 조회
  useEffect(() => {
    async function fetchBookmarkStatus() {
      if (!isSignedIn || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        const bookmark = await getBookmark(contentId);
        setIsBookmarked(!!bookmark);
      } catch (error) {
        console.error('[BookmarkButton] 북마크 상태 조회 실패:', error);
        // 에러가 발생해도 UI는 계속 표시
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookmarkStatus();
  }, [contentId, isSignedIn, userId]);

  // 북마크 토글 (추가/제거)
  const handleToggle = async () => {
    if (!isSignedIn || !userId) {
      return; // SignedIn 컴포넌트로 처리
    }

    if (isToggling) {
      return; // 이미 처리 중
    }

    setIsToggling(true);

    try {
      if (isBookmarked) {
        // 북마크 제거
        await removeBookmark(contentId);
        setIsBookmarked(false);
        toast.success('북마크가 제거되었습니다.');
      } else {
        // 북마크 추가
        await addBookmark(contentId);
        setIsBookmarked(true);
        toast.success('북마크에 추가되었습니다.');
      }
    } catch (error) {
      console.error('[BookmarkButton] 북마크 토글 실패:', error);
      const errorMessage =
        error instanceof Error ? error.message : '북마크 처리에 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  // 로딩 중이거나 인증 상태 확인 중
  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={className}
        aria-label="북마크"
      >
        <Star className="h-4 w-4 opacity-50" aria-hidden="true" />
        <span className="sr-only">북마크</span>
      </Button>
    );
  }

  return (
    <>
      {/* 로그인한 사용자: 북마크 버튼 */}
      <SignedIn>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isToggling}
          className={className}
          aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
        >
          {isBookmarked ? (
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
          ) : (
            <StarOff className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">{isBookmarked ? '북마크 제거' : '북마크 추가'}</span>
        </Button>
      </SignedIn>

      {/* 로그인하지 않은 사용자: 로그인 버튼 */}
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            size="sm"
            className={className}
            aria-label="로그인하여 북마크 추가"
          >
            <StarOff className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">로그인하여 북마크 추가</span>
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}


/**
 * @file page.tsx
 * @description 북마크 목록 페이지
 *
 * 이 페이지는 사용자가 저장한 북마크 관광지 목록을 표시합니다.
 * Clerk 인증과 연동하여 로그인한 사용자만 접근 가능합니다.
 *
 * 주요 기능:
 * 1. 인증 체크 (미인증 시 로그인 유도)
 * 2. 북마크된 관광지 목록 조회
 * 3. TourCard 그리드 형태로 표시
 * 4. 빈 상태 처리
 *
 * @dependencies
 * - @clerk/nextjs/server: auth
 * - actions/bookmark-actions.ts: getBookmarkedTours
 * - components/bookmarks/bookmark-list.tsx: BookmarkList
 */

import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { Star } from 'lucide-react';
import { getBookmarkedTours } from '@/actions/bookmark-actions';
import { BookmarkList } from '@/components/bookmarks/bookmark-list';
import { SignInPrompt } from '@/components/bookmarks/sign-in-prompt';

export const metadata: Metadata = {
  title: '내 북마크',
  description: '저장한 관광지 목록을 확인하고 관리하세요.',
  keywords: ['북마크', '저장한 관광지', '관광지 목록', '즐겨찾기'],
  openGraph: {
    title: '내 북마크 | My Trip',
    description: '저장한 관광지 목록을 확인하고 관리하세요.',
    type: 'website',
    url: '/bookmarks',
    siteName: 'My Trip',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '내 북마크 | My Trip',
    description: '저장한 관광지 목록을 확인하고 관리하세요.',
  },
};

export default async function BookmarksPage() {
  // Clerk 인증 확인
  const { userId } = await auth();

  // 미인증 사용자는 로그인 유도 UI 표시
  if (!userId) {
    return (
      <main className="w-full" role="main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* 페이지 제목 섹션 */}
          <section className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Star
                className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500"
                aria-hidden="true"
              />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                내 북마크
              </h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              저장한 관광지 목록을 확인하고 관리하세요
            </p>
          </section>

          {/* 로그인 유도 */}
          <SignInPrompt />
        </div>
      </main>
    );
  }

  // 북마크된 관광지 목록 조회
  const tours = await getBookmarkedTours();

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* 페이지 제목 섹션 */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Star
              className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 fill-yellow-500"
              aria-hidden="true"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              내 북마크
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            저장한 관광지 {tours.length}개
          </p>
        </section>

        {/* 북마크 목록 */}
        <section aria-label="북마크 목록">
          <BookmarkList tours={tours} />
        </section>
      </div>
    </main>
  );
}


/**
 * @file bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 북마크된 관광지 목록을 TourCard 그리드 형태로 표시합니다.
 * 각 카드에는 삭제 버튼이 포함되어 북마크를 제거할 수 있습니다.
 *
 * 주요 기능:
 * 1. TourCard 그리드 렌더링
 * 2. 빈 상태 처리
 * 3. 북마크 제거 기능 (카드별 삭제 버튼)
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard
 * - components/bookmarks/bookmark-card.tsx: BookmarkCard
 * - lib/types/tour.ts: TourItem
 */

'use client';

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookmarkCard } from '@/components/bookmarks/bookmark-card';
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
  // 빈 상태 처리
  if (tours.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      role="list"
      aria-label="북마크된 관광지 목록"
    >
      {tours.map((tour, index) => (
        <div key={tour.contentid} role="listitem">
          <BookmarkCard tour={tour} priority={index < 4} />
        </div>
      ))}
    </div>
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


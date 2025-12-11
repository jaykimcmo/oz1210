/**
 * @file not-found.tsx
 * @description 404 페이지
 *
 * 존재하지 않는 페이지에 접근했을 때 표시되는 페이지입니다.
 *
 * 주요 기능:
 * 1. 사용자 친화적 메시지
 * 2. 홈으로 돌아가기 버튼
 * 3. 인기 페이지 링크
 * 4. 다크 모드 지원
 *
 * @dependencies
 * - lucide-react: FileQuestion, Home, BarChart3, MapPin
 * - components/ui/button: Button
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { FileQuestion, Home, BarChart3, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  description: '요청하신 페이지를 찾을 수 없습니다.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 sm:py-24">
          {/* 404 아이콘 */}
          <div className="mb-6 p-4 rounded-full bg-muted">
            <FileQuestion
              className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          {/* 404 텍스트 */}
          <h1 className="text-6xl sm:text-8xl font-bold text-muted-foreground/50 mb-4">
            404
          </h1>

          {/* 에러 메시지 */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base text-center mb-8 max-w-md">
            요청하신 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수 있습니다.
            <br />
            URL을 다시 확인해주세요.
          </p>

          {/* 홈으로 돌아가기 버튼 */}
          <Button asChild size="lg" className="min-h-[44px] gap-2 mb-12">
            <Link href="/" aria-label="홈으로 돌아가기">
              <Home className="h-5 w-5" aria-hidden="true" />
              홈으로 돌아가기
            </Link>
          </Button>

          {/* 인기 페이지 링크 */}
          <div className="w-full max-w-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
              이 페이지를 찾고 계신가요?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                aria-label="관광지 목록 페이지로 이동"
              >
                <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">관광지 목록</p>
                  <p className="text-xs text-muted-foreground">전국 관광지 검색</p>
                </div>
              </Link>
              <Link
                href="/stats"
                className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                aria-label="통계 페이지로 이동"
              >
                <BarChart3 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">통계</p>
                  <p className="text-xs text-muted-foreground">지역별/타입별 통계</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


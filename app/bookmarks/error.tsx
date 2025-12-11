/**
 * @file error.tsx
 * @description 북마크 페이지 에러 UI
 *
 * 북마크 목록 페이지에서 에러가 발생했을 때 표시되는 UI입니다.
 *
 * @dependencies
 * - lucide-react: AlertCircle, RefreshCw, Home
 * - components/ui/button.tsx: Button
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookmarksErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BookmarksError({ error, reset }: BookmarksErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // 에러 로깅
    console.error('[BookmarksError] 북마크 페이지 에러:', error);
  }, [error]);

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          {/* 에러 아이콘 */}
          <div className="mb-6 p-4 rounded-full bg-destructive/10">
            <AlertCircle
              className="h-12 w-12 sm:h-16 sm:w-16 text-destructive"
              aria-hidden="true"
            />
          </div>

          {/* 에러 메시지 */}
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
            북마크를 불러올 수 없습니다
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base text-center mb-2 max-w-md">
            {error.message || '북마크 목록을 불러오는 중 문제가 발생했습니다.'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mb-8">
              에러 코드: {error.digest}
            </p>
          )}

          {/* 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="min-h-[44px] gap-2"
              aria-label="다시 시도"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              다시 시도
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="min-h-[44px] gap-2"
              aria-label="홈으로 돌아가기"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}


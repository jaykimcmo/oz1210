/**
 * @file error.tsx
 * @description 전역 에러 페이지
 *
 * 앱 전체에서 발생하는 런타임 에러를 처리합니다.
 * 각 페이지별 error.tsx가 없는 경우 이 파일이 사용됩니다.
 *
 * 주요 기능:
 * 1. 사용자 친화적 에러 메시지 표시
 * 2. "다시 시도" 버튼 (reset 함수)
 * 3. "홈으로 돌아가기" 버튼
 * 4. 에러 코드 표시 (digest)
 * 5. Sentry 에러 리포팅
 *
 * @dependencies
 * - @sentry/nextjs: 에러 추적
 * - lucide-react: AlertTriangle, RefreshCw, Home
 * - components/ui/button: Button
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Sentry에 에러 전송
    Sentry.captureException(error);
    // 콘솔 로깅
    console.error('[GlobalError] 에러 발생:', error);
  }, [error]);

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 sm:py-24">
          {/* 에러 아이콘 */}
          <div className="mb-6 p-4 rounded-full bg-destructive/10">
            <AlertTriangle
              className="h-12 w-12 sm:h-16 sm:w-16 text-destructive"
              aria-hidden="true"
            />
          </div>

          {/* 에러 메시지 */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center">
            문제가 발생했습니다
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base text-center mb-2 max-w-md">
            {error.message || '예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
          </p>

          {/* 에러 코드 */}
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
              asChild
              className="min-h-[44px] gap-2"
            >
              <Link href="/" aria-label="홈으로 돌아가기">
                <Home className="h-4 w-4" aria-hidden="true" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>

          {/* 추가 도움말 */}
          <p className="mt-8 text-xs text-muted-foreground text-center max-w-sm">
            문제가 계속되면{' '}
            <Link href="/" className="underline hover:text-foreground">
              홈페이지
            </Link>
            로 돌아가거나, 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    </main>
  );
}


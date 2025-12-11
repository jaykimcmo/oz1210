/**
 * @file error.tsx
 * @description 상세페이지 에러 UI
 *
 * 이 파일은 상세페이지에서 발생한 에러를 표시하는 컴포넌트를 제공합니다.
 *
 * @dependencies
 * - next/navigation: useRouter
 * - components/ui/error.tsx: ApiError 컴포넌트
 * - components/ui/button.tsx: Button 컴포넌트
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/components/ui/error';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DetailPageError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // 에러 로깅 (선택 사항)
    console.error('[DetailPageError] 에러 발생:', error);
  }, [error]);

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="mb-8"
          aria-label="홈으로 돌아가기"
        >
          홈으로
        </Button>

        {/* 에러 메시지 */}
        <div className="mt-8">
          <ApiError
            error={error}
            onRetry={reset}
          />
        </div>

        {/* 추가 액션 버튼 */}
        <div className="mt-6 flex gap-4">
          <Button onClick={reset} variant="default">
            다시 시도
          </Button>
          <Button onClick={() => router.push('/')} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </main>
  );
}


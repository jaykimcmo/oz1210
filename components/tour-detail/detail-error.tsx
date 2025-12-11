/**
 * @file detail-error.tsx
 * @description 상세페이지 에러 표시 컴포넌트
 *
 * 이 컴포넌트는 상세페이지에서 발생한 에러를 표시하고 재시도 기능을 제공합니다.
 *
 * @dependencies
 * - components/ui/error.tsx: ApiError 컴포넌트
 * - next/navigation: useRouter
 * - components/ui/button.tsx: Button 컴포넌트
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/components/ui/error';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DetailErrorProps {
  error: Error;
  contentId: string;
}

/**
 * 상세페이지 에러 컴포넌트
 *
 * @param error - 발생한 에러
 * @param contentId - 관광지 ID (재시도용)
 */
export function DetailError({ error, contentId }: DetailErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    // 페이지 새로고침으로 재시도
    router.refresh();
  };

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 뒤로가기 버튼 */}
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            aria-label="이전 페이지로 돌아가기"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>뒤로가기</span>
          </Button>
        </Link>

        {/* 에러 메시지 */}
        <div className="mt-8">
          <ApiError error={error} onRetry={handleRetry} />
        </div>

        {/* 추가 액션 버튼 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button onClick={handleRetry} variant="default">
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


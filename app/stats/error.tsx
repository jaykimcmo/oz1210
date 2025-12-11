/**
 * @file error.tsx
 * @description 통계 대시보드 에러 UI
 *
 * 이 파일은 통계 대시보드 페이지에서 발생한 에러를 표시하는 컴포넌트입니다.
 *
 * @dependencies
 * - lucide-react: AlertCircle 아이콘
 * - components/ui/button.tsx: Button 컴포넌트
 * - next/link: Link 컴포넌트
 */

'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StatsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StatsError({ error, reset }: StatsErrorProps) {
  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle
            className="h-12 w-12 text-destructive"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-semibold">통계 페이지를 불러올 수 없습니다</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <div className="flex gap-4 mt-4">
            <Button onClick={reset} variant="default" className="min-h-[44px] min-w-[44px]">
              다시 시도
            </Button>
            <Button asChild variant="outline" className="min-h-[44px] min-w-[44px]">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}


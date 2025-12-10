/**
 * @file loading.tsx
 * @description 로딩 스피너 컴포넌트
 *
 * 이 파일은 다양한 로딩 상태를 표시하는 컴포넌트를 제공합니다.
 *
 * 주요 컴포넌트:
 * - LoadingSpinner: 기본 스피너
 * - LoadingButton: 버튼 내부 로딩 표시
 * - PageLoading: 전체 페이지 로딩
 *
 * @dependencies
 * - components/ui/button.tsx: Button 컴포넌트
 * - lucide-react: Loader2 아이콘
 */

import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

/**
 * 로딩 스피너 크기 타입
 */
type LoadingSize = 'sm' | 'md' | 'lg';

/**
 * 로딩 스피너 크기 매핑
 */
const sizeMap: Record<LoadingSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/**
 * 기본 로딩 스피너 컴포넌트
 *
 * @param size - 스피너 크기 (sm, md, lg)
 * @param className - 추가 CSS 클래스
 */
export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: LoadingSize;
  className?: string;
}) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-primary',
        sizeMap[size],
        className,
      )}
      aria-label="로딩 중"
      role="status"
      aria-busy="true"
    />
  );
}

/**
 * 로딩 상태가 있는 버튼 컴포넌트
 *
 * @param loading - 로딩 상태
 * @param children - 버튼 내용
 * @param className - 추가 CSS 클래스
 * @param props - Button 컴포넌트의 나머지 props
 */
export function LoadingButton({
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ComponentProps<typeof Button> & {
  loading?: boolean;
}) {
  return (
    <Button
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </Button>
  );
}

/**
 * 전체 페이지 로딩 컴포넌트
 *
 * @param message - 로딩 메시지 (선택 사항)
 * @param className - 추가 CSS 클래스
 */
export function PageLoading({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center gap-4',
        className,
      )}
      role="status"
      aria-label={message || '페이지 로딩 중'}
      aria-busy="true"
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}


/**
 * @file error.tsx
 * @description 에러 메시지 컴포넌트
 *
 * 이 파일은 다양한 에러 상태를 표시하는 컴포넌트를 제공합니다.
 *
 * 주요 컴포넌트:
 * - ErrorMessage: 기본 에러 메시지
 * - ApiError: API 에러 전용
 * - NetworkError: 네트워크 에러 전용
 *
 * @dependencies
 * - components/ui/alert.tsx: Alert 컴포넌트
 * - components/ui/button.tsx: Button 컴포넌트
 * - lib/api/tour-api.ts: TourApiError, NetworkError 타입
 * - lucide-react: AlertCircle, WifiOff 아이콘
 */

'use client';

import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { TourApiError, NetworkError } from '@/lib/api/tour-api';

/**
 * 기본 에러 메시지 컴포넌트
 *
 * @param title - 에러 제목 (선택 사항)
 * @param message - 에러 메시지 (필수)
 * @param onRetry - 재시도 함수 (선택 사항)
 * @param className - 추가 CSS 클래스
 */
export function ErrorMessage({
  title,
  message,
  onRetry,
  className,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={cn('', className)} role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>{title || '오류가 발생했습니다'}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            재시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * API 에러 전용 컴포넌트
 *
 * @param error - TourApiError 또는 NetworkError
 * @param onRetry - 재시도 함수 (선택 사항)
 * @param className - 추가 CSS 클래스
 */
export function ApiError({
  error,
  onRetry,
  className,
}: {
  error: TourApiError | NetworkError | Error;
  onRetry?: () => void;
  className?: string;
}) {
  // 사용자 친화적인 에러 메시지 생성
  const getUserFriendlyMessage = (error: Error): string => {
    if (error instanceof TourApiError) {
      // API 에러 메시지가 있으면 사용, 없으면 기본 메시지
      if (error.resultMsg) {
        return error.resultMsg;
      }
      if (error.statusCode === 404) {
        return '요청한 정보를 찾을 수 없습니다.';
      }
      if (error.statusCode && error.statusCode >= 500) {
        return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      return '관광지 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    if (error instanceof NetworkError) {
      return '네트워크 연결을 확인해주세요. 인터넷 연결이 불안정할 수 있습니다.';
    }

    // 일반 에러
    return '예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  };

  const message = getUserFriendlyMessage(error);

  return (
    <ErrorMessage
      title="데이터를 불러올 수 없습니다"
      message={message}
      onRetry={onRetry}
      className={className}
    />
  );
}

/**
 * 네트워크 에러 전용 컴포넌트
 *
 * @param onRetry - 재시도 함수 (선택 사항)
 * @param className - 추가 CSS 클래스
 */
export function NetworkErrorComponent({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={cn('', className)} role="alert">
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>네트워크 연결 오류</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span>인터넷 연결을 확인해주세요.</span>
          <span className="text-xs text-muted-foreground">
            네트워크가 연결되지 않았거나 불안정할 수 있습니다.
          </span>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            재시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * 빈 상태 컴포넌트 (에러는 아니지만 관련 컴포넌트)
 *
 * @param title - 제목
 * @param message - 메시지
 * @param icon - 아이콘 (선택 사항)
 * @param className - 추가 CSS 클래스
 */
export function EmptyState({
  title,
  message,
  icon: Icon,
  className,
}: {
  title: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 text-center',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}


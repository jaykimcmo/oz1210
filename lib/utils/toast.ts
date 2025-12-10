/**
 * @file toast.ts
 * @description Toast 알림 유틸리티
 *
 * 이 파일은 sonner를 사용한 Toast 알림을 편리하게 사용할 수 있는 래퍼 함수를 제공합니다.
 *
 * 사용 예시:
 * ```typescript
 * import { toast } from '@/lib/utils/toast';
 *
 * toast.success('북마크가 추가되었습니다.');
 * toast.error('관광지 정보를 불러올 수 없습니다.');
 * ```
 *
 * @dependencies
 * - sonner: Toast 라이브러리
 */

import { toast as sonnerToast } from 'sonner';

/**
 * Toast 알림 래퍼
 * sonner의 toast 함수를 직접 export하여 사용
 */
export const toast = {
  /**
   * 성공 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) => {
    return sonnerToast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  /**
   * 에러 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) => {
    return sonnerToast.error(message, {
      duration: 5000,
      ...options,
    });
  },

  /**
   * 정보 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    return sonnerToast.info(message, {
      duration: 3000,
      ...options,
    });
  },

  /**
   * 경고 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) => {
    return sonnerToast.warning(message, {
      duration: 4000,
      ...options,
    });
  },

  /**
   * 로딩 메시지 표시
   * @param message - 표시할 메시지
   * @param options - 추가 옵션
   */
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) => {
    return sonnerToast.loading(message, options);
  },

  /**
   * Promise 기반 Toast (성공/실패 자동 처리)
   * @param promise - Promise 객체
   * @param messages - 성공/실패 메시지
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};


/**
 * @file share-button.tsx
 * @description URL 공유 버튼 컴포넌트
 *
 * 이 컴포넌트는 현재 페이지 URL을 클립보드에 복사하는 기능을 제공합니다.
 *
 * @dependencies
 * - sonner: toast 알림
 * - lucide-react: Share2 아이콘
 * - components/ui/button.tsx: Button 컴포넌트
 */

'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
  className?: string;
}

/**
 * URL 공유 버튼 컴포넌트
 *
 * @param className - 추가 CSS 클래스
 */
export function ShareButton({ className }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      // 현재 페이지 URL 가져오기
      const url = typeof window !== 'undefined' ? window.location.href : '';

      if (!url) {
        toast.error('URL을 가져올 수 없습니다.');
        return;
      }

      // HTTPS 환경 확인
      if (typeof window !== 'undefined' && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success('링크가 클립보드에 복사되었습니다.');
      } else {
        // HTTPS가 아닌 경우 fallback (거의 발생하지 않음)
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('링크가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      console.error('[ShareButton] 복사 실패:', error);
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={`min-h-[44px] min-w-[44px] ${className || ''}`}
      aria-label="페이지 공유하기"
    >
      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      <span className="sr-only">페이지 공유하기</span>
    </Button>
  );
}


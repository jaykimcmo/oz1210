/**
 * @file copy-address-button.tsx
 * @description 주소 복사 버튼 컴포넌트
 *
 * 이 컴포넌트는 주소를 클립보드에 복사하는 기능을 제공합니다.
 *
 * @dependencies
 * - sonner: toast 알림
 * - lucide-react: Copy 아이콘
 * - components/ui/button.tsx: Button 컴포넌트
 */

'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CopyAddressButtonProps {
  address: string;
  className?: string;
}

/**
 * 주소 복사 버튼 컴포넌트
 *
 * @param address - 복사할 주소
 * @param className - 추가 CSS 클래스
 */
export function CopyAddressButton({ address, className }: CopyAddressButtonProps) {
  const handleCopy = async () => {
    try {
      // HTTPS 환경 확인
      if (typeof window !== 'undefined' && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
        toast.success('주소가 클립보드에 복사되었습니다.');
      } else {
        // HTTPS가 아닌 경우 fallback (거의 발생하지 않음)
        const textArea = document.createElement('textarea');
        textArea.value = address;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('주소가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      console.error('[CopyAddressButton] 복사 실패:', error);
      toast.error('주소 복사에 실패했습니다.');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label="주소 복사"
    >
      <Copy className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">주소 복사</span>
    </Button>
  );
}


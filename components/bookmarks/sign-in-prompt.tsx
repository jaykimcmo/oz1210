/**
 * @file sign-in-prompt.tsx
 * @description 로그인 유도 컴포넌트
 *
 * 북마크 페이지에서 미인증 사용자에게 로그인을 유도하는 UI를 표시합니다.
 *
 * @dependencies
 * - @clerk/nextjs: SignInButton
 * - lucide-react: LogIn
 * - components/ui/button.tsx: Button
 */

'use client';

import { SignInButton } from '@clerk/nextjs';
import { LogIn, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      {/* 아이콘 */}
      <div className="mb-6 p-4 rounded-full bg-muted">
        <Star
          className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      {/* 메시지 */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
        로그인이 필요합니다
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base text-center mb-8 max-w-md">
        북마크 기능을 사용하려면 로그인이 필요합니다.
        <br />
        로그인하여 마음에 드는 관광지를 저장해보세요.
      </p>

      {/* 로그인 버튼 */}
      <SignInButton mode="modal">
        <Button
          size="lg"
          className="min-h-[44px] gap-2"
          aria-label="로그인하기"
        >
          <LogIn className="h-5 w-5" aria-hidden="true" />
          로그인하기
        </Button>
      </SignInButton>
    </div>
  );
}


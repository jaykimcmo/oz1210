/**
 * @file feedback-button.tsx
 * @description 피드백 버튼 컴포넌트
 *
 * 화면 우측 하단에 고정되어 피드백 다이얼로그를 열 수 있는 버튼입니다.
 *
 * 주요 기능:
 * 1. 화면 우측 하단 고정 위치
 * 2. 클릭 시 피드백 다이얼로그 열기
 * 3. 호버/포커스 시 툴팁 표시
 * 4. 접근성 지원
 *
 * @dependencies
 * - lucide-react: MessageSquare
 * - components/ui/button: Button
 * - components/feedback/feedback-dialog: FeedbackDialog
 */

'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from '@/components/feedback/feedback-dialog';

/**
 * 피드백 버튼 컴포넌트
 */
export function FeedbackButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* 피드백 버튼 (화면 우측 하단 고정) */}
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
        aria-label="피드백 보내기"
        title="피드백 보내기"
      >
        <MessageSquare className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* 피드백 다이얼로그 */}
      <FeedbackDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}


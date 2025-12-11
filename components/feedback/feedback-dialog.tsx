/**
 * @file feedback-dialog.tsx
 * @description 피드백 다이얼로그 컴포넌트
 *
 * 사용자가 피드백을 제출할 수 있는 다이얼로그입니다.
 *
 * 주요 기능:
 * 1. 피드백 유형 선택 (버그 리포트, 기능 제안, 일반 의견)
 * 2. 내용 입력 (Textarea)
 * 3. 이메일 입력 (선택)
 * 4. 제출 처리 및 토스트 알림
 *
 * @dependencies
 * - components/ui/dialog: Dialog
 * - components/ui/select: Select
 * - components/ui/textarea: Textarea
 * - components/ui/input: Input
 * - components/ui/button: Button
 * - sonner: toast
 */

'use client';

import { useState } from 'react';
import { Bug, Lightbulb, MessageCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FeedbackType = 'bug' | 'feature' | 'general';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FEEDBACK_TYPES: { value: FeedbackType; label: string; icon: React.ReactNode }[] = [
  { value: 'bug', label: '버그 리포트', icon: <Bug className="h-4 w-4" /> },
  { value: 'feature', label: '기능 제안', icon: <Lightbulb className="h-4 w-4" /> },
  { value: 'general', label: '일반 의견', icon: <MessageCircle className="h-4 w-4" /> },
];

/**
 * 피드백 다이얼로그 컴포넌트
 */
export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 초기화
  const resetForm = () => {
    setFeedbackType('general');
    setContent('');
    setEmail('');
  };

  // 다이얼로그 닫기
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // 피드백 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!content.trim()) {
      toast.error('피드백 내용을 입력해주세요.');
      return;
    }

    if (content.trim().length < 10) {
      toast.error('피드백 내용을 10자 이상 입력해주세요.');
      return;
    }

    // 이메일 유효성 검사 (입력된 경우만)
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 현재는 콘솔 로깅만 수행 (추후 백엔드 연동 가능)
      const feedbackData = {
        type: feedbackType,
        content: content.trim(),
        email: email.trim() || null,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        url: typeof window !== 'undefined' ? window.location.href : null,
      };

      console.log('[Feedback] 피드백 제출:', feedbackData);

      // 시뮬레이션: 서버 응답 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 토스트
      toast.success('피드백이 성공적으로 전송되었습니다. 감사합니다!');

      // 다이얼로그 닫기
      handleClose();
    } catch (error) {
      console.error('[Feedback] 피드백 제출 실패:', error);
      toast.error('피드백 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>피드백 보내기</DialogTitle>
          <DialogDescription>
            서비스 개선을 위한 의견을 보내주세요. 소중한 피드백은 더 나은 서비스를 만드는 데
            큰 도움이 됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 피드백 유형 선택 */}
          <div className="space-y-2">
            <Label htmlFor="feedback-type">피드백 유형</Label>
            <Select
              value={feedbackType}
              onValueChange={(value) => setFeedbackType(value as FeedbackType)}
            >
              <SelectTrigger id="feedback-type" aria-label="피드백 유형 선택">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 피드백 내용 */}
          <div className="space-y-2">
            <Label htmlFor="feedback-content">
              내용 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedback-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                feedbackType === 'bug'
                  ? '발생한 문제를 자세히 설명해주세요. (재현 방법, 예상 동작 등)'
                  : feedbackType === 'feature'
                    ? '제안하고 싶은 기능을 설명해주세요.'
                    : '의견을 자유롭게 작성해주세요.'
              }
              className="min-h-[120px] resize-none"
              aria-required="true"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {content.length}/500자 (최소 10자)
            </p>
          </div>

          {/* 이메일 (선택) */}
          <div className="space-y-2">
            <Label htmlFor="feedback-email">
              이메일 <span className="text-muted-foreground">(선택)</span>
            </Label>
            <Input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="답변을 받으시려면 이메일을 입력해주세요"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  전송 중...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  전송
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


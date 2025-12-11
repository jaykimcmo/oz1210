/**
 * @file global-error.tsx
 * @description Root Layout 에러 페이지
 *
 * root layout에서 발생하는 에러를 처리합니다.
 * 이 파일은 html, body 태그를 포함해야 합니다.
 * CSS 로드 실패에 대비하여 인라인 스타일을 사용합니다.
 *
 * 주요 기능:
 * 1. root layout 에러 처리
 * 2. 최소한의 UI (CSS 로드 실패 대비)
 * 3. 새로고침 버튼
 * 4. Sentry 에러 리포팅
 */

'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Sentry에 에러 전송
    Sentry.captureException(error);
    // 콘솔 로깅
    console.error('[GlobalError] Root Layout 에러:', error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            maxWidth: '400px',
          }}
        >
          {/* 에러 아이콘 (SVG 인라인) */}
          <div
            style={{
              marginBottom: '1.5rem',
              display: 'inline-flex',
              padding: '1rem',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          {/* 에러 메시지 */}
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              color: '#1a1a1a',
            }}
          >
            심각한 오류가 발생했습니다
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem',
            }}
          >
            애플리케이션을 로드하는 중 문제가 발생했습니다.
          </p>

          {/* 에러 코드 */}
          {error.digest && (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '1.5rem',
              }}
            >
              에러 코드: {error.digest}
            </p>
          )}

          {/* 버튼 그룹 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: '#1a1a1a',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                minWidth: '160px',
              }}
              aria-label="다시 시도"
            >
              다시 시도
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1a1a1a',
                backgroundColor: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                minWidth: '160px',
              }}
              aria-label="홈으로 돌아가기"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}


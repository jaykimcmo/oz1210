/**
 * @file instrumentation-client.ts
 * @description Sentry 클라이언트 사이드 설정 (Next.js 15+ 권장 방식)
 *
 * 브라우저에서 발생하는 에러를 Sentry로 전송합니다.
 * Turbopack과 호환되는 방식입니다.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client}
 * @see {@link https://docs.sentry.io/platforms/javascript/guides/nextjs/}
 */

import * as Sentry from '@sentry/nextjs';

// 라우터 전환 추적을 위한 훅
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 트레이스 샘플링 비율 (프로덕션에서는 0.1~0.2 권장)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 세션 리플레이 샘플링 비율
  replaysSessionSampleRate: 0.1,

  // 에러 발생 시 리플레이 샘플링 비율
  replaysOnErrorSampleRate: 1.0,

  // 디버그 모드 (개발 환경에서만)
  debug: false,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 에러 필터링: 무시할 에러 패턴
  ignoreErrors: [
    // 네트워크 에러 (사용자 환경 문제)
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    // 브라우저 확장 프로그램 에러
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    // ResizeObserver 에러 (무해한 에러)
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ],

  // 통합 설정
  integrations: [
    Sentry.replayIntegration({
      // 개인정보 보호를 위한 마스킹
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});


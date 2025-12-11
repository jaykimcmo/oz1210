/**
 * @file sentry.server.config.ts
 * @description Sentry 서버 사이드 설정
 *
 * Node.js 런타임에서 발생하는 에러를 Sentry로 전송합니다.
 * Server Components, API Routes, Server Actions에서 발생하는 에러를 추적합니다.
 *
 * @see {@link https://docs.sentry.io/platforms/javascript/guides/nextjs/}
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 트레이스 샘플링 비율 (프로덕션에서는 0.1~0.2 권장)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 디버그 모드 (개발 환경에서만)
  debug: false,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 에러 필터링: 무시할 에러 패턴
  ignoreErrors: [
    // 네트워크 에러
    'Network request failed',
    'ECONNREFUSED',
    'ETIMEDOUT',
    // 404 에러 (정상적인 동작)
    'NEXT_NOT_FOUND',
  ],
});


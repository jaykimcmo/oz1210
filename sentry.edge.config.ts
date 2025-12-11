/**
 * @file sentry.edge.config.ts
 * @description Sentry Edge Runtime 설정
 *
 * Edge Runtime에서 발생하는 에러를 Sentry로 전송합니다.
 * Middleware, Edge API Routes에서 발생하는 에러를 추적합니다.
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
});


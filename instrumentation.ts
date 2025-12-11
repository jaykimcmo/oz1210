/**
 * @file instrumentation.ts
 * @description Next.js 15 Instrumentation 파일
 *
 * 서버 시작 시 Sentry를 초기화합니다.
 * Next.js 15에서 권장하는 방식으로 서버/엣지 런타임에서 Sentry를 로드합니다.
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation}
 * @see {@link https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/}
 */

import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Node.js 런타임에서 Sentry 서버 설정 로드
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  // Edge 런타임에서 Sentry 엣지 설정 로드
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

/**
 * 중첩된 React Server Components에서 발생하는 에러를 캡처합니다.
 * @see {@link https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#errors-from-nested-react-server-components}
 */
export const onRequestError = Sentry.captureRequestError;

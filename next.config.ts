import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      // 한국관광공사 API 이미지 도메인
      { hostname: "www.visitkorea.or.kr" },
      { hostname: "api.visitkorea.or.kr" },
      { hostname: "tong.visitkorea.or.kr" },
      { hostname: "cdn.visitkorea.or.kr" },
    ],
    // Next.js 16부터 필수: 사용하는 quality 값들을 명시
    qualities: [75, 85, 100],
  },
};

// Sentry 설정
// @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
export default withSentryConfig(nextConfig, {
  // 빌드 로그 숨김
  silent: true,

  // 소스맵 업로드 (SENTRY_AUTH_TOKEN 환경변수 필요)
  // 설정하지 않으면 소스맵 업로드가 비활성화됨
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // 클라이언트 번들에서 Sentry 관련 디버그 코드 제거
  disableLogger: true,

  // Turbopack과의 호환성
  tunnelRoute: '/monitoring',
});

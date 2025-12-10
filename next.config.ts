import type { NextConfig } from "next";

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

export default nextConfig;

/**
 * @file robots.ts
 * @description SEO Robots.txt 생성
 *
 * 검색 엔진 크롤러의 접근 규칙을 정의합니다.
 * Next.js 15 Metadata API를 사용합니다.
 *
 * 주요 기능:
 * 1. 모든 크롤러 허용
 * 2. sitemap URL 포함
 * 3. 관리자/테스트 페이지 차단
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots}
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API 엔드포인트
          '/auth-test/',     // 인증 테스트 페이지
          '/storage-test/',  // 스토리지 테스트 페이지
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


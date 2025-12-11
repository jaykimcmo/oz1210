/**
 * @file sitemap.ts
 * @description SEO Sitemap 생성
 *
 * 검색 엔진 크롤러를 위한 사이트맵을 생성합니다.
 * Next.js 15 Metadata API를 사용합니다.
 *
 * 주요 기능:
 * 1. 정적 페이지 목록 제공
 * 2. changeFrequency, priority 설정
 * 3. lastModified 설정
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap}
 */

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // 정적 페이지 목록
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // 동적 페이지 (관광지 상세)는 API 호출이 필요하므로 제외
  // 빌드 시간 증가 및 API 호출 제한 고려
  // 추후 필요시 아래와 같이 추가 가능:
  // const tourPages = await getTourPages();
  // const dynamicPages = tourPages.map((tour) => ({
  //   url: `${baseUrl}/places/${tour.contentid}`,
  //   lastModified: new Date(tour.modifiedtime),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.5,
  // }));

  return [...staticPages];
}


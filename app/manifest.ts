/**
 * @file manifest.ts
 * @description PWA Web App Manifest
 *
 * Next.js 15 Metadata API를 사용하여 PWA 매니페스트를 생성합니다.
 *
 * 주요 기능:
 * 1. 앱 이름 및 설명 정의
 * 2. 아이콘 설정 (192x192, 512x512)
 * 3. 테마 색상 및 배경 색상 설정
 * 4. 독립 실행형 모드 (standalone) 지원
 */

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Trip - 한국 관광지 정보 서비스',
    short_name: 'My Trip',
    description:
      '전국 관광지 정보를 한눈에! 지역별, 타입별 검색과 지도로 찾는 나만의 여행 계획',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'ko',
    categories: ['travel', 'tourism', 'navigation'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  };
}


/**
 * @file web-vitals.tsx
 * @description Web Vitals 성능 측정 컴포넌트
 *
 * Next.js의 useReportWebVitals 훅을 사용하여 Core Web Vitals를 측정합니다.
 *
 * 측정 항목:
 * - LCP (Largest Contentful Paint): 최대 콘텐츠 렌더링 시간
 * - FID (First Input Delay): 첫 입력 지연 시간
 * - CLS (Cumulative Layout Shift): 누적 레이아웃 이동
 * - FCP (First Contentful Paint): 첫 콘텐츠 렌더링 시간
 * - TTFB (Time to First Byte): 첫 바이트까지 시간
 * - INP (Interaction to Next Paint): 다음 페인트까지 상호작용 시간
 *
 * @dependencies
 * - next/web-vitals: useReportWebVitals
 */

'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * Web Vitals 측정 컴포넌트
 *
 * 개발 환경에서 콘솔에 성능 지표를 출력합니다.
 * 프로덕션에서는 분석 서비스로 전송할 수 있습니다.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // 개발 환경에서만 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      const { name, value, rating, id } = metric;

      // 등급에 따른 색상 설정
      const ratingColors: Record<string, string> = {
        good: '#0CCE6B',
        'needs-improvement': '#FFA400',
        poor: '#FF4E42',
      };

      const color = ratingColors[rating] || '#888888';

      console.log(
        `%c[Web Vitals] ${name}: ${value.toFixed(2)}ms (${rating})`,
        `color: ${color}; font-weight: bold;`,
        { id, value, rating }
      );
    }

    // 프로덕션에서 분석 서비스로 전송 (예: Google Analytics, Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //   // Google Analytics 4
    //   window.gtag?.('event', metric.name, {
    //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //     event_label: metric.id,
    //     non_interaction: true,
    //   });
    //
    //   // Sentry
    //   // Sentry.captureMessage(`Web Vital: ${metric.name}`, {
    //   //   level: 'info',
    //   //   extra: metric,
    //   // });
    // }
  });

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}


/**
 * @file page.tsx
 * @description 관광지 상세페이지
 *
 * 이 페이지는 개별 관광지의 상세 정보를 표시하는 페이지입니다.
 *
 * 주요 기능:
 * 1. 동적 라우팅을 통한 관광지 상세 정보 표시
 * 2. 뒤로가기 버튼 제공
 * 3. 기본 레이아웃 구조 (향후 섹션 추가 예정)
 *
 * 핵심 구현 로직:
 * - Next.js 15 App Router 동적 라우팅 (`[contentId]`)
 * - Server Component로 구현하여 초기 로딩 최적화
 * - params는 Promise로 처리 (Next.js 15 요구사항)
 * - API 호출을 통한 데이터 검증 및 에러 처리
 *
 * @dependencies
 * - next/navigation: notFound 함수
 * - lib/api/tour-api.ts: getDetailCommon, getDetailIntro, getDetailImage 함수
 * - lib/types/tour.ts: TourDetail, TourIntro, TourImage 타입
 * - components/tour-detail/detail-info.tsx: 기본 정보 섹션 컴포넌트
 * - components/tour-detail/detail-intro.tsx: 운영 정보 섹션 컴포넌트
 * - components/tour-detail/detail-gallery.tsx: 이미지 갤러리 섹션 컴포넌트
 * - components/tour-detail/detail-error.tsx: 에러 컴포넌트
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDetailCommon, getDetailIntro, getDetailImage } from '@/lib/api/tour-api';
import { TourApiError, NetworkError } from '@/lib/api/tour-api';
import { DetailError } from '@/components/tour-detail/detail-error';
import { DetailInfo } from '@/components/tour-detail/detail-info';
import { DetailIntro } from '@/components/tour-detail/detail-intro';
import { DetailGallery } from '@/components/tour-detail/detail-gallery';
import type { TourDetail, TourIntro, TourImage } from '@/lib/types/tour';

interface DetailPageProps {
  params: Promise<{ contentId: string }>;
}

/**
 * 관광지 상세페이지
 *
 * @param params - 동적 라우트 파라미터 (contentId)
 */
export default async function DetailPage({ params }: DetailPageProps) {
  // Next.js 15: params는 Promise이므로 await 처리
  const { contentId } = await params;

  // contentId 유효성 검증
  if (!contentId || contentId.trim() === '') {
    notFound();
  }

  // API 호출하여 데이터 검증 (에러 처리용)
  let detail: TourDetail | null = null;
  let error: Error | null = null;

  try {
    detail = await getDetailCommon({
      contentId: contentId.trim(),
      overviewYN: 'Y',
      firstImageYN: 'Y',
      addrinfoYN: 'Y',
      mapinfoYN: 'Y',
    });
  } catch (err) {
    // TourApiError의 NOT_FOUND 코드인 경우 404 처리
    if (err instanceof TourApiError && err.resultCode === 'NOT_FOUND') {
      notFound();
    }
    // 기타 에러는 에러 메시지로 표시
    error = err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
    console.error('[DetailPage] API 호출 실패:', err);
  }

  // 운영 정보 조회 (선택 사항이므로 에러가 발생해도 페이지는 계속 표시)
  let intro: TourIntro | null = null;
  if (detail) {
    try {
      intro = await getDetailIntro({
        contentId: contentId.trim(),
        contentTypeId: detail.contenttypeid,
      });
    } catch (err) {
      // 운영 정보는 선택 사항이므로 에러가 발생해도 페이지는 계속 표시
      if (err instanceof TourApiError && err.resultCode === 'NOT_FOUND') {
        // 운영 정보 없음 - 정상적인 경우일 수 있음
        intro = null;
      } else {
        // 기타 에러는 로깅만
        console.warn('[DetailPage] 운영 정보 조회 실패:', err);
        intro = null;
      }
    }
  }

  // 이미지 목록 조회 (선택 사항이므로 에러가 발생해도 페이지는 계속 표시)
  let images: TourImage[] = [];
  if (detail) {
    try {
      images = await getDetailImage({
        contentId: contentId.trim(),
        imageYN: 'Y',
        subImageYN: 'Y',
        numOfRows: 20, // 최대 20개 이미지
      });
    } catch (err) {
      // 이미지는 선택 사항이므로 에러가 발생해도 페이지는 계속 표시
      console.warn('[DetailPage] 이미지 목록 조회 실패:', err);
      images = [];
    }
  }

  // 에러가 발생한 경우 에러 UI 표시 (클라이언트 컴포넌트로 전환하여 재시도 기능 제공)
  if (error) {
    return <DetailError error={error} contentId={contentId.trim()} />;
  }

  // 데이터가 없는 경우 (이론적으로는 발생하지 않아야 함)
  if (!detail) {
    notFound();
  }

  return (
    <main className="w-full" role="main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 뒤로가기 버튼 */}
        <BackButton />

        {/* 메인 컨텐츠 영역 */}
        <div className="mt-8 space-y-8">
          {/* 기본 정보 섹션 */}
          <DetailInfo detail={detail} />
          {/* 운영 정보 섹션 */}
          {intro && <DetailIntro intro={intro} contentTypeId={detail.contenttypeid} />}
          {/* 이미지 갤러리 섹션 */}
          {images.length > 0 && <DetailGallery images={images} title={detail.title} />}
        </div>
      </div>
    </main>
  );
}

/**
 * 뒤로가기 버튼 컴포넌트
 * 페이지 상단에 고정되어 홈으로 돌아갈 수 있도록 함
 */
function BackButton() {
  return (
    <Link href="/">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        aria-label="이전 페이지로 돌아가기"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>뒤로가기</span>
      </Button>
    </Link>
  );
}


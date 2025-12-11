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
 * 4. 동적 Open Graph 메타태그 생성
 *
 * 핵심 구현 로직:
 * - Next.js 15 App Router 동적 라우팅 (`[contentId]`)
 * - Server Component로 구현하여 초기 로딩 최적화
 * - params는 Promise로 처리 (Next.js 15 요구사항)
 * - API 호출을 통한 데이터 검증 및 에러 처리
 * - generateMetadata 함수로 동적 SEO 메타태그 생성
 *
 * @dependencies
 * - next/navigation: notFound 함수
 * - next: Metadata 타입
 * - lib/api/tour-api.ts: getDetailCommon, getDetailIntro, getDetailImage 함수
 * - lib/types/tour.ts: TourDetail, TourIntro, TourImage 타입
 * - components/tour-detail/detail-info.tsx: 기본 정보 섹션 컴포넌트
 * - components/tour-detail/detail-intro.tsx: 운영 정보 섹션 컴포넌트
 * - components/tour-detail/detail-gallery.tsx: 이미지 갤러리 섹션 컴포넌트
 * - components/tour-detail/detail-map.tsx: 지도 섹션 컴포넌트
 * - components/tour-detail/detail-error.tsx: 에러 컴포넌트
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDetailCommon, getDetailIntro, getDetailImage, getDetailPetTour, getAreaBasedList } from '@/lib/api/tour-api';
import { TourApiError } from '@/lib/api/tour-api';
import { DetailError } from '@/components/tour-detail/detail-error';
import { DetailInfo } from '@/components/tour-detail/detail-info';
import { DetailIntro } from '@/components/tour-detail/detail-intro';
import { DetailGallery } from '@/components/tour-detail/detail-gallery';
import { DetailMap } from '@/components/tour-detail/detail-map';
import { DetailPetTour } from '@/components/tour-detail/detail-pet-tour';
import { DetailRecommendations } from '@/components/tour-detail/detail-recommendations';
import { ShareButton } from '@/components/tour-detail/share-button';
import { BookmarkButton } from '@/components/bookmarks/bookmark-button';
import type { TourDetail, TourIntro, TourImage, PetTourInfo, TourItem } from '@/lib/types/tour';

interface DetailPageProps {
  params: Promise<{ contentId: string }>;
}

/**
 * 동적 메타데이터 생성 함수
 * Open Graph 태그를 동적으로 생성하여 SEO 최적화
 *
 * @param params - 동적 라우트 파라미터 (contentId)
 * @returns Metadata 객체
 */
export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { contentId } = await params;

  // 기본 메타데이터 (에러 발생 시 사용)
  const defaultMetadata: Metadata = {
    title: '관광지 정보',
    description: '한국관광공사 관광지 정보를 확인하세요.',
    openGraph: {
      title: '관광지 정보 | My Trip',
      description: '한국관광공사 관광지 정보를 확인하세요.',
      type: 'website',
      url: `/places/${contentId}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'My Trip',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '관광지 정보 | My Trip',
      description: '한국관광공사 관광지 정보를 확인하세요.',
      images: ['/og-image.png'],
    },
  };

  // API 호출하여 관광지 정보 조회
  try {
    const detail = await getDetailCommon({
      contentId: contentId.trim(),
    });

    // 설명 텍스트 생성 (100자 이내)
    const description =
      detail.overview && detail.overview.trim()
        ? detail.overview.trim().slice(0, 100) + (detail.overview.length > 100 ? '...' : '')
        : `${detail.title} 관광지 정보를 확인하세요.`;

    // 이미지 URL 결정 (firstimage 우선, 없으면 firstimage2, 둘 다 없으면 기본 이미지)
    const imageUrl = detail.firstimage || detail.firstimage2 || '/og-image.png';

    // 절대 URL 생성 (metadataBase 사용)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const pageUrl = `${baseUrl}/places/${contentId}`;

    return {
      title: detail.title,
      description,
      openGraph: {
        title: `${detail.title} | My Trip`,
        description,
        type: 'website',
        url: pageUrl,
        images: [
          {
            url: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
            width: 1200,
            height: 630,
            alt: detail.title,
          },
        ],
        siteName: 'My Trip',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${detail.title} | My Trip`,
        description,
        images: [imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`],
      },
    };
  } catch (error) {
    // API 호출 실패 시 기본 메타데이터 반환
    console.warn('[generateMetadata] 메타데이터 생성 실패, 기본값 사용:', error);
    return defaultMetadata;
  }
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

  // 반려동물 정보 조회 (선택 사항이므로 에러가 발생해도 페이지는 계속 표시)
  let petInfo: PetTourInfo | null = null;
  if (detail) {
    try {
      petInfo = await getDetailPetTour({
        contentId: contentId.trim(),
      });
    } catch (err) {
      // 반려동물 정보는 선택 사항이므로 에러가 발생해도 페이지는 계속 표시
      if (err instanceof TourApiError && err.resultCode === 'NOT_FOUND') {
        // 반려동물 정보 없음 - 정상적인 경우일 수 있음
        petInfo = null;
      } else {
        // 기타 에러는 로깅만
        console.warn('[DetailPage] 반려동물 정보 조회 실패:', err);
        petInfo = null;
      }
    }
  }

  // 추천 관광지 조회 (선택 사항이므로 에러가 발생해도 페이지는 계속 표시)
  let recommendations: TourItem[] = [];
  if (detail) {
    try {
      // 같은 지역 또는 같은 타입의 관광지 조회 (병렬 처리)
      const [areaTours, typeTours] = await Promise.all([
        getAreaBasedList({
          areaCode: detail.areacode,
          numOfRows: 20,
          pageNo: 1,
        }),
        getAreaBasedList({
          contentTypeId: detail.contenttypeid,
          numOfRows: 20,
          pageNo: 1,
        }),
      ]);

      // 병합 및 중복 제거 (contentid 기준)
      const allTours = [...areaTours.items, ...typeTours.items];
      const uniqueTours = Array.from(
        new Map(allTours.map(tour => [tour.contentid, tour])).values()
      );

      // 현재 관광지 제외 및 최대 10개 선택
      recommendations = uniqueTours
        .filter(tour => tour.contentid !== detail.contentid)
        .slice(0, 10);
    } catch (err) {
      // 추천 관광지는 선택 사항이므로 에러가 발생해도 페이지는 계속 표시
      console.warn('[DetailPage] 추천 관광지 조회 실패:', err);
      recommendations = [];
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
        {/* 뒤로가기 버튼 및 액션 버튼들 */}
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-2">
            <BookmarkButton contentId={detail.contentid} />
            <ShareButton />
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="mt-8 space-y-8">
          {/* 기본 정보 섹션 */}
          <DetailInfo detail={detail} />
          {/* 운영 정보 섹션 */}
          {intro && <DetailIntro intro={intro} contentTypeId={detail.contenttypeid} />}
          {/* 반려동물 정보 섹션 */}
          {petInfo && <DetailPetTour petInfo={petInfo} />}
          {/* 이미지 갤러리 섹션 */}
          {images.length > 0 && <DetailGallery images={images} title={detail.title} />}
          {/* 지도 섹션 */}
          <DetailMap detail={detail} />
          {/* 추천 관광지 섹션 */}
          {recommendations.length > 0 && (
            <DetailRecommendations recommendations={recommendations} />
          )}
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


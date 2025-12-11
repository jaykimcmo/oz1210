/**
 * @file detail-info.tsx
 * @description 관광지 기본 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 기본 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 관광지명 (대제목)
 * 2. 대표 이미지 (크게 표시)
 * 3. 주소 표시 및 복사 기능
 * 4. 전화번호 (클릭 시 전화 연결)
 * 5. 홈페이지 (링크)
 * 6. 개요 (긴 설명문)
 * 7. 관광 타입 및 카테고리 뱃지
 *
 * 핵심 구현 로직:
 * - Server Component로 구현 (데이터는 page.tsx에서 전달)
 * - 정보 없는 항목은 조건부 렌더링으로 숨김 처리
 * - 주소 복사 기능은 클라이언트 컴포넌트로 분리
 *
 * @dependencies
 * - next/image: 이미지 최적화
 * - lib/types/tour.ts: TourDetail 타입
 * - lib/types/stats.ts: CONTENT_TYPE_NAMES 상수
 * - components/ui/badge.tsx: Badge 컴포넌트
 * - components/tour-detail/copy-address-button.tsx: 주소 복사 버튼
 * - lucide-react: 아이콘들
 */

import Image from 'next/image';
import { MapPin, Phone, Globe, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CopyAddressButton } from '@/components/tour-detail/copy-address-button';
import type { TourDetail } from '@/lib/types/tour';
import { CONTENT_TYPE_NAMES } from '@/lib/types/stats';
import type { ContentTypeId } from '@/lib/types/tour';

interface DetailInfoProps {
  detail: TourDetail;
}

/**
 * 관광지 기본 정보 섹션 컴포넌트
 *
 * @param detail - 관광지 상세 정보
 */
export function DetailInfo({ detail }: DetailInfoProps) {
  // 이미지 URL 결정 (firstimage 우선, 없으면 firstimage2)
  const imageUrl = detail.firstimage || detail.firstimage2 || null;

  // 관광 타입명 변환
  const typeName =
    CONTENT_TYPE_NAMES[detail.contenttypeid as ContentTypeId] ?? '기타';

  // 주소 표시 (addr1 + addr2)
  const address = detail.addr2
    ? `${detail.addr1} ${detail.addr2}`
    : detail.addr1;

  // 홈페이지 URL 검증 및 정규화
  const parseHomepage = (
    html?: string,
  ): { url: string; text: string } | null => {
    if (!html || html.trim() === '') return null;

    const trimmed = html.trim();

    // HTML 태그가 포함되어 있는 경우 파싱
    // 예: 홈페이지 <a href="https://gagokspa.kr/" target="_blank">https://gagokspa.kr/</a>
    const linkMatch = trimmed.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i);

    if (linkMatch) {
      const url = linkMatch[1];
      const text = linkMatch[2];
      return { url, text };
    }

    // HTML 태그가 없는 경우 일반 URL로 처리
    // http:// 또는 https://가 없으면 추가
    let url = trimmed;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    return { url, text: trimmed };
  };

  const homepage = parseHomepage(detail.homepage);

  return (
    <section aria-label="기본 정보" className="space-y-6">
      {/* 관광지명 */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          {detail.title}
        </h1>

        {/* 관광 타입 및 카테고리 뱃지 */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Badge variant="default">{typeName}</Badge>
          {detail.cat1 && (
            <Badge variant="outline" className="text-xs">
              {detail.cat1}
            </Badge>
          )}
          {detail.cat2 && (
            <Badge variant="outline" className="text-xs">
              {detail.cat2}
            </Badge>
          )}
          {detail.cat3 && (
            <Badge variant="outline" className="text-xs">
              {detail.cat3}
            </Badge>
          )}
        </div>
      </div>

      {/* 대표 이미지 */}
      {imageUrl ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={detail.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            priority
            quality={85}
          />
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">이미지 없음</span>
        </div>
      )}

      {/* 기본 정보 그리드 */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {/* 주소 */}
        {address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">주소</p>
                  <p className="text-base break-words">{address}</p>
                  {detail.zipcode && (
                    <p className="text-sm text-muted-foreground mt-1">
                      우편번호: {detail.zipcode}
                    </p>
                  )}
                </div>
                <CopyAddressButton address={address} />
              </div>
            </div>
          </div>
        )}

        {/* 전화번호 */}
        {detail.tel && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">전화번호</p>
              <a
                href={`tel:${detail.tel}`}
                className="text-base text-primary hover:underline break-all"
                aria-label={`${detail.tel}로 전화하기`}
              >
                {detail.tel}
              </a>
            </div>
          </div>
        )}

        {/* 홈페이지 */}
        {homepage && (
          <div className="flex items-start gap-3 sm:col-span-1 lg:col-span-2">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">홈페이지</p>
              <a
                href={homepage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-primary hover:underline break-all inline-flex items-center gap-1"
                aria-label="홈페이지 열기 (새 탭)"
              >
                {homepage.text}
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 개요 */}
      {detail.overview && (
        <div className="pt-4 border-t">
          <h2 className="text-xl font-semibold mb-3">개요</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
              {detail.overview}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}


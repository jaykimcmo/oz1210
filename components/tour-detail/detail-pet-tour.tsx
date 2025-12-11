/**
 * @file detail-pet-tour.tsx
 * @description 관광지 반려동물 동반 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 반려동물 동반 여행 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 반려동물 동반 가능 여부 표시
 * 2. 반려동물 크기 제한 정보
 * 3. 반려동물 입장 가능 장소 (실내/실외)
 * 4. 반려동물 동반 추가 요금
 * 5. 반려동물 전용 시설 정보
 * 6. 주차장 정보 (반려동물 하차 공간)
 * 7. 주의사항 강조 표시
 *
 * 핵심 구현 로직:
 * - Server Component로 구현 (데이터는 page.tsx에서 전달)
 * - 정보 없는 항목은 조건부 렌더링으로 숨김 처리
 * - 뱃지를 사용하여 크기별, 장소별 정보 표시
 *
 * @dependencies
 * - lib/types/tour.ts: PetTourInfo 타입
 * - lucide-react: 아이콘들
 * - components/ui/badge.tsx: Badge 컴포넌트
 */

import { PawPrint, Info, AlertCircle, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PetTourInfo } from '@/lib/types/tour';

interface DetailPetTourProps {
  petInfo: PetTourInfo;
}

/**
 * 관광지 반려동물 동반 정보 섹션 컴포넌트
 *
 * @param petInfo - 반려동물 동반 정보
 */
export function DetailPetTour({ petInfo }: DetailPetTourProps) {
  // 동반 가능 여부 파싱
  const isPetAllowed = parsePetAllowed(petInfo.chkpetleash);
  const petAllowedText = getPetAllowedText(petInfo.chkpetleash);

  // 크기 정보 파싱
  const petSizeBadges = parsePetSize(petInfo.chkpetsize);

  // 장소 정보 파싱
  const petPlaceBadges = parsePetPlace(petInfo.chkpetplace);

  // 표시할 정보 필드
  const infoFields = [
    { key: 'chkpetfee', label: '추가 요금', icon: Info, value: petInfo.chkpetfee },
    { key: 'parking', label: '주차장 정보', icon: Car, value: petInfo.parking },
  ].filter((field) => field.value && field.value.trim() !== '');

  // 표시할 정보가 없으면 섹션 숨김
  if (!isPetAllowed && petSizeBadges.length === 0 && petPlaceBadges.length === 0 && infoFields.length === 0 && !petInfo.petinfo) {
    return null;
  }

  return (
    <section aria-label="반려동물 동반 정보" className="space-y-6 pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <PawPrint className="h-6 w-6 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">반려동물 동반 정보</h2>
      </div>

      {/* 동반 가능 여부 */}
      {petInfo.chkpetleash && (
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
          <PawPrint className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">동반 가능 여부</p>
            <p className="text-base font-semibold">{petAllowedText}</p>
          </div>
          {isPetAllowed && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              가능
            </Badge>
          )}
        </div>
      )}

      {/* 크기 및 장소 정보 */}
      {(petSizeBadges.length > 0 || petPlaceBadges.length > 0) && (
        <div className="space-y-3">
          {petSizeBadges.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">반려동물 크기</p>
              <div className="flex flex-wrap gap-2">
                {petSizeBadges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {petPlaceBadges.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">입장 가능 장소</p>
              <div className="flex flex-wrap gap-2">
                {petPlaceBadges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 추가 정보 */}
      {infoFields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {infoFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="flex items-start gap-3">
                <Icon
                  className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {field.label}
                  </p>
                  <p className="text-base break-words whitespace-pre-line">{field.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 주의사항 */}
      {petInfo.petinfo && (
        <div className="p-4 rounded-lg border border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                주의사항
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 break-words whitespace-pre-line">
                {petInfo.petinfo}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * 반려동물 동반 가능 여부 파싱
 *
 * @param chkpetleash - 동반 가능 여부 문자열
 * @returns 동반 가능 여부 (boolean)
 */
function parsePetAllowed(chkpetleash?: string): boolean {
  if (!chkpetleash) return false;
  const lower = chkpetleash.toLowerCase();
  return lower.includes('가능') || lower.includes('허용') || lower.includes('yes') || lower === 'y';
}

/**
 * 반려동물 동반 가능 여부 텍스트 생성
 *
 * @param chkpetleash - 동반 가능 여부 문자열
 * @returns 표시할 텍스트
 */
function getPetAllowedText(chkpetleash?: string): string {
  if (!chkpetleash) return '정보 없음';
  const lower = chkpetleash.toLowerCase();
  if (lower.includes('불가') || lower.includes('금지') || lower.includes('no') || lower === 'n') {
    return '반려동물 동반 불가';
  }
  if (lower.includes('제한') || lower.includes('제한적')) {
    return '반려동물 동반 제한적';
  }
  if (lower.includes('가능') || lower.includes('허용') || lower.includes('yes') || lower === 'y') {
    return '반려동물 동반 가능';
  }
  return chkpetleash;
}

/**
 * 반려동물 크기 정보 파싱
 *
 * @param chkpetsize - 크기 정보 문자열
 * @returns 크기 뱃지 텍스트 배열
 */
function parsePetSize(chkpetsize?: string): string[] {
  if (!chkpetsize) return [];
  const lower = chkpetsize.toLowerCase();
  const badges: string[] = [];

  if (lower.includes('소형') || lower.includes('small')) {
    badges.push('소형견 가능');
  }
  if (lower.includes('중형') || lower.includes('medium')) {
    badges.push('중형견 가능');
  }
  if (lower.includes('대형') || lower.includes('large')) {
    badges.push('대형견 가능');
  }

  // 매칭되지 않으면 원본 텍스트 반환
  if (badges.length === 0 && chkpetsize.trim() !== '') {
    badges.push(chkpetsize);
  }

  return badges;
}

/**
 * 반려동물 입장 가능 장소 정보 파싱
 *
 * @param chkpetplace - 장소 정보 문자열
 * @returns 장소 뱃지 텍스트 배열
 */
function parsePetPlace(chkpetplace?: string): string[] {
  if (!chkpetplace) return [];
  const lower = chkpetplace.toLowerCase();
  const badges: string[] = [];

  if (lower.includes('실내') || lower.includes('indoor')) {
    badges.push('실내 가능');
  }
  if (lower.includes('실외') || lower.includes('outdoor')) {
    badges.push('실외 가능');
  }
  if (lower.includes('모두') || lower.includes('all') || lower.includes('전체')) {
    badges.push('모두 가능');
  }

  // 매칭되지 않으면 원본 텍스트 반환
  if (badges.length === 0 && chkpetplace.trim() !== '') {
    badges.push(chkpetplace);
  }

  return badges;
}


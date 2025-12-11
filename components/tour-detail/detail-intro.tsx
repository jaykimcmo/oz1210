/**
 * @file detail-intro.tsx
 * @description 관광지 운영 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 운영 정보를 표시합니다.
 *
 * 주요 기능:
 * 1. 운영시간/개장시간
 * 2. 휴무일
 * 3. 이용요금
 * 4. 주차 가능 여부
 * 5. 수용인원
 * 6. 체험 프로그램
 * 7. 유모차/반려동물 동반 가능 여부
 * 8. 문의처
 * 9. 타입별 특수 정보 (문화시설, 축제, 레포츠, 숙박, 음식점 등)
 *
 * 핵심 구현 로직:
 * - Server Component로 구현 (데이터는 page.tsx에서 전달)
 * - 정보 없는 항목은 조건부 렌더링으로 숨김 처리
 * - 관광 타입별로 다른 필드를 조건부로 표시
 *
 * @dependencies
 * - lib/types/tour.ts: TourIntro 타입
 * - lucide-react: 아이콘들
 */

import {
  Clock,
  CalendarX,
  CreditCard,
  Car,
  Users,
  Activity,
  Baby,
  PawPrint,
  Phone,
  Info,
} from 'lucide-react';
import type { TourIntro } from '@/lib/types/tour';

interface DetailIntroProps {
  intro: TourIntro;
  contentTypeId: string;
}

/**
 * 관광지 운영 정보 섹션 컴포넌트
 *
 * @param intro - 관광지 운영 정보
 * @param contentTypeId - 관광 타입 ID
 */
export function DetailIntro({ intro, contentTypeId }: DetailIntroProps) {
  // 공통 운영 정보 필드
  const commonFields = [
    { key: 'usetime', label: '운영시간', icon: Clock, value: intro.usetime },
    { key: 'restdate', label: '휴무일', icon: CalendarX, value: intro.restdate },
    { key: 'usefee', label: '이용요금', icon: CreditCard, value: intro.usefee },
    { key: 'parking', label: '주차', icon: Car, value: intro.parking },
    { key: 'accomcount', label: '수용인원', icon: Users, value: intro.accomcount },
    { key: 'expguide', label: '체험 프로그램', icon: Activity, value: intro.expguide },
    { key: 'chkbabycarriage', label: '유모차', icon: Baby, value: intro.chkbabycarriage },
    { key: 'chkpet', label: '반려동물', icon: PawPrint, value: intro.chkpet },
    { key: 'infocenter', label: '문의처', icon: Phone, value: intro.infocenter },
  ].filter((field) => field.value && field.value.trim() !== '');

  // 타입별 특수 정보 필드
  const typeSpecificFields = getTypeSpecificFields(intro, contentTypeId);

  // 표시할 정보가 없으면 섹션 숨김
  if (commonFields.length === 0 && typeSpecificFields.length === 0) {
    return null;
  }

  return (
    <section aria-label="운영 정보" className="space-y-6 pt-6 border-t">
      <h2 className="text-2xl font-semibold mb-4">운영 정보</h2>

      {/* 공통 운영 정보 */}
      {commonFields.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {commonFields.map((field) => {
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

      {/* 타입별 특수 정보 */}
      {typeSpecificFields.length > 0 && (
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-3">추가 정보</h3>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {typeSpecificFields.map((field) => {
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
        </div>
      )}
    </section>
  );
}

/**
 * 타입별 특수 정보 필드 추출
 *
 * @param intro - 관광지 운영 정보
 * @param contentTypeId - 관광 타입 ID
 * @returns 타입별 특수 정보 필드 배열
 */
function getTypeSpecificFields(
  intro: TourIntro,
  contentTypeId: string,
): Array<{ key: string; label: string; icon: typeof Info; value: string }> {
  const fields: Array<{ key: string; label: string; icon: typeof Info; value: string }> = [];

  switch (contentTypeId) {
    case '14': // 문화시설
      if (intro.useseason) {
        fields.push({ key: 'useseason', label: '이용시기', icon: CalendarX, value: intro.useseason });
      }
      if (intro.usetimeculture) {
        fields.push({
          key: 'usetimeculture',
          label: '문화시설 이용시간',
          icon: Clock,
          value: intro.usetimeculture,
        });
      }
      break;

    case '15': // 축제/행사
      if (intro.eventstartdate && intro.eventenddate) {
        fields.push({
          key: 'eventperiod',
          label: '축제 기간',
          icon: CalendarX,
          value: `${intro.eventstartdate} ~ ${intro.eventenddate}`,
        });
      } else if (intro.eventstartdate) {
        fields.push({
          key: 'eventstartdate',
          label: '축제 시작일',
          icon: CalendarX,
          value: intro.eventstartdate,
        });
      }
      if (intro.eventplace) {
        fields.push({
          key: 'eventplace',
          label: '축제 장소',
          icon: Info,
          value: intro.eventplace,
        });
      }
      if (intro.festivalgrade) {
        fields.push({
          key: 'festivalgrade',
          label: '축제 등급',
          icon: Info,
          value: intro.festivalgrade,
        });
      }
      if (intro.program) {
        fields.push({
          key: 'program',
          label: '프로그램',
          icon: Activity,
          value: intro.program,
        });
      }
      if (intro.sponsor1) {
        fields.push({
          key: 'sponsor1',
          label: '주최/후원',
          icon: Info,
          value: intro.sponsor1 + (intro.sponsor2 ? `, ${intro.sponsor2}` : ''),
        });
      }
      break;

    case '28': // 레포츠
      if (intro.expagerange) {
        fields.push({
          key: 'expagerange',
          label: '체험 가능 연령',
          icon: Users,
          value: intro.expagerange,
        });
      }
      if (intro.openperiod) {
        fields.push({
          key: 'openperiod',
          label: '개장 기간',
          icon: CalendarX,
          value: intro.openperiod,
        });
      }
      if (intro.reservation) {
        fields.push({
          key: 'reservation',
          label: '예약 정보',
          icon: Info,
          value: intro.reservation,
        });
      }
      break;

    case '32': // 숙박
      if (intro.checkintime) {
        fields.push({
          key: 'checkintime',
          label: '체크인 시간',
          icon: Clock,
          value: intro.checkintime,
        });
      }
      if (intro.checkouttime) {
        fields.push({
          key: 'checkouttime',
          label: '체크아웃 시간',
          icon: Clock,
          value: intro.checkouttime,
        });
      }
      if (intro.chkcooking) {
        fields.push({
          key: 'chkcooking',
          label: '취사 가능',
          icon: Info,
          value: intro.chkcooking,
        });
      }
      if (intro.roomcount) {
        fields.push({
          key: 'roomcount',
          label: '객실 수',
          icon: Info,
          value: intro.roomcount,
        });
      }
      if (intro.roomtype) {
        fields.push({
          key: 'roomtype',
          label: '객실 유형',
          icon: Info,
          value: intro.roomtype,
        });
      }
      if (intro.hanok) {
        fields.push({
          key: 'hanok',
          label: '한옥 여부',
          icon: Info,
          value: intro.hanok,
        });
      }
      break;

    case '39': // 음식점
      if (intro.firstmenu) {
        fields.push({
          key: 'firstmenu',
          label: '대표 메뉴',
          icon: Info,
          value: intro.firstmenu,
        });
      }
      if (intro.opentimefood) {
        fields.push({
          key: 'opentimefood',
          label: '영업시간',
          icon: Clock,
          value: intro.opentimefood,
        });
      }
      if (intro.packing) {
        fields.push({
          key: 'packing',
          label: '포장 가능',
          icon: Info,
          value: intro.packing,
        });
      }
      if (intro.seat) {
        fields.push({
          key: 'seat',
          label: '좌석 수',
          icon: Users,
          value: intro.seat,
        });
      }
      if (intro.smoking) {
        fields.push({
          key: 'smoking',
          label: '흡연 가능',
          icon: Info,
          value: intro.smoking,
        });
      }
      break;
  }

  return fields.filter((field) => field.value && field.value.trim() !== '');
}


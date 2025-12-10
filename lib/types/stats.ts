/**
 * @file stats.ts
 * @description 통계 대시보드용 타입 정의
 *
 * 이 파일은 통계 대시보드 페이지에서 사용하는 타입 정의를 포함합니다.
 *
 * 주요 타입:
 * - RegionStats: 지역별 관광지 통계
 * - TypeStats: 타입별 관광지 통계
 * - StatsSummary: 통계 요약 정보
 *
 * @dependencies
 * - lib/types/tour.ts: ContentTypeId 타입 참조
 *
 * @see {@link docs/PRD.md} - 통계 대시보드 요구사항
 */

import type { ContentTypeId } from './tour';

/**
 * 지역별 통계
 * 각 시/도별 관광지 개수를 나타냅니다.
 */
export interface RegionStats {
  /** 지역코드 */
  areaCode: string;
  /** 지역명 */
  areaName: string;
  /** 관광지 개수 */
  count: number;
}

/**
 * 타입별 통계
 * 각 관광 타입별 관광지 개수와 비율을 나타냅니다.
 */
export interface TypeStats {
  /** 콘텐츠 타입 ID */
  contentTypeId: ContentTypeId;
  /** 타입명 (한글) */
  typeName: string;
  /** 관광지 개수 */
  count: number;
  /** 전체 대비 비율 (백분율, 0-100) */
  percentage: number;
}

/**
 * 통계 요약 정보
 * 전체 통계와 Top 3 지역/타입을 포함합니다.
 */
export interface StatsSummary {
  /** 전체 관광지 수 */
  totalCount: number;
  /** Top 3 지역 */
  topRegions: Array<{
    /** 지역코드 */
    areaCode: string;
    /** 지역명 */
    areaName: string;
    /** 관광지 개수 */
    count: number;
  }>;
  /** Top 3 타입 */
  topTypes: Array<{
    /** 콘텐츠 타입 ID */
    contentTypeId: ContentTypeId;
    /** 타입명 */
    typeName: string;
    /** 관광지 개수 */
    count: number;
  }>;
  /** 마지막 업데이트 시간 */
  lastUpdated: Date;
}

/**
 * 콘텐츠 타입 ID를 한글명으로 매핑하는 상수
 */
export const CONTENT_TYPE_NAMES: Record<ContentTypeId, string> = {
  '12': '관광지',
  '14': '문화시설',
  '15': '축제/행사',
  '25': '여행코스',
  '28': '레포츠',
  '32': '숙박',
  '38': '쇼핑',
  '39': '음식점',
} as const;

/**
 * 지역코드를 지역명으로 매핑하는 상수
 * 한국관광공사 API의 시/도 코드 기준
 */
export const AREA_CODE_NAMES: Record<string, string> = {
  '1': '서울',
  '2': '인천',
  '3': '대전',
  '4': '대구',
  '5': '광주',
  '6': '부산',
  '7': '울산',
  '8': '세종',
  '31': '경기',
  '32': '강원',
  '33': '충북',
  '34': '충남',
  '35': '경북',
  '36': '경남',
  '37': '전북',
  '38': '전남',
  '39': '제주',
} as const;


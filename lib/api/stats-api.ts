/**
 * @file stats-api.ts
 * @description 통계 대시보드용 데이터 수집 API
 *
 * 이 모듈은 한국관광공사 API를 활용하여 통계 데이터를 수집합니다.
 *
 * 주요 기능:
 * 1. 지역별 관광지 통계 수집 (getRegionStats)
 * 2. 타입별 관광지 통계 수집 (getTypeStats)
 * 3. 통계 요약 정보 생성 (getStatsSummary)
 *
 * 핵심 구현 로직:
 * - 병렬 API 호출로 성능 최적화 (Promise.allSettled)
 * - 개별 실패 허용 및 부분 실패 처리
 * - numOfRows: 1로 최소 데이터만 요청 (totalCount만 필요)
 * - 비율 계산 및 Top 3 계산 로직
 *
 * @dependencies
 * - lib/api/tour-api.ts: getAreaBasedList 함수
 * - lib/types/stats.ts: RegionStats, TypeStats, StatsSummary 타입
 *
 * @see {@link docs/PRD.md} - 통계 대시보드 요구사항
 */

import { getAreaBasedList } from './tour-api';
import type { RegionStats, TypeStats, StatsSummary } from '@/lib/types/stats';
import { AREA_CODE_NAMES, CONTENT_TYPE_NAMES } from '@/lib/types/stats';
import type { ContentTypeId } from '@/lib/types/tour';

/**
 * 지역별 관광지 통계 수집
 * 각 시/도별 관광지 개수를 집계합니다.
 *
 * @returns 지역별 통계 배열 (개수 기준 내림차순 정렬)
 * @throws 모든 지역 통계 수집이 실패한 경우에만 에러 throw
 */
export async function getRegionStats(): Promise<RegionStats[]> {
  const areaCodes = Object.keys(AREA_CODE_NAMES);

  if (process.env.NODE_ENV === 'development') {
    console.group('[Stats API] 지역별 통계 수집 시작');
    console.log('지역 코드 목록:', areaCodes);
    console.groupEnd();
  }

  // 병렬로 모든 지역 API 호출
  const results = await Promise.allSettled(
    areaCodes.map(async (areaCode) => {
      try {
        const { totalCount } = await getAreaBasedList({
          areaCode,
          numOfRows: 1, // totalCount만 필요하므로 최소 데이터만 요청
          pageNo: 1,
        });

        return {
          areaCode,
          areaName: AREA_CODE_NAMES[areaCode],
          count: totalCount,
        } as RegionStats;
      } catch (error) {
        // 개별 실패는 로그만 남기고 null 반환
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Stats API] 지역 ${areaCode} (${AREA_CODE_NAMES[areaCode]}) 통계 수집 실패:`, error);
        }
        return null;
      }
    })
  );

  // 성공한 결과만 필터링
  const stats = results
    .filter(
      (result): result is PromiseFulfilledResult<RegionStats | null> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)
    .filter((value): value is RegionStats => value !== null)
    .sort((a, b) => b.count - a.count); // 개수 기준 내림차순

  if (process.env.NODE_ENV === 'development') {
    console.group('[Stats API] 지역별 통계 수집 완료');
    console.log(`성공: ${stats.length}/${areaCodes.length}개 지역`);
    console.log('결과:', stats);
    console.groupEnd();
  }

  // 모든 지역이 실패한 경우에만 에러 throw
  if (stats.length === 0) {
    throw new Error('모든 지역의 통계 수집에 실패했습니다.');
  }

  return stats;
}

/**
 * 타입별 관광지 통계 수집
 * 각 관광 타입별 관광지 개수와 비율을 집계합니다.
 *
 * @returns 타입별 통계 배열 (개수 기준 내림차순 정렬)
 * @throws 모든 타입 통계 수집이 실패한 경우에만 에러 throw
 */
export async function getTypeStats(): Promise<TypeStats[]> {
  const contentTypeIds = Object.keys(CONTENT_TYPE_NAMES) as ContentTypeId[];

  if (process.env.NODE_ENV === 'development') {
    console.group('[Stats API] 타입별 통계 수집 시작');
    console.log('타입 ID 목록:', contentTypeIds);
    console.groupEnd();
  }

  // 병렬로 모든 타입 API 호출
  const results = await Promise.allSettled(
    contentTypeIds.map(async (contentTypeId) => {
      try {
        const { totalCount } = await getAreaBasedList({
          contentTypeId,
          numOfRows: 1, // totalCount만 필요하므로 최소 데이터만 요청
          pageNo: 1,
        });

        return {
          contentTypeId,
          typeName: CONTENT_TYPE_NAMES[contentTypeId],
          count: totalCount,
        };
      } catch (error) {
        // 개별 실패는 로그만 남기고 null 반환
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Stats API] 타입 ${contentTypeId} (${CONTENT_TYPE_NAMES[contentTypeId]}) 통계 수집 실패:`, error);
        }
        return null;
      }
    })
  );

  // 성공한 결과만 필터링
  const statsWithoutPercentage = results
    .filter(
      (result): result is PromiseFulfilledResult<{
        contentTypeId: ContentTypeId;
        typeName: string;
        count: number;
      } | null> => result.status === 'fulfilled'
    )
    .map((result) => result.value)
    .filter(
      (value): value is {
        contentTypeId: ContentTypeId;
        typeName: string;
        count: number;
      } => value !== null
    );

  // 모든 타입이 실패한 경우에만 에러 throw
  if (statsWithoutPercentage.length === 0) {
    throw new Error('모든 타입의 통계 수집에 실패했습니다.');
  }

  // 전체 개수 계산
  const totalCount = statsWithoutPercentage.reduce((sum, stat) => sum + stat.count, 0);

  // 비율 계산 및 정렬
  const stats: TypeStats[] = statsWithoutPercentage
    .map((stat) => ({
      ...stat,
      percentage:
        totalCount > 0
          ? Math.round((stat.count / totalCount) * 100 * 10) / 10 // 소수점 첫째 자리까지
          : 0,
    }))
    .sort((a, b) => b.count - a.count); // 개수 기준 내림차순

  if (process.env.NODE_ENV === 'development') {
    console.group('[Stats API] 타입별 통계 수집 완료');
    console.log(`성공: ${stats.length}/${contentTypeIds.length}개 타입`);
    console.log('전체 개수:', totalCount);
    console.log('결과:', stats);
    console.groupEnd();
  }

  return stats;
}

/**
 * 통계 요약 정보 생성
 * 전체 통계와 Top 3 지역/타입을 포함한 요약 정보를 생성합니다.
 *
 * @returns 통계 요약 정보
 */
export async function getStatsSummary(): Promise<StatsSummary> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Stats API] 통계 요약 정보 생성 시작');
  }

  // 지역별/타입별 통계를 병렬로 수집
  const [regionStats, typeStats] = await Promise.all([
    getRegionStats(),
    getTypeStats(),
  ]);

  // 전체 관광지 수 계산 (지역별 합계 또는 타입별 합계 중 큰 값 사용)
  // 지역별 합계와 타입별 합계가 다를 수 있음 (일부 데이터에 지역/타입 정보가 없을 수 있음)
  const totalFromRegions = regionStats.reduce((sum, stat) => sum + stat.count, 0);
  const totalFromTypes = typeStats.reduce((sum, stat) => sum + stat.count, 0);
  const totalCount = Math.max(totalFromRegions, totalFromTypes);

  // Top 3 지역 (이미 내림차순 정렬되어 있음)
  const topRegions = regionStats.slice(0, 3).map((stat) => ({
    areaCode: stat.areaCode,
    areaName: stat.areaName,
    count: stat.count,
  }));

  // Top 3 타입 (이미 내림차순 정렬되어 있음)
  const topTypes = typeStats.slice(0, 3).map((stat) => ({
    contentTypeId: stat.contentTypeId,
    typeName: stat.typeName,
    count: stat.count,
  }));

  const summary: StatsSummary = {
    totalCount,
    topRegions,
    topTypes,
    lastUpdated: new Date(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.group('[Stats API] 통계 요약 정보 생성 완료');
    console.log('전체 관광지 수:', totalCount);
    console.log('Top 3 지역:', topRegions);
    console.log('Top 3 타입:', topTypes);
    console.groupEnd();
  }

  return summary;
}

/**
 * 모든 통계 데이터를 한 번에 가져오기
 * 페이지에서 필요한 모든 통계 데이터를 병렬로 가져옵니다.
 *
 * @returns 지역별 통계, 타입별 통계, 요약 정보
 */
export async function getAllStats(): Promise<{
  regionStats: RegionStats[];
  typeStats: TypeStats[];
  summary: StatsSummary;
}> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Stats API] 모든 통계 데이터 수집 시작');
  }

  // 지역별/타입별 통계를 병렬로 수집
  const [regionStats, typeStats] = await Promise.all([
    getRegionStats(),
    getTypeStats(),
  ]);

  // 전체 관광지 수 계산
  const totalFromRegions = regionStats.reduce((sum, stat) => sum + stat.count, 0);
  const totalFromTypes = typeStats.reduce((sum, stat) => sum + stat.count, 0);
  const totalCount = Math.max(totalFromRegions, totalFromTypes);

  // Top 3 지역
  const topRegions = regionStats.slice(0, 3).map((stat) => ({
    areaCode: stat.areaCode,
    areaName: stat.areaName,
    count: stat.count,
  }));

  // Top 3 타입
  const topTypes = typeStats.slice(0, 3).map((stat) => ({
    contentTypeId: stat.contentTypeId,
    typeName: stat.typeName,
    count: stat.count,
  }));

  const summary: StatsSummary = {
    totalCount,
    topRegions,
    topTypes,
    lastUpdated: new Date(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.group('[Stats API] 모든 통계 데이터 수집 완료');
    console.log('지역별 통계:', regionStats.length, '개');
    console.log('타입별 통계:', typeStats.length, '개');
    console.log('전체 관광지 수:', totalCount);
    console.groupEnd();
  }

  return {
    regionStats,
    typeStats,
    summary,
  };
}


/**
 * @file tour-actions.ts
 * @description 관광지 데이터 페칭을 위한 Server Actions
 *
 * 이 파일은 페이지네이션을 위한 Server Actions를 제공합니다.
 * Client Component에서 추가 페이지 데이터를 로드할 때 사용됩니다.
 *
 * 주요 기능:
 * 1. 지역 기반 목록 조회 (페이지네이션)
 * 2. 키워드 검색 (페이지네이션)
 *
 * @dependencies
 * - lib/api/tour-api.ts: API 클라이언트 함수들
 * - lib/types/tour.ts: 타입 정의
 */

'use server';

import {
  getAreaBasedList,
  searchKeyword,
  type GetAreaBasedListParams,
  type SearchKeywordParams,
} from '@/lib/api/tour-api';
import type { TourItem } from '@/lib/types/tour';

/**
 * 지역 기반 관광지 목록 조회 (페이지네이션)
 *
 * @param params 조회 파라미터
 * @returns 관광지 목록 및 총 개수
 */
export async function fetchAreaBasedList(
  params: GetAreaBasedListParams,
): Promise<{ items: TourItem[]; totalCount: number }> {
  try {
    return await getAreaBasedList(params);
  } catch (error) {
    console.error('[fetchAreaBasedList] API 호출 실패:', error);
    throw error;
  }
}

/**
 * 키워드 검색 (페이지네이션)
 *
 * @param params 검색 파라미터
 * @returns 검색 결과 목록 및 총 개수
 */
export async function fetchSearchKeyword(
  params: SearchKeywordParams,
): Promise<{ items: TourItem[]; totalCount: number }> {
  try {
    return await searchKeyword(params);
  } catch (error) {
    console.error('[fetchSearchKeyword] API 호출 실패:', error);
    throw error;
  }
}


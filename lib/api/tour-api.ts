/**
 * @file tour-api.ts
 * @description 한국관광공사 공공 API 클라이언트
 *
 * 이 모듈은 한국관광공사 공공 API를 호출하는 함수들을 제공합니다.
 *
 * 주요 기능:
 * 1. 지역코드 조회 (getAreaCode)
 * 2. 지역 기반 관광지 목록 조회 (getAreaBasedList)
 * 3. 키워드 검색 (searchKeyword)
 * 4. 관광지 상세 정보 조회 (getDetailCommon, getDetailIntro, getDetailImage, getDetailPetTour)
 *
 * 핵심 구현 로직:
 * - 공통 파라미터 자동 처리 (serviceKey, MobileOS, MobileApp, _type)
 * - 에러 처리 및 재시도 로직 (exponential backoff)
 * - 타입 안전한 API 호출 (제네릭 타입)
 * - Next.js 15 fetch API 활용 (자동 캐싱)
 *
 * @dependencies
 * - lib/types/tour.ts: 타입 정의
 *
 * @see {@link https://www.data.go.kr/data/15101578/openapi.do} - 한국관광공사 API 문서
 */

import type {
  TourItem,
  TourDetail,
  TourIntro,
  TourImage,
  PetTourInfo,
  AreaCode,
  TourApiResponse,
  TourApiErrorResponse,
} from '@/lib/types/tour';

/**
 * Base URL for 한국관광공사 API
 */
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';

/**
 * 에러 타입 정의
 */
export class TourApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public resultCode?: string,
    public resultMsg?: string,
  ) {
    super(message);
    this.name = 'TourApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ParseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'ParseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 환경변수에서 API 키 가져오기
 * 우선순위: TOUR_API_KEY (서버 전용) > NEXT_PUBLIC_TOUR_API_KEY (클라이언트/서버 공용)
 */
function getApiKey(): string {
  const serverKey = process.env.TOUR_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;

  const apiKey = serverKey || publicKey;

  if (!apiKey) {
    const errorMessage =
      '한국관광공사 API 키가 설정되지 않았습니다. TOUR_API_KEY 또는 NEXT_PUBLIC_TOUR_API_KEY 환경변수를 설정해주세요.';
    if (process.env.NODE_ENV === 'development') {
      console.error('[Tour API]', errorMessage);
    }
    throw new ValidationError(errorMessage);
  }

  return apiKey;
}

/**
 * 공통 파라미터 생성
 */
function getCommonParams(): Record<string, string> {
  return {
    serviceKey: getApiKey(),
    MobileOS: 'ETC',
    MobileApp: 'MyTrip',
    _type: 'json',
  };
}

/**
 * API 응답에서 실제 데이터 추출
 * 한국관광공사 API는 응답 구조가 일관되지 않을 수 있음
 */
function extractItems<T>(response: TourApiResponse<T>): T[] {
  const items = response.response.body.items?.item;
  if (!items) {
    return [];
  }
  // 단일 항목인 경우 배열로 변환
  return Array.isArray(items) ? items : [items];
}

/**
 * API 응답에서 totalCount 추출
 */
function extractTotalCount(response: TourApiResponse<unknown>): number {
  return response.response.body.totalCount ?? 0;
}

/**
 * 지연 함수 (재시도 로직용)
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 범용 API 호출 함수
 * @param endpoint API 엔드포인트
 * @param params 쿼리 파라미터
 * @param options fetch 옵션
 * @returns API 응답 데이터
 */
async function fetchTourApi<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  options: {
    retries?: number;
    retryDelay?: number;
    cache?: RequestCache;
  } = {},
): Promise<T> {
  const { retries = 3, retryDelay = 1000, cache = 'force-cache' } = options;

  // 공통 파라미터와 사용자 파라미터 병합
  const commonParams = getCommonParams();
  const queryParams = new URLSearchParams();

  // 모든 파라미터를 문자열로 변환하여 추가
  Object.entries({ ...commonParams, ...params }).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        cache,
        next: {
          revalidate: 3600, // 1시간마다 재검증
        },
      });

      if (!response.ok) {
        // 4xx 에러는 재시도하지 않음
        if (response.status >= 400 && response.status < 500) {
          const errorData = (await response.json().catch(() => ({}))) as TourApiErrorResponse;
          throw new TourApiError(
            `API 요청 실패: ${response.status} ${response.statusText}`,
            response.status,
            errorData.response?.header?.resultCode,
            errorData.response?.header?.resultMsg,
          );
        }

        // 5xx 에러는 재시도
        if (attempt < retries) {
          const delayMs = retryDelay * Math.pow(2, attempt); // exponential backoff
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[Tour API] 서버 에러 발생 (${response.status}), ${delayMs}ms 후 재시도... (${attempt + 1}/${retries})`,
            );
          }
          await delay(delayMs);
          continue;
        }

        const errorData = (await response.json().catch(() => ({}))) as TourApiErrorResponse;
        throw new TourApiError(
          `API 요청 실패: ${response.status} ${response.statusText}`,
          response.status,
          errorData.response?.header?.resultCode,
          errorData.response?.header?.resultMsg,
        );
      }

      const data = (await response.json()) as TourApiResponse<T> | {
        responseTime?: string;
        resultCode?: string;
        resultMsg?: string;
      };

      // 에러 응답 형식 처리 (responseTime이 있는 경우)
      if ('resultCode' in data && 'resultMsg' in data && !('response' in data)) {
        throw new TourApiError(
          `API 오류: ${data.resultMsg || '알 수 없는 오류'}`,
          response.status,
          data.resultCode,
          data.resultMsg,
        );
      }

      const typedData = data as TourApiResponse<T>;

      // API 응답 헤더 확인
      if (!typedData.response?.header || typedData.response.header.resultCode !== '0000') {
        const resultCode = typedData.response?.header?.resultCode;
        const resultMsg = typedData.response?.header?.resultMsg || '알 수 없는 오류';

        // 응답 형식이 잘못된 경우
        if (!typedData.response?.header) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Tour API] 응답 형식 오류:', {
              data,
              url,
            });
          }
          throw new ParseError('API 응답 형식이 올바르지 않습니다: response.header가 없습니다.');
        }

        throw new TourApiError(
          `API 오류: ${resultMsg}`,
          undefined,
          resultCode,
          resultMsg,
        );
      }

      return typedData as unknown as T;
    } catch (error) {
      lastError = error as Error;

      // ValidationError, TourApiError, ParseError는 재시도하지 않음
      if (
        error instanceof ValidationError ||
        error instanceof TourApiError ||
        error instanceof ParseError
      ) {
        throw error;
      }

      // 네트워크 에러는 재시도
      if (attempt < retries) {
        const delayMs = retryDelay * Math.pow(2, attempt); // exponential backoff
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[Tour API] 네트워크 오류 발생, ${delayMs}ms 후 재시도... (${attempt + 1}/${retries})`,
            error,
          );
        }
        await delay(delayMs);
        continue;
      }

      // 모든 재시도 실패
      if (error instanceof SyntaxError) {
        throw new ParseError('API 응답 파싱 실패', error);
      }

      throw new NetworkError('네트워크 요청 실패', error);
    }
  }

  // 이 코드는 실행되지 않아야 하지만 TypeScript를 위해 필요
  throw lastError || new NetworkError('알 수 없는 오류');
}

/**
 * 지역코드 조회 파라미터
 */
export interface GetAreaCodeParams {
  /** 페이지당 항목 수 */
  numOfRows?: number;
  /** 페이지 번호 */
  pageNo?: number;
  /** 시/도 코드 (지역코드 조회 시) */
  areaCode?: string;
}

/**
 * 지역코드 조회
 * @param params 조회 파라미터
 * @returns 지역코드 목록
 */
export async function getAreaCode(params: GetAreaCodeParams = {}): Promise<AreaCode[]> {
  const response = await fetchTourApi<AreaCode>('/areaCode2', params as Record<string, string | number | undefined>);
  return extractItems(response as unknown as TourApiResponse<AreaCode>);
}

/**
 * 지역 기반 목록 조회 파라미터
 */
export interface GetAreaBasedListParams {
  /** 지역코드 */
  areaCode?: string;
  /** 시군구코드 */
  sigunguCode?: string;
  /** 콘텐츠 타입 ID */
  contentTypeId?: string;
  /** 대분류 */
  cat1?: string;
  /** 중분류 */
  cat2?: string;
  /** 소분류 */
  cat3?: string;
  /** 수정일 (YYYYMMDD) */
  modifiedtime?: string;
  /** 페이지당 항목 수 (기본값: 10) */
  numOfRows?: number;
  /** 페이지 번호 (기본값: 1) */
  pageNo?: number;
}

/**
 * 지역 기반 관광지 목록 조회
 * @param params 조회 파라미터
 * @returns 관광지 목록 및 총 개수
 */
export async function getAreaBasedList(
  params: GetAreaBasedListParams = {},
): Promise<{ items: TourItem[]; totalCount: number }> {
  const { numOfRows = 10, pageNo = 1, ...restParams } = params;
  const response = await fetchTourApi<TourItem>('/areaBasedList2', {
    numOfRows,
    pageNo,
    ...restParams,
  });
  const items = extractItems(response as unknown as TourApiResponse<TourItem>);
  const totalCount = extractTotalCount(response as unknown as TourApiResponse<TourItem>);

  // 개발 환경에서 좌표 값 형식 확인 (디버깅)
  if (process.env.NODE_ENV === 'development' && items.length > 0) {
    const sampleItems = items.slice(0, 5); // 처음 5개만 샘플로
    console.group('[Tour API] 좌표 값 형식 확인 (샘플)');
    sampleItems.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.title}:`, {
        mapx: item.mapx,
        mapy: item.mapy,
        mapxType: typeof item.mapx,
        mapyType: typeof item.mapy,
        mapxLength: item.mapx?.length,
        mapyLength: item.mapy?.length,
        mapxNum: Number(item.mapx),
        mapyNum: Number(item.mapy),
      });
    });
    console.groupEnd();
  }

  return { items, totalCount };
}

/**
 * 키워드 검색 파라미터
 */
export interface SearchKeywordParams {
  /** 검색 키워드 (필수) */
  keyword: string;
  /** 지역코드 */
  areaCode?: string;
  /** 콘텐츠 타입 ID */
  contentTypeId?: string;
  /** 페이지당 항목 수 */
  numOfRows?: number;
  /** 페이지 번호 */
  pageNo?: number;
  /** 목록 구분 (Y: 목록, N: 개수) */
  listYN?: 'Y' | 'N';
  /** 정렬 (A: 제목순, B: 수정일순, C: 거리순, D: 조회수순) */
  arrange?: 'A' | 'B' | 'C' | 'D';
}

/**
 * 키워드 검색
 * @param params 검색 파라미터
 * @returns 검색 결과 목록 및 총 개수
 */
export async function searchKeyword(
  params: SearchKeywordParams,
): Promise<{ items: TourItem[]; totalCount: number }> {
  if (!params.keyword || params.keyword.trim() === '') {
    throw new ValidationError('검색 키워드는 필수입니다.');
  }

  const { numOfRows = 10, pageNo = 1, ...restParams } = params;
  const response = await fetchTourApi<TourItem>('/searchKeyword2', {
    numOfRows,
    pageNo,
    ...restParams,
  });
  const items = extractItems(response as unknown as TourApiResponse<TourItem>);
  const totalCount = extractTotalCount(response as unknown as TourApiResponse<TourItem>);

  // 개발 환경에서 좌표 값 형식 확인 (디버깅)
  if (process.env.NODE_ENV === 'development' && items.length > 0) {
    const sampleItems = items.slice(0, 5); // 처음 5개만 샘플로
    console.group('[Tour API] 좌표 값 형식 확인 (검색 결과 샘플)');
    sampleItems.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.title}:`, {
        mapx: item.mapx,
        mapy: item.mapy,
        mapxType: typeof item.mapx,
        mapyType: typeof item.mapy,
        mapxLength: item.mapx?.length,
        mapyLength: item.mapy?.length,
        mapxNum: Number(item.mapx),
        mapyNum: Number(item.mapy),
      });
    });
    console.groupEnd();
  }

  return { items, totalCount };
}

/**
 * 상세 정보 조회 파라미터
 *
 * 참고: detailCommon2 API는 Y/N 플래그 파라미터를 지원하지 않음
 * 기본 호출로 모든 정보가 포함됨
 */
export interface GetDetailCommonParams {
  /** 콘텐츠 ID (필수) */
  contentId: string;
  /** 콘텐츠 타입 ID */
  contentTypeId?: string;
}

/**
 * 관광지 상세 정보 조회 (공통 정보)
 * @param params 조회 파라미터
 * @returns 관광지 상세 정보
 */
export async function getDetailCommon(params: GetDetailCommonParams): Promise<TourDetail> {
  if (!params.contentId || params.contentId.trim() === '') {
    throw new ValidationError('콘텐츠 ID는 필수입니다.');
  }

  const response = await fetchTourApi<TourDetail>('/detailCommon2', {
    contentId: params.contentId,
    contentTypeId: params.contentTypeId,
  });

  const items = extractItems(response as unknown as TourApiResponse<TourDetail>);
  if (items.length === 0) {
    throw new TourApiError('관광지 정보를 찾을 수 없습니다.', undefined, 'NOT_FOUND');
  }

  return items[0];
}

/**
 * 소개 정보 조회 파라미터
 */
export interface GetDetailIntroParams {
  /** 콘텐츠 ID (필수) */
  contentId: string;
  /** 콘텐츠 타입 ID (필수) */
  contentTypeId: string;
}

/**
 * 관광지 소개 정보 조회 (운영 정보)
 * @param params 조회 파라미터
 * @returns 관광지 운영 정보
 */
export async function getDetailIntro(params: GetDetailIntroParams): Promise<TourIntro> {
  if (!params.contentId || params.contentId.trim() === '') {
    throw new ValidationError('콘텐츠 ID는 필수입니다.');
  }
  if (!params.contentTypeId || params.contentTypeId.trim() === '') {
    throw new ValidationError('콘텐츠 타입 ID는 필수입니다.');
  }

  const response = await fetchTourApi<TourIntro>('/detailIntro2', {
    contentId: params.contentId,
    contentTypeId: params.contentTypeId,
  });

  const items = extractItems(response as unknown as TourApiResponse<TourIntro>);
  if (items.length === 0) {
    throw new TourApiError('관광지 운영 정보를 찾을 수 없습니다.', undefined, 'NOT_FOUND');
  }

  return items[0];
}

/**
 * 이미지 목록 조회 파라미터
 */
export interface GetDetailImageParams {
  /** 콘텐츠 ID (필수) */
  contentId: string;
  /** 이미지 포함 여부 */
  imageYN?: 'Y' | 'N';
  /** 서브 이미지 포함 여부 */
  subImageYN?: 'Y' | 'N';
  /** 페이지당 항목 수 */
  numOfRows?: number;
  /** 페이지 번호 */
  pageNo?: number;
}

/**
 * 관광지 이미지 목록 조회
 * @param params 조회 파라미터
 * @returns 이미지 목록
 */
export async function getDetailImage(params: GetDetailImageParams): Promise<TourImage[]> {
  if (!params.contentId || params.contentId.trim() === '') {
    throw new ValidationError('콘텐츠 ID는 필수입니다.');
  }

  const { numOfRows = 10, pageNo = 1, ...restParams } = params;
  const response = await fetchTourApi<TourImage>('/detailImage2', {
    numOfRows,
    pageNo,
    ...restParams,
  });

  return extractItems(response as unknown as TourApiResponse<TourImage>);
}

/**
 * 반려동물 정보 조회 파라미터
 */
export interface GetDetailPetTourParams {
  /** 콘텐츠 ID (필수) */
  contentId: string;
}

/**
 * 반려동물 동반 정보 조회
 * @param params 조회 파라미터
 * @returns 반려동물 정보 (데이터가 없을 수 있음)
 */
export async function getDetailPetTour(
  params: GetDetailPetTourParams,
): Promise<PetTourInfo | null> {
  if (!params.contentId || params.contentId.trim() === '') {
    throw new ValidationError('콘텐츠 ID는 필수입니다.');
  }

  try {
    const response = await fetchTourApi<PetTourInfo>('/detailPetTour2', {
      contentId: params.contentId,
    });

    const items = extractItems(response as unknown as TourApiResponse<PetTourInfo>);
    if (items.length === 0) {
      return null;
    }

    return items[0];
  } catch (error) {
    // 반려동물 정보는 선택 사항이므로 에러가 발생해도 null 반환
    if (error instanceof TourApiError && error.resultCode === 'NOT_FOUND') {
      return null;
    }
    // 다른 에러는 그대로 전파
    throw error;
  }
}


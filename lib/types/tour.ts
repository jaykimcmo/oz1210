/**
 * @file tour.ts
 * @description 한국관광공사 API 응답 타입 정의
 *
 * 이 파일은 한국관광공사 공공 API의 응답 구조에 맞춘 TypeScript 타입 정의를 포함합니다.
 *
 * 주요 타입:
 * - TourItem: 관광지 목록 항목
 * - TourDetail: 관광지 상세 정보
 * - TourIntro: 관광지 운영 정보
 * - TourImage: 관광지 이미지 정보
 * - PetTourInfo: 반려동물 동반 정보
 * - AreaCode: 지역코드 정보
 *
 * @dependencies
 * - 한국관광공사 API 응답 구조 기반
 *
 * @see {@link https://www.data.go.kr/data/15101578/openapi.do} - 한국관광공사 API 문서
 */

/**
 * 관광 타입 ID 상수
 */
export const CONTENT_TYPE_ID = {
  TOURIST_SPOT: '12', // 관광지
  CULTURAL_FACILITY: '14', // 문화시설
  FESTIVAL: '15', // 축제/행사
  TOUR_COURSE: '25', // 여행코스
  LEISURE_SPORTS: '28', // 레포츠
  ACCOMMODATION: '32', // 숙박
  SHOPPING: '38', // 쇼핑
  RESTAURANT: '39', // 음식점
} as const;

export type ContentTypeId = (typeof CONTENT_TYPE_ID)[keyof typeof CONTENT_TYPE_ID];

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 */
export interface TourItem {
  /** 콘텐츠 ID */
  contentid: string;
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  /** 관광지명 */
  title: string;
  /** 주소 */
  addr1: string;
  /** 상세주소 */
  addr2?: string;
  /** 지역코드 */
  areacode: string;
  /** 시군구코드 */
  sigungucode?: string;
  /** 경도 (KATEC 좌표계, 정수형) */
  mapx: string;
  /** 위도 (KATEC 좌표계, 정수형) */
  mapy: string;
  /** 대표이미지1 */
  firstimage?: string;
  /** 대표이미지2 */
  firstimage2?: string;
  /** 전화번호 */
  tel?: string;
  /** 대분류 */
  cat1?: string;
  /** 중분류 */
  cat2?: string;
  /** 소분류 */
  cat3?: string;
  /** 수정일 */
  modifiedtime: string;
  /** 거리 (검색 시) */
  dist?: string;
  /** 개요 (간단한 설명) */
  overview?: string;
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 */
export interface TourDetail {
  /** 콘텐츠 ID */
  contentid: string;
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  /** 관광지명 */
  title: string;
  /** 주소 */
  addr1: string;
  /** 상세주소 */
  addr2?: string;
  /** 우편번호 */
  zipcode?: string;
  /** 전화번호 */
  tel?: string;
  /** 홈페이지 */
  homepage?: string;
  /** 개요 (긴 설명) */
  overview?: string;
  /** 대표이미지1 */
  firstimage?: string;
  /** 대표이미지2 */
  firstimage2?: string;
  /** 경도 (KATEC 좌표계, 정수형) */
  mapx: string;
  /** 위도 (KATEC 좌표계, 정수형) */
  mapy: string;
  /** 지역코드 */
  areacode?: string;
  /** 시군구코드 */
  sigungucode?: string;
  /** 대분류 */
  cat1?: string;
  /** 중분류 */
  cat2?: string;
  /** 소분류 */
  cat3?: string;
  /** 수정일 */
  modifiedtime?: string;
  /** 생성일 */
  createdtime?: string;
}

/**
 * 관광지 운영 정보 (detailIntro2 응답)
 * 타입별로 필드가 다르므로 모든 필드를 선택적으로 정의
 */
export interface TourIntro {
  /** 콘텐츠 ID */
  contentid: string;
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  /** 이용시간 */
  usetime?: string;
  /** 휴무일 */
  restdate?: string;
  /** 문의처 */
  infocenter?: string;
  /** 주차 가능 여부 */
  parking?: string;
  /** 반려동물 동반 가능 여부 */
  chkpet?: string;
  /** 이용요금 */
  usefee?: string;
  /** 수용인원 */
  accomcount?: string;
  /** 체험 프로그램 */
  expguide?: string;
  /** 유모차 대여 여부 */
  chkbabycarriage?: string;
  /** 장애인 편의시설 */
  chkcreditcard?: string;
  /** 기타 정보 */
  heritage1?: string;
  heritage2?: string;
  heritage3?: string;
  /** 문화시설 정보 */
  useseason?: string;
  usetimeculture?: string;
  /** 축제 정보 */
  agelimit?: string;
  bookingplace?: string;
  discountinfofestival?: string;
  eventenddate?: string;
  eventplace?: string;
  eventstartdate?: string;
  festivalgrade?: string;
  placeinfo?: string;
  playtime?: string;
  program?: string;
  spendtimefestival?: string;
  sponsor1?: string;
  sponsor1tel?: string;
  sponsor2?: string;
  sponsor2tel?: string;
  subevent?: string;
  usetimefestival?: string;
  /** 레포츠 정보 */
  expagerange?: string;
  openperiod?: string;
  reservation?: string;
  /** 숙박 정보 */
  benikia?: string;
  checkintime?: string;
  checkouttime?: string;
  chkcooking?: string;
  foodplace?: string;
  goodstay?: string;
  hanok?: string;
  roomcount?: string;
  roomtype?: string;
  subfacility?: string;
  /** 쇼핑 정보 */
  opendateshopping?: string;
  restdateshopping?: string;
  shopguide?: string;
  /** 음식점 정보 */
  firstmenu?: string;
  infocenterfood?: string;
  kidsfacility?: string;
  opentimefood?: string;
  packing?: string;
  parkingfood?: string;
  reservationfood?: string;
  restdatefood?: string;
  scalefood?: string;
  seat?: string;
  smoking?: string;
  treatmenu?: string;
}

/**
 * 관광지 이미지 정보 (detailImage2 응답)
 */
export interface TourImage {
  /** 콘텐츠 ID */
  contentid: string;
  /** 원본 이미지 URL */
  originimgurl: string;
  /** 작은 이미지 URL */
  smallimageurl: string;
  /** 이미지명 */
  imgname?: string;
  /** 이미지 번호 */
  serialnum?: string;
}

/**
 * 반려동물 동반 정보 (detailPetTour2 응답)
 */
export interface PetTourInfo {
  /** 콘텐츠 ID */
  contentid: string;
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  /** 애완동물 동반 여부 */
  chkpetleash?: string;
  /** 애완동물 크기 */
  chkpetsize?: string;
  /** 입장 가능 장소 */
  chkpetplace?: string;
  /** 추가 요금 */
  chkpetfee?: string;
  /** 기타 반려동물 정보 */
  petinfo?: string;
  /** 주차장 정보 */
  parking?: string;
}

/**
 * 지역코드 정보 (areaCode2 응답)
 */
export interface AreaCode {
  /** 지역코드 */
  code: string;
  /** 지역명 */
  name: string;
  /** 순번 */
  rnum?: string;
}

/**
 * API 응답 래퍼 타입
 * 한국관광공사 API는 응답 구조가 일관되지 않을 수 있음
 */
export interface TourApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item?: T | T[];
      };
      numOfRows?: number;
      pageNo?: number;
      totalCount?: number;
    };
  };
}

/**
 * 에러 응답 타입
 */
export interface TourApiErrorResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body?: {
      items?: unknown;
    };
  };
}


/**
 * @file coordinates.ts
 * @description 좌표 변환 유틸리티
 *
 * 이 파일은 한국관광공사 API의 KATEC 좌표계를 WGS84 좌표계로 변환하는 함수를 제공합니다.
 *
 * 한국관광공사 API는 KATEC 좌표계를 사용하며, 정수형으로 저장됩니다.
 * 네이버 지도는 WGS84 좌표계를 사용하므로 변환이 필요합니다.
 *
 * 변환 공식:
 * - 경도 (longitude) = mapx / 10000000
 * - 위도 (latitude) = mapy / 10000000
 *
 * @dependencies
 * - 한국관광공사 API 좌표 형식
 * - Naver Maps API 좌표 형식
 */

/**
 * KATEC 좌표계를 WGS84 좌표계로 변환
 * 다양한 좌표 형식을 자동 감지하여 올바르게 변환합니다.
 *
 * @param mapx - 경도 (KATEC 좌표계 또는 WGS84 좌표계, 문자열)
 * @param mapy - 위도 (KATEC 좌표계 또는 WGS84 좌표계, 문자열)
 * @returns [경도, 위도] 튜플 (WGS84 좌표계)
 * @throws {Error} 좌표가 유효하지 않은 경우
 */
export function convertKATECToWGS84(
  mapx: string,
  mapy: string,
): [number, number] {
  const mapxNum = Number(mapx);
  const mapyNum = Number(mapy);

  // 좌표 유효성 검증
  if (isNaN(mapxNum) || isNaN(mapyNum)) {
    throw new Error(`유효하지 않은 좌표: mapx=${mapx}, mapy=${mapy}`);
  }

  // 좌표 형식 자동 감지
  // 1. 이미 WGS84 범위인 경우 (경도 124~132, 위도 33~43)
  if (mapxNum >= 124 && mapxNum <= 132 && mapyNum >= 33 && mapyNum <= 43) {
    // 이미 올바른 WGS84 좌표인 경우 그대로 반환
    return [mapxNum, mapyNum];
  }

  // 2. KATEC 좌표계인 경우 (일반적으로 10자리 이상의 정수)
  // 예: 1251263860 → 125.1263860
  if (mapxNum > 1000000) {
    const lng = mapxNum / 10000000;
    const lat = mapyNum / 10000000;

    // 변환 후 범위 검증
    if (lng >= 124 && lng <= 132 && lat >= 33 && lat <= 43) {
      return [lng, lat];
    }
  }

  // 3. 다른 변환 공식 시도 (예: 100000으로 나누기)
  // 일부 API에서는 다른 변환 공식을 사용할 수 있음
  if (mapxNum > 10000 && mapxNum <= 1000000) {
    const lng = mapxNum / 100000;
    const lat = mapyNum / 100000;

    if (lng >= 124 && lng <= 132 && lat >= 33 && lat <= 43) {
      return [lng, lat];
    }
  }

  // 변환 실패 시 원본 값 반환 (경고와 함께)
  // 개발 환경에서만 상세한 경고 출력
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `좌표 변환 실패: mapx=${mapx}, mapy=${mapy} (원본 값 반환)`,
      `변환 시도 결과: lng=${mapxNum / 10000000}, lat=${mapyNum / 10000000}`,
    );
  } else {
    // 프로덕션에서는 간단한 경고만
    console.warn(
      `좌표가 대한민국 범위를 벗어남: lng=${mapxNum}, lat=${mapyNum}`,
    );
  }

  return [mapxNum, mapyNum];
}

/**
 * 좌표가 유효한지 확인
 *
 * @param lng - 경도
 * @param lat - 위도
 * @returns 유효 여부
 */
export function isValidCoordinate(lng: number, lat: number): boolean {
  return (
    !isNaN(lng) &&
    !isNaN(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}


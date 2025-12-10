/**
 * @file naver-map.tsx
 * @description 네이버 지도 컴포넌트
 *
 * 이 컴포넌트는 네이버 지도를 표시하고 관광지 목록을 마커로 표시합니다.
 *
 * 주요 기능:
 * 1. Naver Maps API v3 (NCP) 초기화
 * 2. 관광지 마커 표시
 * 3. 마커 클릭 시 인포윈도우 표시
 * 4. 지도-리스트 연동 (선택된 관광지 강조)
 * 5. 지도 컨트롤 (줌, 지도 유형)
 *
 * @dependencies
 * - next/script: 스크립트 로드
 * - lib/utils/coordinates.ts: 좌표 변환 함수
 * - lib/types/tour.ts: TourItem 타입
 * - types/navermaps.d.ts: Naver Maps 타입 정의
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import type { TourItem } from '@/lib/types/tour';
import { convertKATECToWGS84 } from '@/lib/utils/coordinates';
import { cn } from '@/lib/utils';

interface NaverMapProps {
  tours: TourItem[];
  selectedTourId?: string;
  onMarkerClick?: (tour: TourItem) => void;
  onMapClick?: () => void;
  className?: string;
  resetMarkers?: boolean; // 필터 변경 시 마커 리셋 플래그
}

/**
 * 네이버 지도 컴포넌트
 *
 * @param tours - 관광지 목록
 * @param selectedTourId - 선택된 관광지 ID
 * @param onMarkerClick - 마커 클릭 콜백
 * @param onMapClick - 지도 클릭 콜백
 * @param className - 추가 CSS 클래스
 */
export function NaverMap({
  tours,
  selectedTourId,
  onMarkerClick,
  onMapClick,
  className,
  resetMarkers = false,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const processedTourIdsRef = useRef<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Naver Maps API 키
  const ncpKeyId =
    process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ||
    process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID;

  // 필터 변경 시 마커 리셋
  useEffect(() => {
    if (resetMarkers) {
      // 기존 마커 제거 (ref 값을 변수에 복사하여 사용)
      const currentMarkers = markersRef.current;
      const currentProcessedIds = processedTourIdsRef.current;
      currentMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
      currentProcessedIds.clear();
    }
  }, [resetMarkers]);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !ncpKeyId) {
      if (!ncpKeyId) {
        setError('네이버 지도 API 키가 설정되지 않았습니다.');
      }
      return;
    }

    try {
      // 지도 초기화
      const mapOptions: naver.maps.MapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.9780), // 대한민국 중심
        zoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: 'TOP_RIGHT' as naver.maps.Position,
        },
        mapTypeControl: true,
      };

      const map = new naver.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // 지도 클릭 이벤트
      if (onMapClick) {
        naver.maps.Event.addListener(map, 'click', () => {
          onMapClick();
        });
      }

      // 관광지 목록이 있으면 모든 마커를 포함하는 범위로 조정
      if (tours.length > 0) {
        const bounds = new naver.maps.LatLngBounds();
        let hasValidBounds = false;

        tours.forEach((tour) => {
          try {
            const [lng, lat] = convertKATECToWGS84(tour.mapx, tour.mapy);

            // 변환된 좌표가 대한민국 범위 내인 경우에만 bounds에 추가
            if (lng >= 124 && lng <= 132 && lat >= 33 && lat <= 43) {
              bounds.extend(new naver.maps.LatLng(lat, lng));
              hasValidBounds = true;
            }
          } catch (err) {
            // 개발 환경에서만 상세한 에러 로그 출력
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[NaverMap] 좌표 변환 실패: ${tour.title}`, err);
            }
          }
        });

        // bounds가 유효한 좌표를 포함하는 경우에만 fitBounds 호출
        if (hasValidBounds) {
          try {
            map.fitBounds(bounds);
          } catch (err) {
            console.warn('[NaverMap] fitBounds 실패:', err);
            // fitBounds 실패 시 첫 번째 관광지로 이동
            const firstTour = tours.find((tour) => {
              try {
                convertKATECToWGS84(tour.mapx, tour.mapy);
                return true;
              } catch {
                return false;
              }
            });
            if (firstTour) {
              const [lng, lat] = convertKATECToWGS84(
                firstTour.mapx,
                firstTour.mapy,
              );
              map.setCenter(new naver.maps.LatLng(lat, lng));
              map.setZoom(13);
            }
          }
        }
      }

      // 마커 생성 또는 업데이트
      const infoWindow = new naver.maps.InfoWindow();
      let validMarkerCount = 0;
      let invalidMarkerCount = 0;
      const newMarkers: naver.maps.Marker[] = [];

      // 새로 추가된 관광지만 마커로 생성 (무한 스크롤 지원)
      tours.forEach((tour) => {
        // 이미 처리된 관광지는 건너뛰기
        if (processedTourIdsRef.current.has(tour.contentid)) {
          // 기존 마커 찾기
          const existingMarker = markersRef.current.find((m) => {
            const markerPos = m.getPosition();
            try {
              const [lng, lat] = convertKATECToWGS84(tour.mapx, tour.mapy);
              return (
                Math.abs(markerPos.lat() - lat) < 0.0001 &&
                Math.abs(markerPos.lng() - lng) < 0.0001
              );
            } catch {
              return false;
            }
          });

          if (existingMarker) {
            // 선택된 관광지인 경우 zIndex 업데이트
            if (selectedTourId === tour.contentid) {
              existingMarker.setZIndex(1000);
            } else {
              existingMarker.setZIndex(0);
            }
            newMarkers.push(existingMarker);
          }
          return;
        }

        // 새 관광지 처리
        processedTourIdsRef.current.add(tour.contentid);

        try {
          const [lng, lat] = convertKATECToWGS84(tour.mapx, tour.mapy);

          // 변환된 좌표가 대한민국 범위를 벗어나는 경우 마커 생성 건너뛰기
          if (lng < 124 || lng > 132 || lat < 33 || lat > 43) {
            invalidMarkerCount++;
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[NaverMap] 좌표 범위 초과로 마커 생성 건너뛰기: ${tour.title} (lng=${lng}, lat=${lat})`,
              );
            }
            return; // 마커 생성하지 않고 다음 항목으로
          }

          const position = new naver.maps.LatLng(lat, lng);

          // 마커 생성
          const marker = new naver.maps.Marker({
            position,
            map,
            title: tour.title,
            zIndex: selectedTourId === tour.contentid ? 1000 : 0,
          });

          // 인포윈도우 내용 생성
          const infoContent = `
            <div style="padding: 12px; min-width: 200px; max-width: 300px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                ${tour.title}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
                ${tour.addr1 || '주소 정보 없음'}
              </p>
              <a 
                href="/places/${tour.contentid}" 
                style="display: inline-block; padding: 6px 12px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;"
                onclick="event.stopPropagation();"
              >
                상세보기
              </a>
            </div>
          `;

          // 마커 클릭 이벤트
          naver.maps.Event.addListener(marker, 'click', () => {
            infoWindow.setContent(infoContent);
            infoWindow.open(map, marker);

            if (onMarkerClick) {
              onMarkerClick(tour);
            }
          });

          newMarkers.push(marker);
          validMarkerCount++;
        } catch (err) {
          invalidMarkerCount++;
          // 개발 환경에서만 상세한 에러 로그 출력
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[NaverMap] 마커 생성 실패: ${tour.title}`, err);
          }
        }
      });

      // 기존 마커 중 tours에 없는 마커 제거
      markersRef.current.forEach((marker) => {
        const markerPos = marker.getPosition();
        const exists = tours.some((tour) => {
          try {
            const [lng, lat] = convertKATECToWGS84(tour.mapx, tour.mapy);
            return (
              Math.abs(markerPos.lat() - lat) < 0.0001 &&
              Math.abs(markerPos.lng() - lng) < 0.0001
            );
          } catch {
            return false;
          }
        });

        if (!exists) {
          marker.setMap(null);
        }
      });

      markersRef.current = newMarkers;
      infoWindowRef.current = infoWindow;

      // 개발 환경에서만 마커 생성 통계 출력
      if (process.env.NODE_ENV === 'development' && tours.length > 0) {
        console.log(
          `[NaverMap] 마커 업데이트 완료: 총 ${newMarkers.length}개 (새로 추가: ${validMarkerCount}, 실패: ${invalidMarkerCount})`,
        );
      }

      // 정리 함수
      return () => {
        // 마커 제거 (ref 값을 변수에 복사하여 사용)
        const currentMarkers = markersRef.current;
        const currentProcessedIds = processedTourIdsRef.current;
        currentMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        markersRef.current = [];
        currentProcessedIds.clear();
        // 인포윈도우 닫기
        infoWindow.close();
        // 지도 제거
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.error('[NaverMap] 지도 초기화 실패:', err);
      setError('지도를 불러오는 중 오류가 발생했습니다.');
    }
  }, [isLoaded, tours, selectedTourId, onMarkerClick, onMapClick, ncpKeyId]);

  // 선택된 관광지로 지도 이동
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedTourId) return;

    const selectedTour = tours.find((t) => t.contentid === selectedTourId);
    if (!selectedTour) return;

    try {
      const [lng, lat] = convertKATECToWGS84(selectedTour.mapx, selectedTour.mapy);
      const position = new naver.maps.LatLng(lat, lng);

      // 지도 이동
      mapInstanceRef.current.panTo(position, { duration: 300 });

      // 해당 마커의 인포윈도우 표시
      const marker = markersRef.current.find((m) => {
        const markerPos = m.getPosition();
        return (
          Math.abs(markerPos.lat() - lat) < 0.0001 &&
          Math.abs(markerPos.lng() - lng) < 0.0001
        );
      });

      if (marker && infoWindowRef.current) {
        // 선택된 마커의 zIndex 업데이트
        markersRef.current.forEach((m) => {
          if (m === marker) {
            m.setZIndex(1000);
          } else {
            m.setZIndex(0);
          }
        });

        const infoContent = `
          <div style="padding: 12px; min-width: 200px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
              ${selectedTour.title}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
              ${selectedTour.addr1 || '주소 정보 없음'}
            </p>
            <a 
              href="/places/${selectedTour.contentid}" 
              style="display: inline-block; padding: 6px 12px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;"
              onclick="event.stopPropagation();"
            >
              상세보기
            </a>
          </div>
        `;
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    } catch (err) {
      console.warn(`선택된 관광지로 이동 실패: ${selectedTour.title}`, err);
    }
  }, [selectedTourId, tours]);

  // 지도 리사이즈 처리
  useEffect(() => {
    if (!mapInstanceRef.current || !mapRef.current) return;

    const handleResize = () => {
      if (mapInstanceRef.current && mapRef.current) {
        try {
          // Naver Maps API v3의 setSize 메서드를 사용하여 지도 크기 조정
          const newWidth = mapRef.current.clientWidth;
          const newHeight = mapRef.current.clientHeight;

          if (newWidth > 0 && newHeight > 0) {
            mapInstanceRef.current.setSize(
              new naver.maps.Size(newWidth, newHeight),
            );
          }
        } catch (err) {
          // setSize가 지원되지 않는 경우 window resize 이벤트를 트리거
          console.warn('[NaverMap] setSize 실패, window resize 이벤트 트리거:', err);
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }
    };

    // ResizeObserver로 컨테이너 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      // 약간의 지연을 두어 DOM 업데이트 완료 후 처리
      setTimeout(handleResize, 100);
    });

    resizeObserver.observe(mapRef.current);

    // window resize 이벤트 리스너
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [isLoaded]);

  if (!ncpKeyId) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] rounded-lg border bg-muted/20',
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">
          네이버 지도 API 키가 설정되지 않았습니다.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] rounded-lg border bg-muted/20',
          className,
        )}
      >
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpKeyId}`}
        strategy="lazyOnload"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError('지도 스크립트를 불러오는 중 오류가 발생했습니다.')}
      />
      <div
        ref={mapRef}
        className={cn(
          'w-full min-h-[400px] lg:min-h-[600px] rounded-lg overflow-hidden',
          className,
        )}
        aria-label="네이버 지도"
      />
    </>
  );
}


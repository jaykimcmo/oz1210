/**
 * @file detail-map.tsx
 * @description 관광지 지도 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 위치를 네이버 지도에 표시합니다.
 *
 * 주요 기능:
 * 1. 단일 관광지 위치 표시
 * 2. 마커 1개 표시
 * 3. 길찾기 버튼 (네이버 지도 앱/웹 연동)
 * 4. 좌표 정보 표시 (선택 사항)
 *
 * 핵심 구현 로직:
 * - 클라이언트 컴포넌트 (Naver Maps API는 클라이언트에서만 동작)
 * - 좌표가 없으면 섹션 숨김
 * - 기존 naver-map.tsx 패턴 참고하되 단일 관광지용으로 단순화
 *
 * @dependencies
 * - next/script: 스크립트 로드
 * - lib/utils/coordinates.ts: 좌표 변환 함수
 * - lib/types/tour.ts: TourDetail 타입
 * - types/navermaps.d.ts: Naver Maps 타입 정의
 * - components/ui/button.tsx: Button 컴포넌트
 * - lucide-react: 아이콘들
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Navigation, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { convertKATECToWGS84 } from '@/lib/utils/coordinates';
import type { TourDetail } from '@/lib/types/tour';
import { toast } from 'sonner';

interface DetailMapProps {
  detail: TourDetail;
}

/**
 * 관광지 지도 섹션 컴포넌트
 *
 * @param detail - 관광지 상세 정보
 */
export function DetailMap({ detail }: DetailMapProps) {
  // 좌표가 없으면 섹션 숨김
  if (!detail.mapx || !detail.mapy) {
    return null;
  }

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  // Naver Maps API 키
  const ncpKeyId =
    process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ||
    process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID;

  // 좌표 변환
  useEffect(() => {
    try {
      const [lng, lat] = convertKATECToWGS84(detail.mapx, detail.mapy);
      // 변환된 좌표가 대한민국 범위 내인지 확인
      if (lng >= 124 && lng <= 132 && lat >= 33 && lat <= 43) {
        setCoordinates([lng, lat]);
      } else {
        setError('좌표가 유효하지 않습니다.');
      }
    } catch (err) {
      console.error('[DetailMap] 좌표 변환 실패:', err);
      setError('좌표 변환에 실패했습니다.');
    }
  }, [detail.mapx, detail.mapy]);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !ncpKeyId || !coordinates) {
      if (!ncpKeyId) {
        setError('네이버 지도 API 키가 설정되지 않았습니다.');
      }
      return;
    }

    try {
      const [lng, lat] = coordinates;
      const center = new naver.maps.LatLng(lat, lng);

      // 지도 초기화
      const mapOptions: naver.maps.MapOptions = {
        center,
        zoom: 16, // 관광지 하나를 크게 보기 적절한 레벨
        zoomControl: true,
        zoomControlOptions: {
          position: 'TOP_RIGHT' as naver.maps.Position,
        },
        mapTypeControl: true,
      };

      const map = new naver.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // 마커 생성
      const marker = new naver.maps.Marker({
        position: center,
        map,
        title: detail.title,
      });
      markerRef.current = marker;

      // 지도 크기 조정 (컨테이너 크기 변경 시)
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          // Naver Maps API v3에서는 setSize 사용
          const container = mapRef.current;
          if (container) {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            mapInstanceRef.current.setSize(new naver.maps.Size(width, height));
          }
        }
      });

      if (mapRef.current) {
        resizeObserver.observe(mapRef.current);
      }

      return () => {
        resizeObserver.disconnect();
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
        }
      };
    } catch (err) {
      console.error('[DetailMap] 지도 초기화 실패:', err);
      setError('지도를 불러오는데 실패했습니다.');
    }
  }, [isLoaded, ncpKeyId, coordinates, detail.title]);

  // 좌표 복사 기능
  const handleCopyCoordinates = async () => {
    if (!coordinates) return;

    const [lng, lat] = coordinates;
    const coordText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    try {
      if (typeof window !== 'undefined' && window.isSecureContext) {
        await navigator.clipboard.writeText(coordText);
        toast.success('좌표가 클립보드에 복사되었습니다.');
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = coordText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('좌표가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      console.error('[DetailMap] 좌표 복사 실패:', error);
      toast.error('좌표 복사에 실패했습니다.');
    }
  };

  // 길찾기 URL 생성
  const getDirectionsUrl = (): string => {
    if (!coordinates) return '#';
    const [lng, lat] = coordinates;
    // 네이버 지도 길찾기 URL (좌표 기반)
    return `https://map.naver.com/v5/directions/${lng},${lat}`;
  };

  // 에러 상태
  if (error) {
    return (
      <section aria-label="지도" className="space-y-4 pt-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">위치</h2>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Naver Maps API 스크립트 로드 */}
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpKeyId}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError('네이버 지도 API를 불러오는데 실패했습니다.');
        }}
      />

      <section aria-label="지도" className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">위치</h2>
          {/* 길찾기 버튼 */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="네이버 지도에서 길찾기"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              <span>길찾기</span>
            </a>
          </Button>
        </div>

        {/* 지도 컨테이너 */}
        <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-lg overflow-hidden bg-muted">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">지도를 불러오는 중...</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" aria-label={`${detail.title} 위치`} />
        </div>

        {/* 좌표 정보 */}
        {coordinates && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>좌표:</span>
              <span className="font-mono">
                {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCoordinates}
              className="h-auto p-1"
              aria-label="좌표 복사"
            >
              <Copy className="h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        )}
      </section>
    </>
  );
}


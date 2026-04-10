import { useEffect, useRef } from 'react';

import type { KakaoMap, KakaoMarker } from '../types/kakao-types';
import type { MapContainerProps } from '../types/map-types';

const DEFAULT_LAT = 37.5172;
const DEFAULT_LNG = 127.0473;
const DEFAULT_LEVEL = 5;

export const MapContainer = ({
  isLoaded,
  shops,
  onMarkerClick,
}: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: DEFAULT_LEVEL,
    });
  }, [isLoaded]);

  // 마커 렌더링
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    shops.forEach((shop) => {
      // 마커 위치
      const markerPosition = new window.kakao.maps.LatLng(
        shop.latitude,
        shop.longitude
      );

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: mapInstanceRef.current!,
        title: shop.shopName, // 마커 hover 시 표시될 이름
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClick?.(shop.shopId);
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, shops, onMarkerClick]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-400">지도를 불러오는 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
};

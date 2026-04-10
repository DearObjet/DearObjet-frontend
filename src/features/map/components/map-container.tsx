import { useEffect, useRef } from 'react';

import type {
  KakaoMap,
  KakaoMarker,
  KakaoCustomOverlay,
} from '../types/kakao-types';
import type { MapContainerProps } from '../types/map-types';

const DEFAULT_LEVEL = 5;

export const MapContainer = ({
  isLoaded,
  isLocating,
  coordinates,
  shops,
  onMarkerClick,
}: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const shopMarkersRef = useRef<KakaoMarker[]>([]);
  const myMarkerRef = useRef<KakaoCustomOverlay | null>(null);

  // 지도 초기화 (카카오 지도 SDK 로드 + 위치 확정 후 1회만 실행)
  useEffect(() => {
    if (!isLoaded || isLocating || !mapRef.current) return;

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
      level: DEFAULT_LEVEL,
    });
  }, [isLoaded, isLocating]);

  // 현재 위치 마커
  useEffect(() => {
    if (!isLoaded || isLocating || !mapInstanceRef.current) return;

    myMarkerRef.current?.setMap(null);

    const el = document.createElement('div');
    el.style.cssText = 'width: 36px; height: 48px; position: relative;';
    el.innerHTML = `
      <div style="
        width: 36px;
        height: 36px;
        background-color: #FF3B30;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
      <div style="
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-top: 14px solid #FF3B30;
        margin: 0 auto;
        margin-top:-4.3px;
      "></div>
    `;

    myMarkerRef.current = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
      content: el,
      map: mapInstanceRef.current,
      yAnchor: 1,
    });
  }, [isLoaded, isLocating, coordinates]);

  // 소품샵 마커
  useEffect(() => {
    if (!isLoaded || isLocating || !mapInstanceRef.current) return;

    shopMarkersRef.current.forEach((marker) => marker.setMap(null));
    shopMarkersRef.current = [];

    shops.forEach((shop) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(shop.latitude, shop.longitude),
        map: mapInstanceRef.current!,
        title: shop.shopName,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClick?.(shop.shopId);
      });

      shopMarkersRef.current.push(marker);
    });
  }, [isLoaded, isLocating, shops, onMarkerClick]);

  if (!isLoaded || isLocating) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-theme-100">
        <p className="text-sm text-theme-300">
          {!isLoaded ? '지도를 불러오는 중...' : '현재 위치를 찾는 중...'}
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
};

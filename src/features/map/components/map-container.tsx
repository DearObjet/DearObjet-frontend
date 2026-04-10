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
  const markersRef = useRef<KakaoMarker[]>([]);
  const myMarkerRef = useRef<KakaoCustomOverlay | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = new window.kakao.maps.LatLng(
      coordinates.lat,
      coordinates.lng
    );

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: DEFAULT_LEVEL,
    });
  }, [isLoaded, coordinates]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || isLocating) return;

    // 기존 소품샵 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 기존 현재 위치 마커 제거
    myMarkerRef.current?.setMap(null);

    // 현재 위치 마커 생성 (커스텀)
    const myMarkerEl = document.createElement('div');
    myMarkerEl.style.cssText = `
      width: 36px;
      height: 48px;
      position: relative;
    `;
    myMarkerEl.innerHTML = `
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
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 14px solid #FF3B30;
        margin: 0 auto;
        margin-top: -2px;
      "></div>
    `;

    myMarkerRef.current = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
      content: myMarkerEl,
      map: mapInstanceRef.current,
      yAnchor: 1,
    });

    // 소품샵 마커 생성
    const createMarker = (lat: number, lng: number, title: string) => {
      return new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map: mapInstanceRef.current!,
        title,
      });
    };

    shops.forEach((shop) => {
      const marker = createMarker(shop.latitude, shop.longitude, shop.shopName);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        onMarkerClick?.(shop.shopId);
      });

      markersRef.current.push(marker);
    });
  }, [isLoaded, isLocating, shops, coordinates, onMarkerClick]);

  if (!isLoaded || isLocating) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-400">
          {!isLoaded ? '지도를 불러오는 중...' : '현재 위치를 찾는 중...'}
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
};

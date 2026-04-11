import { useEffect, useRef } from 'react';

import type {
  KakaoMap,
  KakaoMarker,
  KakaoCustomOverlay,
} from '../types/kakao-types';
import type { MapContainerProps } from '../types/map-types';

// 인포윈도우 content 생성 함수
const createInfoOverlayContent = (shopName: string): HTMLElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: relative;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 500;
    color: #212121;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    bottom: 8px;
    pointer-events: none;
  `;

  const text = document.createElement('span');
  text.textContent = shopName;

  const tail = document.createElement('div');
  tail.style.cssText = `
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid white;
    filter: drop-shadow(0 1px 0px #e0e0e0);
    pointer-events: none;
  `;

  container.appendChild(text);
  container.appendChild(tail);
  return container;
};

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
  const infoOverlayRef = useRef<KakaoCustomOverlay | null>(null);

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
      yAnchor: 2,
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
      });

      // mouseover
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        // 기존 오버레이 제거
        infoOverlayRef.current?.setMap(null);

        infoOverlayRef.current = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(shop.latitude, shop.longitude),
          content: createInfoOverlayContent(shop.shopName),
          map: mapInstanceRef.current!,
          yAnchor: 2.25,
        });
      });

      // mouseout
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infoOverlayRef.current?.setMap(null);
        infoOverlayRef.current = null;
      });

      // 클릭 이벤트
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

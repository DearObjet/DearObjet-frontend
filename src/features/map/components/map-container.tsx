import { useEffect, useRef } from 'react';

import DearObjectMapMarker from '../../../assets/dear-objet-map-marker.svg';

import type {
  KakaoMap,
  KakaoMarker,
  KakaoCustomOverlay,
  KakaoClusterer,
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
  selectedShopId,
  onMarkerClick,
}: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const shopMarkersRef = useRef<KakaoMarker[]>([]);
  const myMarkerRef = useRef<KakaoCustomOverlay | null>(null);
  const selectedShopIdRef = useRef<number | null>(selectedShopId);
  const infoOverlayRef = useRef<KakaoCustomOverlay | null>(null);
  const clustererRef = useRef<KakaoClusterer | null>(null);

  // 지도 초기화 (카카오 지도 SDK 로드 + 위치 확정 후 1회만 실행)
  useEffect(() => {
    if (!isLoaded || isLocating || !mapRef.current) return;

    mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
      level: DEFAULT_LEVEL,
    });

    // 클러스터러 초기화
    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map: mapInstanceRef.current,
      averageCenter: true, // 클러스터 중심을 마커들의 평균 좌표로
      minLevel: 4, // 4레벨 이상에서 클러스터링
    });
  }, [isLoaded, isLocating]);

  useEffect(() => {
    selectedShopIdRef.current = selectedShopId;
  }, [selectedShopId]);

  // 선택된 샵으로 지도 이동
  useEffect(() => {
    if (
      !isLoaded ||
      isLocating ||
      !mapInstanceRef.current ||
      selectedShopId === null
    )
      return;

    const selectedShop = shops.find((shop) => shop.shopId === selectedShopId);

    if (!selectedShop) return;

    mapInstanceRef.current.panTo(
      new window.kakao.maps.LatLng(
        selectedShop.latitude,
        selectedShop.longitude
      )
    );
  }, [isLoaded, isLocating, selectedShopId, shops]);

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

  // 소품샵 마커 + 클러스터링
  useEffect(() => {
    if (
      !isLoaded ||
      isLocating ||
      !mapInstanceRef.current ||
      !clustererRef.current
    )
      return;

    // 기존 마커 제거
    shopMarkersRef.current.forEach((marker) => marker.setMap(null));
    shopMarkersRef.current = [];

    // 클러스터러 초기화
    clustererRef.current.clear();

    const markerSize = new window.kakao.maps.Size(40, 40);
    const markerImage = new window.kakao.maps.MarkerImage(
      DearObjectMapMarker,
      markerSize
    );

    const newMarkers = shops.map((shop) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(shop.latitude, shop.longitude),
        image: markerImage,
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infoOverlayRef.current?.setMap(null);
        infoOverlayRef.current = new window.kakao.maps.CustomOverlay({
          position: new window.kakao.maps.LatLng(shop.latitude, shop.longitude),
          content: createInfoOverlayContent(shop.shopName),
          map: mapInstanceRef.current!,
          yAnchor: 2.25,
        });
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infoOverlayRef.current?.setMap(null);
        infoOverlayRef.current = null;
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (selectedShopIdRef.current === shop.shopId) return;
        onMarkerClick?.(shop.shopId);
      });

      return marker;
    });

    shopMarkersRef.current = newMarkers;

    // 클러스터러에 마커 추가 (map 직접 설정 대신 클러스터러가 관리)
    clustererRef.current.addMarkers(newMarkers);
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

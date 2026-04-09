import { useEffect, useRef } from 'react';

interface MapContainerProps {
  isLoaded: boolean;
}

// 서울 시청 기본 좌표
const DEFAULT_LAT = 37.5665;
const DEFAULT_LNG = 126.978;
const DEFAULT_LEVEL = 5;

export const MapContainer = ({ isLoaded }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);

    new window.kakao.maps.Map(mapRef.current, {
      center,
      level: DEFAULT_LEVEL,
    });
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-400">지도를 불러오는 중...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full" />;
};

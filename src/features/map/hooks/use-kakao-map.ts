import { useEffect, useState } from 'react';

import { DEFAULT_COORDINATES, KAKAO_MAP_KEY } from '../constants/map-constants';
import type { Coordinates } from '../types/map-types';

export const useKakaoMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [coordinates, setCoordinates] =
    useState<Coordinates>(DEFAULT_COORDINATES);

  // 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // 권한 거부 또는 에러 시 기본값 유지
        console.warn('위치 정보를 가져올 수 없어 기본 위치로 설정합니다.');
      }
    );
  }, []);

  // 카카오 지도 SDK 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, coordinates };
};

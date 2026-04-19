import { useEffect, useRef, useState } from 'react';

import { DEFAULT_COORDINATES, KAKAO_MAP_KEY } from '../constants/map-constants';
import type { Coordinates } from '../types/map-types';

export const useKakaoMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [coordinates, setCoordinates] =
    useState<Coordinates>(DEFAULT_COORDINATES);
  const isScriptAdded = useRef(false);

  useEffect(() => {
    // geolocation 현재 위치 요청
    if (!navigator.geolocation) {
      setIsLocating(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCoordinates({ lat: coords.latitude, lng: coords.longitude });
          setIsLocating(false);
        },
        () => {
          // 권한 거부 또는 에러 시 기본값 유지
          console.warn('위치 정보를 가져올 수 없어 기본 위치로 설정합니다.');
          setIsLocating(false);
        },
        {
          timeout: 1000, // 1초 안에 값을 못받으면 기본값으로
          maximumAge: 600000, // 10분 이내에 가져온 위치 정보가 있다면 캐시 사용
        }
      );
    }

    // 카카오 지도 SDK 로드
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    if (isScriptAdded.current) return;
    isScriptAdded.current = true;

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => setIsLoaded(true));
    document.head.appendChild(script);
  }, []);

  return { isLoaded, isLocating, coordinates };
};

interface Window {
  kakao: {
    maps: {
      load: (callback: () => void) => void;
      Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
      LatLng: new (lat: number, lng: number) => KakaoLatLng;
    };
  };
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  panTo: (latlng: KakaoLatLng) => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

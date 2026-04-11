import type {
  KakaoMap,
  KakaoLatLng,
  KakaoMarker,
  KakaoMarkerOptions,
  KakaoMapOptions,
  KakaoCustomOverlay,
  KakaoCustomOverlayOptions,
  KakaoInfoWindow,
  KakaoInfoWindowOptions,
} from './kakao-types';

export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
        CustomOverlay: new (
          options: KakaoCustomOverlayOptions
        ) => KakaoCustomOverlay;
        InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
        event: {
          addListener: (
            target: KakaoMarker,
            type: string,
            handler: () => void
          ) => void;
        };
      };
    };
  }
}

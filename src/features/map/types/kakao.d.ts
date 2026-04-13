import type {
  KakaoMap,
  KakaoLatLng,
  KakaoMarker,
  KakaoMarkerOptions,
  KakaoMapOptions,
  KakaoCustomOverlay,
  KakaoCustomOverlayOptions,
  KakaoClusterer,
  KakaoClustererOptions,
  KakaoSize,
  KakaoMarkerImage,
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
        Size: new (width: number, height: number) => KakaoSize;
        MarkerImage: new (src: string, size: KakaoSize) => KakaoMarkerImage;
        CustomOverlay: new (
          options: KakaoCustomOverlayOptions
        ) => KakaoCustomOverlay;
        event: {
          addListener: (
            target: KakaoMarker | KakaoMap,
            type: string,
            handler: () => void
          ) => void;
        };
        MarkerClusterer: new (options: KakaoClustererOptions) => KakaoClusterer;
      };
    };
  }
}

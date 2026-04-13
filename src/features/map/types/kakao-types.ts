export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

export interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  panTo: (latlng: KakaoLatLng) => void;
}

export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap;
  title?: string;
}

export interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  getPosition: () => KakaoLatLng;
}

export interface KakaoCustomOverlayOptions {
  position: KakaoLatLng;
  content: string | HTMLElement;
  map?: KakaoMap;
  yAnchor?: number;
  xAnchor?: number;
  zIndex?: number;
}

export interface KakaoCustomOverlay {
  setMap: (map: KakaoMap | null) => void;
}

export interface KakaoClustererOptions {
  map: KakaoMap;
  averageCenter?: boolean;
  minLevel?: number;
  disableClickZoom?: boolean;
  styles?: object[];
}

export interface KakaoClusterer {
  addMarkers: (markers: KakaoMarker[]) => void;
  removeMarkers: (markers: KakaoMarker[]) => void;
  clear: () => void;
  setMap: (map: KakaoMap | null) => void;
}

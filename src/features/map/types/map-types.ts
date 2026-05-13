import type { TAB_MENUS } from '../constants/map-constants';

export interface ShopMapItem {
  shopId: number;
  shopName: string;
  businessName: string;
  businessAddress: string;
  latitude: number;
  longitude: number;
}

export interface MapContainerProps {
  isLoaded: boolean;
  isLocating: boolean;
  coordinates: { lat: number; lng: number };
  shops: ShopMapItem[];
  selectedShopId: number | null;
  onMarkerClick?: (shopId: number) => void;
}

export interface ShopMapResponse {
  shops: ShopMapItem[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ShopPanelProps {
  shopDetail: ShopDetail | null;
  shopId: number | null;
}

export interface DayHours {
  openTime: string | null;
  closeTime: string | null;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface ShopDetail {
  userId: number;
  shopName: string;
  phoneNumber: string | null;
  businessAddress: string;
  businessHours: BusinessHours | null;
  isFavorite: boolean;
}

export type TabMenu = (typeof TAB_MENUS)[number];

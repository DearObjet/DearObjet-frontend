export interface FavoriteShopItem {
  favoriteId: number;
  shopId: number;
  shopName: string;
  profileUrl: string | null;
  businessAddress: string;
  phoneNumber: string | null;
  instagramId: string | null;
  latitude: number;
  longitude: number;
  favoritedAt: string;
}

export interface FavoriteShopListResponse {
  items: FavoriteShopItem[];
  page: number;
  totalPages: number;
}

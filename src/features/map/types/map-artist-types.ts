export interface MapArtistItem {
  artistId: number;
  artistName: string;
  artistImageUrl: string | null;
}

export interface MapArtistListResponse {
  items: MapArtistItem[];
}

export interface ArtistTabProps {
  shopId: number;
}

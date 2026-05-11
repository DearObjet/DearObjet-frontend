export interface Artist {
  artistId: number;
  profileUrl: string;
  name: string;
}

export interface ArtistListResponse {
  data: {
    artists: Artist[];
    seed: number;
    nextCursor: number;
    hasNext: boolean;
  };
}

export interface ArtistListParams {
  seed?: number;
  cursor?: number;
  size?: number;
}

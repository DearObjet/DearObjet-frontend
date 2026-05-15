import { useGetShopArtistsQuery } from '../api/map-api';
import type { ArtistTabProps } from '../types/map-artist-types';

export const ArtistTab = ({ shopId }: ArtistTabProps) => {
  const { data, isLoading } = useGetShopArtistsQuery(shopId);

  if (isLoading) {
    return (
      <p className="py-6 text-center text-sm text-theme-300">불러오는 중...</p>
    );
  }

  if (!data?.items.length) {
    return (
      <p className="py-6 text-center text-xs text-theme-300">
        입점 작가가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {data.items.map((artist) => (
        <div key={artist.artistId} className="flex flex-col items-center gap-1">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-theme-200">
            {artist.artistImageUrl && (
              <img
                src={artist.artistImageUrl}
                alt={artist.artistName}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <p className="text-sm text-theme-900">{artist.artistName}</p>
        </div>
      ))}
    </div>
  );
};

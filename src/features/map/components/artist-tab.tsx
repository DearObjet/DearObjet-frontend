import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

interface Artist {
  artistId: number;
  name: string;
  profileImageUrl: string | null;
}

const fetchArtists = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const names = ['김댕댕', '러브미모어', '파워J', '솜다람', '별하', '모모'];
  const items: Artist[] = Array.from({ length: 6 }, (_, i) => ({
    artistId: (page - 1) * 6 + i + 1,
    name: names[i % names.length],
    profileImageUrl: null,
  }));

  return { items, hasMore: page < 5 };
};

export const ArtistTab = () => {
  const { items, isLoading, hasMore, observerTargetRef } =
    useInfiniteScroll<Artist>({
      fetchData: fetchArtists,
    });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 gap-6 p-4">
        {items.map((artist) => (
          <div
            key={artist.artistId}
            className="flex flex-col items-center gap-1"
          >
            {/* 프로필 사진 */}
            <div className="h-28 w-28 overflow-hidden rounded-full bg-theme-200">
              {artist.profileImageUrl && (
                <img
                  src={artist.profileImageUrl}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {/* 이름 */}
            <p className="text-sm text-theme-900">{artist.name}</p>
          </div>
        ))}
      </div>
      <div ref={observerTargetRef} className="py-2 text-center">
        {isLoading && <p className="text-sm text-theme-300">불러오는 중...</p>}
        {!hasMore && (
          <p className="text-sm text-theme-300">마지막 작가입니다.</p>
        )}
      </div>
    </div>
  );
};

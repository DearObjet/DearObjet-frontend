interface Artist {
  artistId: number;
  name: string;
  profileImageUrl: string | null;
}

const DUMMY_ARTISTS: Artist[] = [
  { artistId: 1, name: '김댕댕', profileImageUrl: null },
  { artistId: 2, name: '러브미모어', profileImageUrl: null },
  { artistId: 3, name: '파워J', profileImageUrl: null },
  { artistId: 4, name: '김댕댕', profileImageUrl: null },
  { artistId: 5, name: '러브미모어', profileImageUrl: null },
  { artistId: 6, name: '파워J', profileImageUrl: null },
  { artistId: 7, name: '김댕댕', profileImageUrl: null },
  { artistId: 8, name: '러브미모어', profileImageUrl: null },
  { artistId: 9, name: '파워J', profileImageUrl: null },
];

export const ArtistTab = () => {
  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {DUMMY_ARTISTS.map((artist) => (
        <div key={artist.artistId} className="flex flex-col items-center gap-1">
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
  );
};

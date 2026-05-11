import { useState, useEffect, useRef, useCallback } from 'react';

import { useGetArtistsQuery } from '../api/artist-page-api';
import type { Artist } from '../types/artist-page-types';
import { ARTIST_PAGE_SIZE } from '../constants/artist-page-constants';
import { UserProfile } from '../../../shared/components/layout/aside/user-profile';
import { Post } from '../../../shared/components/common/post';

const FIXED_SEED = Math.floor(Math.random() * 10000);

export const ArtistPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const { data, isFetching } = useGetArtistsQuery(
    { seed: FIXED_SEED, cursor, size: ARTIST_PAGE_SIZE },
    { skip: !hasNext && cursor !== undefined }
  );

  const selectedArtist = artists.find((a) => a.artistId === selectedArtistId);

  useEffect(() => {
    if (!data) return;
    setArtists((prev) => {
      const existingIds = new Set(prev.map((a) => a.artistId));
      const newItems = data.artists.filter((a) => !existingIds.has(a.artistId));
      return [...prev, ...newItems];
    });
    setHasNext(data.hasNext);
    isFetchingRef.current = false;
  }, [data]);

  const loadMore = useCallback(() => {
    if (!hasNext || isFetching || isFetchingRef.current) return;
    if (!data?.nextCursor) return;
    isFetchingRef.current = true;
    setCursor(data.nextCursor);
  }, [hasNext, isFetching, data?.nextCursor]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const root = document.getElementById('main-content');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root, threshold: 0, rootMargin: '0px 0px 100px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="w-full">
      <section className="-mx-6 md:-mx-10 xl:-mx-[19.469rem]">
        <h3 className="h-[18.5rem] w-full bg-gray-100">배너</h3>
      </section>

      <div className="mt-[1.5rem] flex justify-center gap-[4.25rem] pt-[3.25rem]">
        {selectedArtist && (
          <section className="w-[33.5625rem] shrink-0">
            <h4 className="hidden">작가의 포스터</h4>
            <Post
              userName={selectedArtist.name}
              userId={String(selectedArtist.artistId)}
              userImage={selectedArtist.profileUrl}
              showSuggest
              hasPost={false}
            />
          </section>
        )}

        <section className="h-[64.9375rem] w-[31.1875rem] shrink-0 overflow-y-auto">
          <h4 className="hidden">작가 리스트</h4>
          <div className="mt-2 grid grid-cols-3 gap-[0.875rem]">
            {artists.map((artist) => (
              <div key={artist.artistId} className="flex justify-center">
                <UserProfile
                  variant="author"
                  userName={artist.name}
                  userId={String(artist.artistId)}
                  userImage={artist.profileUrl}
                  isSelected={selectedArtistId === artist.artistId}
                  onAction={() => setSelectedArtistId(artist.artistId)}
                />
              </div>
            ))}
          </div>
          <div ref={observerRef} className="h-[0.25rem]" />
        </section>
      </div>
    </div>
  );
};

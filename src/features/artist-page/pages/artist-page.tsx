import { useState, useEffect, useRef, useCallback } from 'react';

import { UserProfile } from '../../../shared/components/layout/aside/user-profile';
import { Post } from '../../../shared/components/common/post';

const mockArtists = Array.from({ length: 30 }, (_, i) => ({
  userId: `user${i + 1}`,
  userName: `작가${i + 1}`,
  userImage: '',
}));

const PAGE_SIZE = 9;

export const ArtistPage = () => {
  const [items, setItems] = useState(mockArtists.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const selectedArtist = mockArtists.find((a) => a.userId === selectedUserId);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const next = mockArtists.slice(0, nextPage * PAGE_SIZE);
    if (next.length === items.length) return;
    setItems(next);
    setPage(nextPage);
  }, [page, items.length]);

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
    <div className="h-[86.5625rem] w-full">
      <section className="-mx-6 md:-mx-10 xl:-mx-[19.469rem]">
        <h3 className="h-[18.5rem] w-full bg-gray-100">배너</h3>
      </section>

      <div className="flex gap-[4.25rem]">
        <section>
          <h4 className="hidden">작가의 포스터</h4>
          <Post
            userName={selectedArtist?.userName ?? ''}
            userId={selectedArtist?.userId ?? ''}
            userImage={selectedArtist?.userImage ?? ''}
            showSuggest
          />
        </section>

        <section className="mx-auto mt-[1.5rem] h-[64.9375rem] w-[31.1875rem] overflow-y-auto">
          <h4 className="hidden">작가 리스트</h4>
          <div className="grid grid-cols-3 gap-[0.875rem]">
            {items.map((artist) => (
              <div key={artist.userId} className="flex justify-center">
                <UserProfile
                  variant="author"
                  userName={artist.userName}
                  userId={artist.userId}
                  userImage={artist.userImage}
                  isSelected={selectedUserId === artist.userId}
                  onAction={() => setSelectedUserId(artist.userId)}
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

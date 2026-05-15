import { useCallback } from 'react';

import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

import { useLazyGetShopStoriesQuery } from '../api/map-api';
import type { MapStoryItem, StoryTabProps } from '../types/map-story-types';

const formatDate = (createdAt: string) =>
  createdAt.slice(0, 10).replace(/-/g, '.');

export const StoryTab = ({ shopId }: StoryTabProps) => {
  const [fetchStories] = useLazyGetShopStoriesQuery();

  const fetchData = useCallback(
    async (page: number) => {
      const result = await fetchStories({ shopId, page }).unwrap();
      return {
        items: result.items,
        hasMore: page < result.totalPages,
      };
    },
    [fetchStories, shopId]
  );

  const { items, isLoading, hasMore, observerTargetRef } =
    useInfiniteScroll<MapStoryItem>({ fetchData });

  return (
    <div className="flex flex-col divide-y divide-theme-200">
      {items.map((story) => (
        <div key={story.storyId} className="flex flex-col gap-3 p-4">
          <div className="aspect-video w-full overflow-hidden rounded bg-theme-200">
            <img
              src={story.thumbnailImageUrl}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="break-all font-semibold text-theme-900">
            {story.title}
          </p>
          <p className="break-all text-sm text-theme-700">{story.content}</p>
          <p className="text-right text-xs text-theme-500">
            {formatDate(story.createdAt)}
          </p>
        </div>
      ))}

      <div ref={observerTargetRef} className="py-2 text-center">
        {isLoading && <p className="text-sm text-theme-300">불러오는 중...</p>}
        {!hasMore && items.length > 0 && (
          <p className="text-sm text-theme-300">마지막 스토리입니다.</p>
        )}
        {!isLoading && items.length === 0 && (
          <p className="py-6 text-center text-xs text-theme-300">
            등록된 스토리가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

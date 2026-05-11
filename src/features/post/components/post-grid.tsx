import { useInfiniteScroll } from '../../map/hooks/use-infinite-scroll';

import type { PostListItem } from '../types/post-type';

interface PostGridProps {
  fetchData: (
    page: number
  ) => Promise<{ items: PostListItem[]; hasMore: boolean }>;
  onPostClick: (postId: number) => void;
}

export const PostGrid = ({ fetchData, onPostClick }: PostGridProps) => {
  const {
    items: posts,
    isLoading,
    hasMore,
    observerTargetRef,
  } = useInfiniteScroll<PostListItem>({ fetchData });

  if (!isLoading && posts.length === 0) {
    return (
      <p className="pt-20 text-center text-xs text-gray-400">
        아직 포스트가 없습니다.
      </p>
    );
  }

  return (
    <div className="aspect-square w-full overflow-y-auto">
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <button
            key={post.postId}
            onClick={() => onPostClick(post.postId)}
            className="group aspect-square overflow-hidden focus:outline-none"
          >
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-theme-200" />
            )}
          </button>
        ))}
      </div>

      <div ref={observerTargetRef} className="py-2 text-center">
        {isLoading && <p className="text-xs text-gray-400">불러오는 중...</p>}
        {!hasMore && posts.length > 0 && (
          <p className="text-xs text-gray-400">마지막 포스트입니다.</p>
        )}
      </div>
    </div>
  );
};

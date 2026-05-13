import { useInfiniteScroll } from '../../map/hooks/use-infinite-scroll';

import type { FavoriteShopItem } from '../../map/types/favorite-types';

interface FavoritesGridProps {
  fetchData: (
    page: number
  ) => Promise<{ items: FavoriteShopItem[]; hasMore: boolean }>;
  onShopClick: (shop: FavoriteShopItem) => void;
}

export const MyFavoritesGrid = ({
  fetchData,
  onShopClick,
}: FavoritesGridProps) => {
  const {
    items: shops,
    isLoading,
    hasMore,
    observerTargetRef,
  } = useInfiniteScroll<FavoriteShopItem>({ fetchData });

  if (!isLoading && shops.length === 0) {
    return (
      <p className="pt-20 text-center text-xs text-gray-400">
        찜한 소품샵이 없습니다.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1">
        {shops.map((shop) => (
          <button
            key={shop.favoriteId}
            onClick={() => onShopClick(shop)}
            className="group h-[15.875rem] w-[15.875rem] overflow-hidden focus:outline-none"
          >
            {shop.profileUrl ? (
              <img
                src={shop.profileUrl}
                alt={shop.shopName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-theme-200">
                <span className="line-clamp-2 px-2 text-center text-xs text-theme-500">
                  {shop.shopName}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div ref={observerTargetRef} className="py-2 text-center">
        {isLoading && <p className="text-xs text-gray-400">불러오는 중...</p>}
        {!hasMore && shops.length > 0 && (
          <p className="text-xs text-gray-400">마지막 찜목록입니다.</p>
        )}
      </div>
    </div>
  );
};

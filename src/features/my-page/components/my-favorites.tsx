import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useLazyGetFavoriteShopListQuery } from '../../map/api/favorite-api';
import type { FavoriteShopItem } from '../../map/types/favorite-types';
import { MyPageLayout } from './my-page-layout';
import { MyFavoritesGrid } from './my-favorites-grid';

export const MyFavorites = () => {
  const navigate = useNavigate();
  const [triggerGetFavoriteShopList] = useLazyGetFavoriteShopListQuery();

  const fetchData = useCallback(
    async (
      page: number
    ): Promise<{ items: FavoriteShopItem[]; hasMore: boolean }> => {
      const result = await triggerGetFavoriteShopList(page).unwrap();
      return {
        items: result.items,
        hasMore: result.page < result.totalPages,
      };
    },
    [triggerGetFavoriteShopList]
  );

  const handleShopClick = (shop: FavoriteShopItem) => {
    navigate(`/map?shopId=${shop.shopId}`);
  };

  return (
    <MyPageLayout>
      <MyFavoritesGrid fetchData={fetchData} onShopClick={handleShopClick} />
    </MyPageLayout>
  );
};

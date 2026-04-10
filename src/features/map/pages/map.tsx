import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

import { useGetShopDetailQuery, useGetShopMarkersQuery } from '../api/map-api';
import { useKakaoMap } from '../hooks/use-kakao-map';

import { MapContainer } from '../components/map-container';
import { MapSearchBar } from '../components/map-search-bar';
import { MapAside } from '../components/map-aside';

export const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 shopId 읽기
  const selectedShopId = searchParams.get('shopId')
    ? Number(searchParams.get('shopId'))
    : null;

  const { isLoaded, isLocating, coordinates } = useKakaoMap();
  const { data: shopMapData } = useGetShopMarkersQuery();
  const { data: shopDetail } = useGetShopDetailQuery(selectedShopId!, {
    skip: selectedShopId === null,
  });

  const shops = useMemo(() => shopMapData?.shops ?? [], [shopMapData]);

  const handleMarkerClick = useCallback(
    (shopId: number) => {
      setSearchParams({ shopId: String(shopId) });
    },
    [setSearchParams]
  );

  return (
    <div className="flex h-full w-full">
      <aside className="flex h-full w-[25.625rem] shrink-0 flex-col overflow-hidden border-r border-theme-200 bg-white">
        <MapSearchBar onSearch={(keyword) => console.log(keyword)} />
        <MapAside shopDetail={shopDetail ?? null} />
      </aside>

      <div className="flex-1">
        <MapContainer
          isLoaded={isLoaded}
          isLocating={isLocating}
          coordinates={coordinates}
          shops={shops}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
};

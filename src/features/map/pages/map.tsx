import { useState } from 'react';

import { useKakaoMap } from '../hooks/use-kakao-map';

import { MapContainer } from '../components/map-container';
import { MapSearchBar } from '../components/map-search-bar';
import { MapAside } from '../components/map-aside';
import { useGetShopDetailQuery, useGetShopMarkersQuery } from '../api/map-api';

export const Map = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);

  const { isLoaded } = useKakaoMap();
  const { data: shopMapData } = useGetShopMarkersQuery();
  const { data: shopDetail } = useGetShopDetailQuery(selectedShopId!, {
    skip: selectedShopId === null,
  });

  const shops = shopMapData?.shops ?? [];

  return (
    <div className="flex h-full w-full">
      <aside className="flex h-full w-[25.625rem] shrink-0 flex-col overflow-hidden border-r border-theme-200 bg-white">
        <MapSearchBar onSearch={(keyword) => console.log(keyword)} />
        <MapAside shopDetail={shopDetail ?? null} />
      </aside>

      <div className="flex-1">
        <MapContainer
          isLoaded={isLoaded}
          shops={shops}
          onMarkerClick={setSelectedShopId}
        />
      </div>
    </div>
  );
};

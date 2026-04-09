import { useKakaoMap } from '../hooks/use-kakao-map';
import { MapContainer } from '../components/map-container';
import { MapSearchBar } from '../components/map-search-bar';
import { MapAside } from '../components/map-aside';

export const Map = () => {
  const { isLoaded } = useKakaoMap();

  const handleSearch = (keyword: string) => {
    console.log('검색어:', keyword); // 추후 API 연동
  };

  return (
    <div className="flex h-full w-full">
      <aside
        style={{ width: 410 }}
        className="flex h-full shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white"
      >
        <MapSearchBar onSearch={handleSearch} />
        <MapAside />
      </aside>

      <div className="flex-1">
        <MapContainer isLoaded={isLoaded} />
      </div>
    </div>
  );
};

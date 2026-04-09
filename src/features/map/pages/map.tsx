import { useKakaoMap } from '../hooks/use-kakao-map';
import { MapContainer } from '../components/map-container';

export const Map = () => {
  const { isLoaded } = useKakaoMap();

  return (
    <div className="flex h-full w-full">
      <aside className="w-[12.5rem] shrink-0 border-r border-gray-200 bg-white" />
      <div className="flex-1">
        <MapContainer isLoaded={isLoaded} />
      </div>
    </div>
  );
};

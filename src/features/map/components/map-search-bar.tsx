import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';

import type { ShopMapItem } from '../types/map-types';

interface MapSearchBarProps {
  shops: ShopMapItem[];
  onSelectShop: (shopId: number) => void;
}

export const MapSearchBar = ({ shops, onSelectShop }: MapSearchBarProps) => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredShops = useMemo(
    () =>
      value.trim()
        ? shops.filter((shop) =>
            shop.shopName.toLowerCase().includes(value.toLowerCase())
          )
        : [],
    [shops, value]
  );

  const handleSelect = (shopId: number) => {
    onSelectShop(shopId);
    setValue('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue('');
    setIsOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative mx-2 my-2.5">
      <div className="flex items-center gap-2 rounded-lg border border-theme-300 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-theme-300" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => value && setIsOpen(true)}
          placeholder="소품샵 검색"
          className="flex-1 text-base outline-none placeholder:text-theme-300"
        />
        {value && (
          <button onClick={handleClear}>
            <X className="h-4 w-4 text-theme-300 hover:text-theme-700" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && value.trim() && (
        <div className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-lg border border-theme-200 bg-white shadow-md">
          {filteredShops.length > 0 ? (
            <ul className="max-h-[16rem] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {filteredShops.map((shop) => (
                <li key={shop.shopId}>
                  <button
                    onClick={() => handleSelect(shop.shopId)}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-theme-900 hover:bg-theme-100"
                  >
                    <Search className="h-3 w-3 shrink-0 text-theme-300" />
                    {shop.shopName}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-theme-300">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { Search } from 'lucide-react';

interface MapSearchBarProps {
  onSearch: (keyword: string) => void;
}

export const MapSearchBar = ({ onSearch }: MapSearchBarProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <div className="mx-2 my-2.5">
      <div className="flex items-center gap-2 rounded-lg border border-theme-200 bg-white px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="검색"
          style={{ fontSize: 14 }}
          className="flex-1 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

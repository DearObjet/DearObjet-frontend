import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

import { useGetFestivalsQuery } from '../api/festival-api';
import {
  AREA_CODES,
  FESTIVAL_ITEMS_PER_PAGE,
} from '../constants/festival-constants';
import { Button } from '../../../shared/components/ui';
import { FestivalCard } from './festival-card';

export const FestivalSection = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useGetFestivalsQuery({
    areacode: selectedArea,
    pageNo: currentPage,
  });

  const festivals = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / FESTIVAL_ITEMS_PER_PAGE) || 1;

  const handleAreaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="sr-only">축제</h2>
      <div className="flex items-center rounded-sm border border-gray-300 px-7 py-2">
        <p className="pr-8 text-xs">지역</p>
        <div className="relative">
          <select
            className="appearance-none bg-transparent pr-6 text-sm font-extrabold focus:outline-none"
            value={selectedArea}
            onChange={handleAreaChange}
          >
            {AREA_CODES.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex min-h-[15.75rem] flex-col justify-center gap-4 px-4 py-3">
        {festivals.length === 0 ? (
          <div className="flex h-[15.75rem] items-center justify-center">
            <p className="text-xs text-gray-400">축제 정보가 없습니다.</p>
          </div>
        ) : (
          festivals.map((festival) => (
            <FestivalCard
              key={festival.contentid}
              festival={festival}
              onClick={() => alert('준비중인 서비스입니다.')}
            />
          ))
        )}
      </div>

      <div className="flex gap-10 self-center">
        <Button
          variant="icon"
          icon={<ChevronLeft />}
          onClick={handlePrev}
          disabled={currentPage === 1}
        />
        <Button
          variant="icon"
          icon={<ChevronRight />}
          onClick={handleNext}
          disabled={currentPage === totalPages || festivals.length === 0}
        />
      </div>
    </section>
  );
};

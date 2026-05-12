import type { FestivalItem } from '../types/festival-types';

interface FestivalCardProps {
  festival: FestivalItem;
  onClick: () => void;
}

const formatDate = (date: string) =>
  `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;

export const FestivalCard = ({ festival, onClick }: FestivalCardProps) => {
  return (
    <button
      className="flex w-full items-center gap-3 text-left"
      onClick={onClick}
    >
      <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-sm bg-gray-200">
        {festival.firstimage && (
          <img
            src={festival.firstimage}
            alt={festival.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <p className="truncate text-sm font-semibold">{festival.title}</p>
        <p className="truncate text-xs text-gray-500">{festival.addr1}</p>
        <p className="text-xs text-gray-400">
          {formatDate(festival.eventstartdate)} ~{' '}
          {formatDate(festival.eventenddate)}
        </p>
      </div>
    </button>
  );
};

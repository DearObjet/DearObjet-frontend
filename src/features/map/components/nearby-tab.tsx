import { ExpandableText } from './expandable-text';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

interface NearbyEvent {
  eventId: number;
  imageUrl: string | null;
  category: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
}

const fetchEvents = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const categories = ['지역축제', '문화공연', '전시'];
  const items: NearbyEvent[] = Array.from({ length: 4 }, (_, i) => ({
    eventId: (page - 1) * 4 + i + 1,
    imageUrl: null,
    category: categories[i % categories.length],
    title: `행사 제목 ${(page - 1) * 4 + i + 1}`,
    content: '꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 행사',
    startDate: '2025.09.30',
    endDate: '2025.10.02',
  }));

  return { items, hasMore: page < 3 };
};

export const NearbyTab = () => {
  const { items, isLoading, hasMore, observerTargetRef } =
    useInfiniteScroll<NearbyEvent>({
      fetchData: fetchEvents,
    });

  return (
    <div className="flex flex-col divide-y divide-theme-200">
      {items.map((event) => (
        <div key={event.eventId} className="flex flex-col gap-3 p-4">
          {/* 이미지 */}
          <div className="aspect-video w-full overflow-hidden rounded bg-theme-200">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* 제목 */}
          <p className="font-semibold text-theme-900">
            [{event.category}] {event.title}
          </p>
          {/* 내용 */}
          <ExpandableText content={event.content} />
          {/* 행사 날짜 */}
          <p className="text-xs text-theme-500">
            {event.startDate} ~ {event.endDate}
          </p>
        </div>
      ))}

      <div ref={observerTargetRef} className="py-2 text-center">
        {isLoading && <p className="text-sm text-theme-300">불러오는 중...</p>}
        {!hasMore && (
          <p className="text-sm text-theme-300">마지막 항목입니다.</p>
        )}
      </div>
    </div>
  );
};

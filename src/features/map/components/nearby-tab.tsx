import { ExpandableText } from './expandable-text';

interface NearbyEvent {
  eventId: number;
  imageUrl: string | null;
  category: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
}

const DUMMY_EVENTS: NearbyEvent[] = [
  {
    eventId: 1,
    imageUrl: null,
    category: '지역축제',
    title: '한마당 거리축제',
    content:
      '꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제꺾인 더위, 선선한 바람을 맞으며 거리로 나와 가을을 맞이하는 축제',
    startDate: '2025.09.30',
    endDate: '2025.10.02',
  },
  {
    eventId: 2,
    imageUrl: null,
    category: '문화공연',
    title: '가을 음악회',
    content: '지역 예술인들이 함께하는 따뜻한 가을 음악회',
    startDate: '2025.10.05',
    endDate: '2025.10.05',
  },
];

export const NearbyTab = () => {
  return (
    <div className="flex flex-col divide-y divide-theme-200">
      {DUMMY_EVENTS.map((event) => (
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
    </div>
  );
};

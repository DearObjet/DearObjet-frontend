interface Story {
  storyId: number;
  imageUrl: string | null;
  title: string;
  content: string;
  createdAt: string;
}

const DUMMY_STORIES: Story[] = [
  {
    storyId: 1,
    imageUrl: null,
    title: '수원은 비가 온대요, 대구는 쨍쨍합니다',
    content:
      "오늘은 '수니작가'님 신상 굿즈 들어오는 날~ 비 오기 전에 얼른 도착해주세요",
    createdAt: '2025.09.16',
  },
  {
    storyId: 2,
    imageUrl: null,
    title: '가을 맞이 새 소품 입고!',
    content: '선선한 날씨에 어울리는 따뜻한 소품들이 도착했어요.',
    createdAt: '2025.09.10',
  },
];

export const StoryTab = () => {
  return (
    <div className="flex flex-col divide-y divide-theme-200">
      {DUMMY_STORIES.map((story) => (
        <div key={story.storyId} className="flex flex-col gap-3 p-4">
          {/* 이미지 */}
          <div className="aspect-video w-full overflow-hidden rounded bg-theme-200">
            {story.imageUrl && (
              <img
                src={story.imageUrl}
                alt={story.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {/* 제목 */}
          <p className="font-semibold text-theme-900">{story.title}</p>
          {/* 내용 */}
          <p className="text-sm text-theme-700">{story.content}</p>
          {/* 작성일 */}
          <p className="text-right text-xs text-theme-500">{story.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

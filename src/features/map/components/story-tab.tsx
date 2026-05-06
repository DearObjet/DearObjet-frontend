import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

interface Story {
  storyId: number;
  imageUrl: string | null;
  title: string;
  content: string;
  createdAt: string;
}

// 더미 데이터 생성 함수
const fetchStories = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션

  const items: Story[] = Array.from({ length: 5 }, (_, i) => ({
    storyId: (page - 1) * 5 + i + 1,
    imageUrl: null,
    title: `스토리 제목 ${(page - 1) * 5 + i + 1}`,
    content: '소품샵의 새로운 소식을 전해드립니다.',
    createdAt: '2025.09.16',
  }));

  return { items, hasMore: page < 5 };
};

export const StoryTab = () => {
  const { items, isLoading, hasMore, observerTargetRef } =
    useInfiniteScroll<Story>({
      fetchData: fetchStories,
    });

  return (
    <div className="flex flex-col divide-y divide-theme-200">
      {items.map((story) => (
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
      {/* IntersectionObserver 타겟 */}
      <div ref={observerTargetRef} className="py-2 text-center">
        {isLoading && <p className="text-sm text-theme-300">불러오는 중...</p>}
        {!hasMore && (
          <p className="text-sm text-theme-300">마지막 스토리입니다.</p>
        )}
      </div>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps<T> {
  fetchData: (page: number) => Promise<{ items: T[]; hasMore: boolean }>;
}

export const useInfiniteScroll = <T>({
  fetchData,
}: UseInfiniteScrollProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { items: newItems, hasMore: more } = await fetchData(page);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(more);
      setPage((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // IntersectionObserver로 하단 감지
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [page, isLoading, hasMore]);

  // 초기 로드
  useEffect(() => {
    loadMore();
  }, []);

  return { items, isLoading, hasMore, observerTargetRef };
};

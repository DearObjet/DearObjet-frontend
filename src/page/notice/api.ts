import type { NoticeApiItem } from '../../components/notice/notice-list';

const ITEMS_PER_PAGE = 10;
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchNotices(params: {
  target: 'USER' | 'ARTIST_SHOP';
  category?: string | null;
  page: number;
}) {
  const searchParams = new URLSearchParams({
    target: params.target,
    page: String(params.page),
    size: String(ITEMS_PER_PAGE),
  });
  if (params.category) searchParams.set('category', params.category);

  const res = await fetch(
    `${BASE_URL}/api/v1/notices?${searchParams.toString()}`
  );
  if (!res.ok) throw new Error('공지사항을 불러오지 못했습니다.');
  return res.json() as Promise<{
    data: { items: NoticeApiItem[]; page: number; totalPages: number };
  }>;
}

export async function fetchNoticeDetail(noticeId: number) {
  const res = await fetch(`${BASE_URL}/api/v1/notices/${noticeId}`);
  if (!res.ok) throw new Error('공지사항을 불러오지 못했습니다.');
  return res.json() as Promise<{ data: NoticeApiItem }>;
}

import type { NoticeApiItem, NoticeItem } from '../types/notice-types';

export const CATEGORY_LABEL: Record<NoticeApiItem['category'], string> = {
  IMPORTANT: '주요공지',
  GENERAL: '일반',
  FESTIVAL: '축제',
  CULTURE_PERFORMANCE: '문화공연',
  EVENT: '이벤트',
};

export const toNoticeItem = (item: NoticeApiItem): NoticeItem => {
  return {
    noticeId: item.noticeId,
    type: CATEGORY_LABEL[item.category],
    title: item.title,
    date: new Date(item.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    content: item.body,
  };
};

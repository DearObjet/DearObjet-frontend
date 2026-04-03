import { CATEGORY_LABEL } from '../constants/notice-constants';
import type { NoticeApiItem, NoticeItem } from '../types/notice-types';

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

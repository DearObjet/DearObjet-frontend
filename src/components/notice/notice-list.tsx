import React from 'react';

export interface NoticeItem {
  noticeId: number;
  type: string;
  title: string;
  date: string;
  content?: string;
}

export interface NoticeApiItem {
  noticeId: number;
  target: 'USER' | 'ARTIST_SHOP';
  category:
    | 'IMPORTANT'
    | 'GENERAL'
    | 'FESTIVAL'
    | 'CULTURE_PERFORMANCE'
    | 'EVENT';
  badge: string;
  title: string;
  body: string;
  createdAt: string;
  new: boolean;
}

export const CATEGORY_LABEL: Record<NoticeApiItem['category'], string> = {
  IMPORTANT: '주요공지',
  GENERAL: '일반',
  FESTIVAL: '축제',
  CULTURE_PERFORMANCE: '문화공연',
  EVENT: '이벤트',
};

export function toNoticeItem(item: NoticeApiItem): NoticeItem {
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
}

interface NoticeListProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

export const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  onSelectNotice,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {notices.map((notice) => (
        <button
          key={notice.noticeId}
          onClick={() => onSelectNotice(notice)}
          className="flex gap-5 border-b bg-white p-0 hover:border-white focus:outline-none"
        >
          <p className="flex h-[1.9375rem] w-[4.1875rem] flex-shrink-0 items-center justify-center rounded-2xl border border-gray-900 text-[0.8125rem] font-extrabold text-gray-900">
            {notice.type}
          </p>
          <p className="flex max-w-[278px] flex-1 items-center overflow-hidden whitespace-nowrap text-left text-sm text-gray-600">
            {notice.title}
          </p>
          <span className="ml-auto flex flex-shrink-0 items-center text-sm text-gray-400">
            {notice.date}
          </span>
        </button>
      ))}
    </div>
  );
};

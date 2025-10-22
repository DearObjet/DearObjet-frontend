import React from 'react';

export interface NoticeItem {
  id: number;
  type: string;
  title: string;
  date: string;
  content?: string;
}

interface NoticeListProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
  selectedId?: number;
}

export const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  onSelectNotice,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {notices.map((notice) => (
        <button
          key={notice.id}
          onClick={() => onSelectNotice(notice)}
          className={`flex gap-5 border-b bg-white hover:border-white focus:outline-none`}
        >
          <p className="flex-shrink-0 text-center text-base">{notice.id}</p>
          <p className="flex h-[1.9375rem] w-[4.1875rem] flex-shrink-0 items-center justify-center rounded-2xl bg-black text-[0.8125rem] font-extrabold text-white">
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

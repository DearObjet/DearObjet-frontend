import React from 'react';

export interface NoticeItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface NoticeListProps {
  notices: NoticeItem[];
}

export const NoticeList: React.FC<NoticeListProps> = ({ notices }) => {
  return (
    <div className="flex flex-col gap-2">
      {notices.map((notice) => (
        <button
          key={notice.id}
          className="flex gap-5 border-b border-white bg-white hover:border-b hover:border-white focus:outline-none"
        >
          <p className="flex-shrink-0 text-center text-base">{notice.id}</p>
          <p className="flex h-[1.9375rem] w-[4.1875rem] flex-shrink-0 items-center justify-center rounded-2xl bg-black text-[0.8125rem] font-extrabold text-white">
            {notice.title}
          </p>
          <p className="max-w-[278px] flex-1 overflow-hidden whitespace-nowrap text-left text-sm text-gray-600">
            {notice.description}
          </p>
          <span className="ml-auto flex flex-shrink-0 items-center text-sm text-gray-400">
            {notice.date}
          </span>
        </button>
      ))}
    </div>
  );
};

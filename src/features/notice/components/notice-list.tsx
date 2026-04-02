import type { NoticeItem } from '../types/notice-types';

interface NoticeListProps {
  notices: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

export const NoticeList = ({ notices, onSelectNotice }: NoticeListProps) => {
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

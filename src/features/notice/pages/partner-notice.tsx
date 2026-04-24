import { useState, useEffect } from 'react';

import { useGetNoticeDetailQuery, useGetNoticesQuery } from '../api/notice-api';
import type { NoticeItem } from '../types/notice-types';
import { toNoticeItem } from '../utils/notice-utils';
import { CommonNotice } from '../components/common-notice';

export const PartnerNotice = () => {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);

  const { data } = useGetNoticesQuery({
    target: 'ARTIST_SHOP',
    category: selectedCategory,
    page: currentPage,
  });

  const noticeData = data?.items.map(toNoticeItem) ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { data: noticeDetail } = useGetNoticeDetailQuery(selectedNoticeId!, {
    skip: selectedNoticeId === null,
  });

  useEffect(() => {
    if (noticeDetail) {
      setSelectedNotice(toNoticeItem(noticeDetail));
    }
  }, [noticeDetail]);

  const handleSelectNotice = (notice: NoticeItem) => {
    setSelectedNoticeId(notice.noticeId);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="grid h-full w-full flex-1 grid-cols-2 items-stretch gap-3 overflow-y-auto bg-gray-100">
      <CommonNotice
        target="ARTIST_SHOP"
        noticeData={noticeData}
        totalPages={totalPages}
        currentPage={currentPage}
        selectedCategory={selectedCategory}
        onPageChange={setCurrentPage}
        onCategoryChange={handleCategoryChange}
        onSelectNotice={handleSelectNotice}
      />

      <section className="flex h-full flex-col justify-between rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-10">
        <h3 className="hidden">공지사항</h3>
        {selectedNotice ? (
          <div>
            <div className="mb-4 flex justify-between pb-4">
              <h4 className="mt-2 text-base font-medium">
                {selectedNotice.title}
              </h4>
              <p className="mt-2 text-sm font-normal">{selectedNotice.date}</p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700">
              {selectedNotice.content}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            공지사항을 선택해주세요
          </div>
        )}
      </section>
    </div>
  );
};

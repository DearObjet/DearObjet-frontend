import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { useGetNoticeDetailQuery, useGetNoticesQuery } from '../api/notice-api';
import { toNoticeItem } from '../utils/notice-utils';
import type { NoticeItem } from '../types/notice-types';
import { CommonNotice } from '../components/common-notice';

export const CustomerNotice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const noticeId = searchParams.get('id');

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data } = useGetNoticesQuery({
    target: 'USER',
    category: selectedCategory,
    page: currentPage,
  });

  const noticeData = data?.items.map(toNoticeItem) ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { data: noticeDetail } = useGetNoticeDetailQuery(Number(noticeId), {
    skip: !noticeId,
  });

  const selectedNotice = noticeDetail ? toNoticeItem(noticeDetail) : null;

  const handleSelectNotice = (notice: NoticeItem) => {
    setSearchParams({ id: String(notice.noticeId) });
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleBack = () => {
    setSearchParams({});
  };

  return (
    <div className="flex h-full w-full justify-center">
      {!noticeId || !selectedNotice ? (
        <CommonNotice
          target="USER"
          noticeData={noticeData}
          totalPages={totalPages}
          currentPage={currentPage}
          selectedCategory={selectedCategory}
          onPageChange={setCurrentPage}
          onCategoryChange={handleCategoryChange}
          onSelectNotice={handleSelectNotice}
        />
      ) : (
        <section className="flex w-full flex-col gap-[3.0625rem]">
          <div className="h-[63.25rem] w-full overflow-y-scroll rounded-xl border border-gray-300 px-[4.5rem] py-[4.25rem] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-track]:my-12 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar]:w-1">
            <div className="mb-[5rem] flex justify-between">
              <h4 className="text-2xl font-medium">{selectedNotice.title}</h4>
              <p className="text-2xl font-normal">{selectedNotice.date}</p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700">
              {selectedNotice.content}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleBack}>공지 목록 보기</button>
          </div>
        </section>
      )}
    </div>
  );
};

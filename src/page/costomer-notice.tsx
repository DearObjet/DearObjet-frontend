import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { CommonNotice } from '../components/notice/common-notice';
import type { NoticeItem } from '../components/notice/notice-list';
import { toNoticeItem } from '../components/notice/notice-list';

import {
  useGetNoticesQuery,
  useGetNoticeDetailQuery,
} from '../store/api/notice-api';

export const CustomerNotice = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
    navigate('/');
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-1 flex-col bg-white">
        <header className="h-[4.5rem] w-full p-10 text-black"></header>
        <main className="h-full px-80">
          {!selectedNotice ? (
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
            <section className="my-10 h-full">
              <div className="border-gray-3 my-10 h-[68.5rem] w-full overflow-y-scroll rounded-xl border px-[4.5rem] py-[4.25rem] text-2xl [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-track]:my-12 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar]:w-1">
                <div className="mb-[5rem] flex justify-between">
                  <h4 className="font-medium">{selectedNotice.title}</h4>
                  <p className="font-normal">{selectedNotice.date}</p>
                </div>
                <div className="whitespace-pre-wrap text-gray-700">
                  {selectedNotice.content}
                </div>
              </div>

              <div className="mb-[4.9375rem] flex justify-end">
                <button onClick={handleBack}>공지 목록 보기</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

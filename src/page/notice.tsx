import { useState } from 'react';
import { NoticeList } from '../components/notice/notice-list';
import type { NoticeItem } from '../components/notice/notice-list';

import RightShiftIcon from '../assets/right-shift.svg';
import LeftShiftIcon from '../assets/left-shift.svg';
import TwoRightShiftIcon from '../assets/two-right-shift.svg';
import TwoLeftShiftIcon from '../assets/two-left-shift.svg';

const categories = ['전체', '이벤트', '일반', '이용안내'];

interface NoticeProps {
  noticeData: NoticeItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

function Notice({ noticeData, onSelectNotice }: NoticeProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredNotices =
    selectedCategory === '전체'
      ? noticeData
      : noticeData.filter((notice) => notice.type === selectedCategory);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirst, indexOfLast);

  const maxPageButtons = 5;
  const startPage =
    Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  const handlePageChange = (
    type: 'left' | 'right' | 'two-left' | 'two-right'
  ) => {
    switch (type) {
      case 'left':
        setCurrentPage(Math.max(startPage - maxPageButtons, 1));
        break;
      case 'right':
        setCurrentPage(Math.min(endPage + 1, totalPages));
        break;
      case 'two-left':
        setCurrentPage(1);
        break;
      case 'two-right':
        setCurrentPage(totalPages);
        break;
    }
  };

  return (
    <section className="flex flex-col justify-between rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-10">
      <div>
        <h3 className="hidden">공지사항 리스트</h3>
        <div className="mb-[2.6875rem] flex gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className="relative rounded-none bg-white text-sm font-medium text-gray-900 hover:border-white focus:outline-none"
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
            >
              {category}
              {selectedCategory === category && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-[58px] -translate-x-1/2 bg-gray-900"></span>
              )}
            </button>
          ))}
        </div>

        <NoticeList notices={currentNotices} onSelectNotice={onSelectNotice} />
      </div>

      {/* 페이지네이션 */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          className="rounded-none border-gray-300 bg-white px-3 py-1 text-gray-300 hover:border-gray-300 focus:outline-none"
          onClick={() => handlePageChange('two-left')}
        >
          <img
            src={TwoLeftShiftIcon}
            alt="이전 페이지 범위"
            className="inline h-[7.18px] w-auto"
          />
        </button>

        <button
          className="rounded-none border-gray-300 bg-white px-3 py-1 text-gray-300 hover:border-gray-300 focus:outline-none"
          onClick={() => handlePageChange('left')}
        >
          <img
            src={LeftShiftIcon}
            alt="1페이지 뒤로"
            className="inline h-[7.18px] w-[7.18px]"
          />
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
          <button
            key={startPage + i}
            className={`rounded-none border-gray-300 px-3 py-1 hover:border-gray-300 focus:outline-none ${
              currentPage === startPage + i
                ? 'bg-gray-100 text-gray-500'
                : 'bg-white text-gray-300'
            }`}
            onClick={() => setCurrentPage(startPage + i)}
          >
            {startPage + i}
          </button>
        ))}

        <button
          className="rounded-none border-gray-300 bg-white px-3 py-1 text-gray-300 hover:border-gray-300 focus:outline-none"
          onClick={() => handlePageChange('right')}
        >
          <img
            src={RightShiftIcon}
            alt="1페이지 앞으로"
            className="inline h-[7.18px] w-[7.18px]"
          />
        </button>

        <button
          className="rounded-none border-gray-300 bg-white px-3 py-1 text-gray-300 hover:border-gray-300 focus:outline-none"
          onClick={() => handlePageChange('two-right')}
        >
          <img
            src={TwoRightShiftIcon}
            alt="다음 페이지 범위"
            className="inline h-[7.18px] w-auto"
          />
        </button>
      </div>
    </section>
  );
}

export default Notice;

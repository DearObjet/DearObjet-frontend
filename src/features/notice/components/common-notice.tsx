import type { NoticeItem } from '../types/notice-types';

import { NoticeList } from './notice-list';

import RightShiftIcon from '../../../assets/right-shift.svg';
import LeftShiftIcon from '../../../assets/left-shift.svg';
import TwoRightShiftIcon from '../../../assets/two-right-shift.svg';
import TwoLeftShiftIcon from '../../../assets/two-left-shift.svg';

const USER_CATEGORIES = [
  { label: '전체', value: null },
  { label: '주요공지', value: 'IMPORTANT' },
  { label: '일반', value: 'GENERAL' },
  { label: '축제', value: 'FESTIVAL' },
  { label: '문화공연', value: 'CULTURE_PERFORMANCE' },
  { label: '이벤트', value: 'EVENT' },
] as const;

const ARTIST_SHOP_CATEGORIES = [
  { label: '전체', value: null },
  { label: '주요공지', value: 'IMPORTANT' },
  { label: '일반', value: 'GENERAL' },
] as const;

interface NoticeProps {
  target: 'USER' | 'ARTIST_SHOP';
  noticeData: NoticeItem[];
  totalPages: number;
  currentPage: number;
  selectedCategory: string | null;
  onPageChange: (page: number) => void;
  onCategoryChange: (category: string | null) => void;
  onSelectNotice: (notice: NoticeItem) => void;
}

export const CommonNotice = ({
  target,
  noticeData,
  totalPages,
  currentPage,
  selectedCategory,
  onPageChange,
  onCategoryChange,
  onSelectNotice,
}: NoticeProps) => {
  const categories =
    target === 'USER' ? USER_CATEGORIES : ARTIST_SHOP_CATEGORIES;

  const maxPageButtons = 5;
  const startPage =
    Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  const handlePageChange = (
    type: 'left' | 'right' | 'two-left' | 'two-right'
  ) => {
    switch (type) {
      case 'left':
        onPageChange(Math.max(startPage - maxPageButtons, 1));
        break;
      case 'right':
        onPageChange(Math.min(endPage + 1, totalPages));
        break;
      case 'two-left':
        onPageChange(1);
        break;
      case 'two-right':
        onPageChange(totalPages);
        break;
    }
  };

  return (
    <section className="flex flex-1 flex-col justify-between rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-10">
      {' '}
      <div className="flex flex-1 flex-col">
        <h3 className="hidden">공지사항 리스트</h3>
        <div className="mb-[2.6875rem] flex gap-4">
          {categories.map((category) => (
            <button
              key={category.label}
              className="relative rounded-none bg-white text-sm font-medium text-gray-900 hover:border-white focus:outline-none"
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
              {selectedCategory === category.value && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-[58px] -translate-x-1/2 bg-gray-900"></span>
              )}
            </button>
          ))}
        </div>

        {noticeData.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            등록된 공지사항이 없습니다
          </div>
        ) : (
          <NoticeList notices={noticeData} onSelectNotice={onSelectNotice} />
        )}
      </div>
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
            onClick={() => onPageChange(startPage + i)}
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
};

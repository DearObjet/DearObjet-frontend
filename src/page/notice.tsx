import { useState } from 'react';
import Aside from '../components/aside/aside';
import { NoticeList } from '../components/notice/notice-list';
import type { NoticeItem } from '../components/notice/notice-list';

import RightShiftIcon from '../assets/right-shift.svg';
import LeftShiftIcon from '../assets/left-shift.svg';
import TwoRightShiftIcon from '../assets/two-right-shift.svg';
import TwoLeftShiftIcon from '../assets/two-left-shift.svg';

const noticeData: NoticeItem[] = [
  {
    type: '주요공지',
    title: '[주요공지] 주요공지이이이이이이이',
    date: '2025.08.10',
    content:
      '[공지] 소품샵 플랫폼 운영 및 고객센터 안내\n\n 안녕하세요, 디어오브제 운영팀입니다.\n\n 저희 플랫폼을 이용해주시는 고객 및 판매자 여러분께 깊이 감사드립니다. \n소품샵은 창작자, 핸드메이드 작가, 감성 소품 판매자를 위한 전문 플랫폼으로, 고객과 판매자 모두에게 만족스러운 경험을 제공하기 위해 지속적으로 노력하고 있습니다.\n운영 시간 및 고객센터 안내는 아래 내용을 참고해주세요.\n\n■ 고객센터 운영시간\n · 평일: 오전 10시 ~ 오후 5시 (점심시간: 12시 ~ 1시) \n · 주말 및 공휴일: 휴무 \n · 문의 방법: [1:1 문의하기] 또는 contact@soopshop.co.kr \n■ 판매자 입점 안내 \n · 입점을 원하시는 분은 ‘판매자 신청’ 페이지를 통해 등록해주세요. \n · 승인은 영업일 기준 1~3일 이내 개별 연락드립니다. \n\n앞으로도 더 나은 서비스와 감성 가득한 상품들로 찾아뵙겠습니다.\n많은 관심과 사랑 부탁드립니다. 감사합니다! \n\n디어오브제 운영팀 드림',
  },
  {
    type: '이벤트',
    title: '이벤트이벤트이벤트이벤트이벤트이벤트',
    date: '2025.10.21',
    content: '이벤트 관련 상세 내용입니다.',
  },
  {
    type: '주요공지',
    title: '주요공지주요공지주요공지주요공지',
    date: '2025.10.21',
    content: '주요공지 관련 상세 내용입니다.',
  },
  {
    type: '일반',
    title: '일반일반일반일반일반일반',
    date: '2025.10.20',
    content: '일반 공지 상세 내용입니다.',
  },
  {
    type: '이용안내',
    title: '이용안내이용안내이용안내이용안내이용안내',
    date: '2025.10.21',
    content: '이용안내 관련 상세 내용입니다.',
  },
  {
    type: '이용안내',
    title: '이용안내이용안내이용안내이용안내이용안내',
    date: '2025.10.21',
    content: '이용안내 관련 상세 내용입니다.',
  },
];

const categories = ['전체', '이벤트', '일반', '이용안내'];

function Notice() {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(
    noticeData.find((notice) => notice.type === '주요공지') || null
  );
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
        setCurrentPage(Math.min(endPage, 1));
        break;
      case 'two-right':
        setCurrentPage(Math.max(startPage, totalPages));
        break;
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Aside />
      <div className="flex flex-1 flex-col">
        <header className="h-[4.5rem] w-full bg-white p-6 text-black">
          <h2>공지사항</h2>
        </header>
        <main className="grid w-full flex-1 grid-cols-2 gap-3 overflow-y-auto bg-gray-100 p-5 px-[3.625rem]">
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

              <NoticeList
                notices={currentNotices}
                onSelectNotice={setSelectedNotice}
              />
            </div>

            {/* 페이지네이션 */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {/* 4페이지 뒤로 */}
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

          <section className="flex flex-col justify-between rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-10">
            <h3 className="hidden">공지사항</h3>
            {selectedNotice ? (
              <div>
                <div className="mb-4 flex justify-between pb-4">
                  <h4 className="mt-2 text-base font-medium">
                    {selectedNotice.title}
                  </h4>
                  <p className="mt-2 text-sm font-normal">
                    {selectedNotice.date}
                  </p>
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
        </main>
      </div>
    </div>
  );
}

export default Notice;

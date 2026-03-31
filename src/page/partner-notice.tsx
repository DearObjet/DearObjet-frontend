import { useState } from 'react';
import Aside from '../components/aside/aside';
import CommonNotice from '../components/notice/common-notice';
import type { NoticeItem } from '../components/notice/notice-list';

const noticeData: NoticeItem[] = [
  {
    noticeId: 0,
    type: '주요공지',
    title: '[주요공지] 주요공지이이이이이이이',
    date: '2025.08.10',
    content:
      '[공지] 소품샵 플랫폼 운영 및 고객센터 안내\n\n안녕하세요, 디어오브제 운영팀입니다.\n\n저희 플랫폼을 이용해주시는 고객 및 판매자 여러분께 깊이 감사드립니다.\n소품샵은 창작자, 핸드메이드 작가, 감성 소품 판매자를 위한 전문 플랫폼으로, 고객과 판매자 모두에게 만족스러운 경험을 제공하기 위해 지속적으로 노력하고 있습니다.\n운영 시간 및 고객센터 안내는 아래 내용을 참고해주세요.\n\n■ 고객센터 운영시간\n· 평일: 오전 10시 ~ 오후 5시 (점심시간: 12시 ~ 1시)\n· 주말 및 공휴일: 휴무\n· 문의 방법: [1:1 문의하기] 또는 contact@soopshop.co.kr\n■ 판매자 입점 안내\n· 입점을 원하시는 분은 "판매자 신청" 페이지를 통해 등록해주세요.\n· 승인은 영업일 기준 1~3일 이내 개별 연락드립니다.\n\n앞으로도 더 나은 서비스와 감성 가득한 상품들로 찾아뵙겠습니다.\n많은 관심과 사랑 부탁드립니다. 감사합니다!\n\n디어오브제 운영팀 드림',
  },
  {
    noticeId: 1,
    type: '이벤트',
    title: '이벤트이벤트이벤트이벤트이벤트이벤트',
    date: '2025.10.21',
    content: '이벤트 관련 상세 내용입니다.',
  },
  {
    noticeId: 3,
    type: '주요공지',
    title: '주요공지주요공지주요공지주요공지',
    date: '2025.10.21',
    content: '주요공지 관련 상세 내용입니다.',
  },
  {
    noticeId: 4,
    type: '일반',
    title: '일반일반일반일반일반일반',
    date: '2025.10.20',
    content: '일반 공지 상세 내용입니다.',
  },
  {
    noticeId: 5,
    type: '이용안내',
    title: '이용안내이용안내이용안내이용안내이용안내',
    date: '2025.10.21',
    content: '이용안내 관련 상세 내용입니다.',
  },
  {
    noticeId: 6,
    type: '이용안내',
    title: '이용안내이용안내이용안내이용안내이용안내',
    date: '2025.10.21',
    content: '이용안내 관련 상세 내용입니다.',
  },
];

function PartnerNotice() {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(
    noticeData.find((notice) => notice.type === '주요공지') || null
  );

  return (
    <div className="flex h-screen w-screen">
      <Aside />
      <div className="flex flex-1 flex-col">
        <header className="h-[4.5rem] w-full bg-white p-6 text-black">
          <h2>공지사항</h2>
        </header>
        <main className="grid w-full flex-1 grid-cols-2 gap-3 overflow-y-auto bg-gray-100 p-5 px-[3.625rem]">
          <CommonNotice
            noticeData={noticeData}
            onSelectNotice={setSelectedNotice}
          />

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

export default PartnerNotice;

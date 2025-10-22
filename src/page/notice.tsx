// import React from 'react';
import Aside from '../components/aside/aside';
import { NoticeList } from '../components/notice/notice-list';

const noticeData = [
  {
    id: 1,
    title: '주요공지',
    description:
      '주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지주요공지',
    date: '2025.10.22',
  },
  {
    id: 2,
    title: '업데이트',
    description: '업데이트업데이트업데이트업데이트업데이트',
    date: '2025.10.21',
  },
  {
    id: 3,
    title: '점검 안내',
    description: '점검 안내점검 안내점검 안내점검 안내점검 안내점검 안내',
    date: '2025.10.20',
  },
];

function Notice() {
  return (
    <div className="flex h-screen w-screen">
      <Aside />
      <div className="flex flex-1 flex-col">
        <header className="h-[4.5rem] w-full bg-white p-6 text-black">
          <h2>공지사항</h2>
        </header>

        {/* 배경색 수정필요  */}
        <main className="grid w-full flex-1 grid-cols-2 gap-3 overflow-y-auto bg-gray-100 p-5 px-[3.625rem]">
          <section className="rounded-xl bg-white">
            <h3 className="hidden">공지사항 리스트</h3>
            <NoticeList notices={noticeData} />
          </section>

          <section className="rounded-xl bg-white">
            <h3 className="hidden">공지사항</h3>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Notice;

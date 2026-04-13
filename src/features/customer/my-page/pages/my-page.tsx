import { useState, type ReactElement } from 'react';

import { FavoriteShops } from '../components/favoriteshops';
import { MyInfo } from '../components/myinfo';
import { Reservations } from '../components/reservations';
import { MyPosts } from '../components/myposts';
import { Messages } from '../components/messages';

type Tab = 'bookmarks' | 'profile' | 'reservations' | 'posts' | 'messages';

const CONTENT_MAP: Record<Tab, ReactElement> = {
  bookmarks: <FavoriteShops />,
  profile: <MyInfo />,
  reservations: <Reservations />,
  posts: <MyPosts />,
  messages: <Messages />,
};

const NAV_ITEMS: { label: string; tab: Tab }[] = [
  { label: '내가 찜한 소품샵', tab: 'bookmarks' },
  { label: '내정보', tab: 'profile' },
  { label: '예약내역', tab: 'reservations' },
  { label: '내가 작성한 글', tab: 'posts' },
  { label: '메시지', tab: 'messages' },
];

export const MyPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('bookmarks');

  return (
    <div className="flex h-screen gap-3">
      <aside className="flex flex-col gap-4">
        <div className="flex h-[11.25rem] w-[22.375rem] items-center gap-5 rounded-[10px] border px-8">
          <img
            src=""
            alt="내 프로필 이미지"
            className="h-[5.625rem] w-[5.625rem] rounded-full border"
          />
          <div>
            <p>남현정</p>
            <p>아이디</p>
          </div>
        </div>

        <nav className="h-[26.5625rem] w-[22.375rem] border px-[2.9375rem] py-[4.1875rem] text-black">
          <ul>
            {NAV_ITEMS.map(({ label, tab }) => (
              <li key={tab}>
                <button onClick={() => setActiveTab(tab)}>{label}</button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div>{CONTENT_MAP[activeTab]}</div>
    </div>
  );
};

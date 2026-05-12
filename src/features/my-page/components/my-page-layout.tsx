import { useSearchParams } from 'react-router';
import type { ReactNode } from 'react';

const NAV_ITEMS = [
  { label: '내가 찜한 소품샵', tab: 'bookmarks' },
  { label: '내정보', tab: 'profile' },
  { label: '예약내역', tab: 'reservations' },
  { label: '내가 작성한 글', tab: 'posts' },
  { label: '메시지', tab: 'messages' },
];

export const MyPageLayout = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') ?? 'bookmarks';

  return (
    <div className="flex gap-9">
      <aside className="flex flex-col gap-4">
        <nav className="h-[26.5625rem] w-[22.375rem] border px-[2.9375rem] py-[4.1875rem]">
          <ul className="flex flex-col gap-[2.125rem]">
            {NAV_ITEMS.map(({ label, tab }) => (
              <li key={tab}>
                <button
                  onClick={() => setSearchParams({ tab })}
                  className={currentTab === tab ? 'font-bold' : 'text-black'}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
};

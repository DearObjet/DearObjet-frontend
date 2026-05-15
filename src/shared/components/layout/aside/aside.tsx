import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import {
  LayoutPanelTop,
  ClipboardList,
  Calculator,
  MessageCircleMore,
  Wallet,
  ShieldCheck,
  Bell,
  Settings,
} from 'lucide-react';

import type { RootState } from '../../../../app/store';

import { useGetMeQuery } from './api/user-me-api';
import { ROUTES } from '../../../constants';
import { UserProfile } from './user-profile';
import { Asidetab } from './aside-tab-menu';

import DearObjectWhiteLogo from '../../../../assets/dear-objet-white-logo.svg';

export const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const asideRef = useRef<HTMLElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const { data: userMe } = useGetMeQuery();

  const handleScroll = () => {
    const el = asideRef.current;
    if (!el) return;

    el.classList.add('is-scrolling');

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      el.classList.remove('is-scrolling');
    }, 500); // 스크롤 멈춘 뒤 500ms 후 사라짐
  };

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleClick = (path: string) => {
    setActiveMenu(path);
    navigate(path);
  };

  const handleComingSoon =
    (content: string = '') =>
    (e?: MouseEvent<HTMLButtonElement>) => {
      const EXCEPTION = '공지사항';
      if (content === EXCEPTION) return;
      e?.preventDefault();
      return alert(
        content
          ? `준비중인 서비스입니다. (${content})`
          : '준비중인 서비스입니다.'
      );
    };

  return (
    <aside
      ref={asideRef}
      onScroll={handleScroll}
      className="aside-scroll flex flex-col overflow-y-auto bg-black pb-[2.875rem] pl-[2.375rem] pr-[3.375rem] pt-[3.25rem] text-white"
    >
      <section className="flex items-center gap-2 text-[1.1875rem]">
        <img
          src={DearObjectWhiteLogo}
          alt="dear objet 로고"
          onClick={() => navigate('/')}
          className="cursor-pointer"
        />
        <h2 className="font-abril">my page</h2>
      </section>

      <nav className="mt-[3.375rem] flex flex-col gap-[1.9375rem]">
        <h2 className="font-abril text-sm">Manage</h2>

        <div className="flex flex-col gap-5">
          <Asidetab
            icon={LayoutPanelTop}
            label="관리 홈"
            className={
              activeMenu.startsWith(
                role === 'SHOP' ? '/shop/dashboard' : '/artist/dashboard'
              )
                ? 'text-white'
                : 'text-[#C1C1C1]'
            }
            onClick={() =>
              handleClick(
                role === 'SHOP'
                  ? ROUTES.SHOP_DASHBOARD
                  : ROUTES.ARTIST_DASHBOARD
              )
            }
          />
          <ul className="ml-14 flex list-disc flex-col gap-2 marker:text-sm marker:text-[#C1C1C1]">
            <li>
              <Asidetab
                label="대시보드"
                className={
                  activeMenu ===
                  (role === 'SHOP'
                    ? ROUTES.SHOP_DASHBOARD
                    : ROUTES.ARTIST_DASHBOARD)
                    ? 'text-white'
                    : 'text-[#C1C1C1]'
                }
                onClick={() =>
                  handleClick(
                    role === 'SHOP'
                      ? ROUTES.SHOP_DASHBOARD
                      : ROUTES.ARTIST_DASHBOARD
                  )
                }
              />
            </li>
            {role === 'SHOP' && (
              <>
                <li>
                  <Asidetab
                    label="나의 소품샵 관리"
                    className={
                      activeMenu === ROUTES.SHOP_MANAGE
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.SHOP_MANAGE)}
                  />
                </li>
                <li>
                  <Asidetab
                    label="클래스 예약 관리"
                    className={
                      activeMenu === ROUTES.SHOP_MANAGE_RESERVATIONS
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.SHOP_MANAGE_RESERVATIONS)}
                  />
                </li>
              </>
            )}
            {role === 'ARTIST' && (
              <li>
                <Asidetab
                  label="품목 및 재고 관리"
                  className={
                    activeMenu === ROUTES.ARTIST_INVENTORY
                      ? 'text-white'
                      : 'text-[#C1C1C1]'
                  }
                  onClick={() => handleClick(ROUTES.ARTIST_INVENTORY)}
                />
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <Asidetab
            icon={ClipboardList}
            label="입점관리"
            className={
              activeMenu.startsWith(
                role === 'SHOP' ? '/shop/artists' : '/artist/shops'
              )
                ? 'text-white'
                : 'text-[#C1C1C1]'
            }
            onClick={() =>
              handleClick(
                role === 'SHOP' ? ROUTES.SHOP_ARTISTS : ROUTES.ARTIST_SHOPS
              )
            }
          />
          <ul className="ml-14 flex list-disc flex-col gap-2 marker:text-sm marker:text-[#C1C1C1]">
            {role === 'SHOP' && (
              <>
                <li>
                  <Asidetab
                    label="작가 리스트"
                    className={
                      activeMenu === ROUTES.SHOP_ARTISTS
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.SHOP_ARTISTS)}
                  />
                </li>
                <li>
                  <Asidetab
                    label="품목 및 재고 관리"
                    className={
                      activeMenu === ROUTES.SHOP_INVENTORY
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.SHOP_INVENTORY)}
                  />
                </li>
                <li>
                  <Asidetab
                    label="계약서 관리"
                    className={
                      activeMenu === ROUTES.SHOP_CONTRACTS
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.SHOP_CONTRACTS)}
                  />
                </li>
              </>
            )}
            {role === 'ARTIST' && (
              <>
                <li>
                  <Asidetab
                    label="입점처 리스트"
                    className={
                      activeMenu === ROUTES.ARTIST_SHOPS
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.ARTIST_SHOPS)}
                  />
                </li>
                <li>
                  <Asidetab
                    label="출고관리"
                    className={
                      activeMenu === ROUTES.ARTIST_SHIPMENTS
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.ARTIST_SHIPMENTS)}
                  />
                </li>
                <li>
                  <Asidetab
                    label="계약서 관리"
                    className={
                      activeMenu === ROUTES.ARTIST_CONTRACTS
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() => handleClick(ROUTES.ARTIST_CONTRACTS)}
                  />
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <Asidetab
            icon={Calculator}
            label="정산관리"
            className={
              activeMenu.startsWith(
                role === 'SHOP'
                  ? '/shop/settlement-calculation'
                  : '/artist/settlement-management'
              )
                ? 'text-white'
                : 'text-[#C1C1C1]'
            }
            onClick={() =>
              handleClick(
                role === 'SHOP'
                  ? ROUTES.SHOP_SETTLEMENT_CALCULATION
                  : ROUTES.ARTIST_SETTLEMENT_MANAGEMENT
              )
            }
          />
          <ul className="ml-14 flex list-disc flex-col gap-2 marker:text-sm marker:text-[#C1C1C1]">
            {role === 'SHOP' && (
              <>
                <li>
                  <Asidetab
                    label="정산금액 계산"
                    className={
                      activeMenu === ROUTES.SHOP_SETTLEMENT_CALCULATION
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() =>
                      handleClick(ROUTES.SHOP_SETTLEMENT_CALCULATION)
                    }
                  />
                </li>
                <li>
                  <Asidetab
                    label="세금계산서 발행"
                    focusable={false}
                    onClick={handleComingSoon('세금계산서 발행')}
                  />
                </li>
                <li>
                  <Asidetab
                    label="정산내역"
                    focusable={false}
                    onClick={() => handleClick(ROUTES.SHOP_SETTLEMENT_HISTORY)}
                  />
                </li>
              </>
            )}
            {role === 'ARTIST' && (
              <>
                <li>
                  <Asidetab
                    label="정산관리"
                    className={
                      activeMenu === ROUTES.ARTIST_SETTLEMENT_MANAGEMENT
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() =>
                      handleClick(ROUTES.ARTIST_SETTLEMENT_MANAGEMENT)
                    }
                  />
                </li>
                <li>
                  <Asidetab
                    label="정산 내역"
                    className={
                      activeMenu === ROUTES.ARTIST_SETTLEMENTS_HISTORY
                        ? 'text-white'
                        : 'text-[#C1C1C1]'
                    }
                    onClick={() =>
                      handleClick(ROUTES.ARTIST_SETTLEMENTS_HISTORY)
                    }
                  />
                </li>
                <li>
                  <Asidetab
                    label="세금계산서 발행"
                    focusable={false}
                    onClick={handleComingSoon('세금계산서 발행')}
                  />
                </li>
              </>
            )}
          </ul>
        </div>

        <Asidetab
          icon={MessageCircleMore}
          label="메시지"
          className={
            activeMenu.startsWith(
              role === 'SHOP' ? '/shop/messages' : '/artist/messages'
            )
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() =>
            handleClick(
              role === 'SHOP' ? ROUTES.SHOP_MESSAGES : ROUTES.ARTIST_MESSAGES
            )
          }
        />

        <Asidetab
          icon={Wallet}
          label="결제관리"
          focusable={false}
          onClick={handleComingSoon('결제관리')}
        />

        <Asidetab
          icon={ShieldCheck}
          label="개인정보"
          className={
            activeMenu.startsWith(
              role === 'SHOP' ? '/shop/profile' : '/artist/profile'
            )
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() =>
            handleClick(
              role === 'SHOP' ? ROUTES.SHOP_PROFILE : ROUTES.ARTIST_PROFILE
            )
          }
        />
      </nav>

      <section className="mt-[3.375rem] flex flex-col gap-[1.9375rem]">
        <h2 className="font-abril text-sm">Configuration</h2>
        <Asidetab
          icon={Bell}
          label="공지사항"
          className={
            activeMenu.startsWith(
              role === 'SHOP' ? '/shop/notices' : '/artist/notices'
            )
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() =>
            handleClick(
              role === 'SHOP' ? ROUTES.SHOP_NOTICES : ROUTES.ARTIST_NOTICES
            )
          }
        />
        <Asidetab
          icon={Settings}
          label="환경설정"
          className={
            activeMenu.startsWith(
              role === 'SHOP' ? '/shop/settings' : '/artist/settings'
            )
              ? 'text-white'
              : 'text-[#C1C1C1]'
          }
          onClick={() =>
            handleClick(
              role === 'SHOP' ? ROUTES.SHOP_SETTINGS : ROUTES.ARTIST_SETTINGS
            )
          }
        />
      </section>

      <UserProfile
        className="mt-10"
        variant="aside"
        userName={userMe?.name ?? ''}
        userId={userMe?.email}
        userImage={userMe?.profileUrl ?? undefined}
      />
    </aside>
  );
};

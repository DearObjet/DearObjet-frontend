import KakaoLogo from './assets/kakao-logo.svg';

import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { Signup } from './auth/sign-up';
import { OAuthCallback } from './auth/oauth-callback';
import { setThemeMode, setSystemTheme } from './store/slices/theme-slice';
import { Button } from './components/ui/button';
import {
  useGetSystemThemeQuery,
  useGetUserThemeQuery,
} from './store/api/theme-api';
import { ThemeCustomizer } from './page/admin/theme-customizer';

const MainPage = () => {
  const [currentNoticePage, setCurrentNoticePage] = useState(1);
  const noticesPerPage = 5;

  const regions = [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'incheon', label: '인천' },
  ];

  const allNotices = [
    { category: '공지', content: '10/20-10/22 KTX 반값!' },
    { category: '부산', content: '황금연휴, ‘공짜’로 부산가기 이벤트!' },
    { category: '이벤트', content: '선착순 EVENT 케이팝데몬헌터스 굿즈' },
    { category: '축제', content: '단풍의 계절 10월 “청도 단풍 축제”' },
    {
      category: '문화공연',
      content: '광안리 oo만명 인파 드론이 수놓은 한글날',
    },
  ];

  const totalNoticePages = Math.ceil(allNotices.length / noticesPerPage);

  const currentNotices = allNotices.slice(
    (currentNoticePage - 1) * noticesPerPage,
    currentNoticePage * noticesPerPage
  );

  const handleNoticePrevPage = () => {
    if (currentNoticePage > 1) {
      setCurrentNoticePage(currentNoticePage - 1);
    }
  };

  const handleNoticeNextPage = () => {
    if (currentNoticePage < totalNoticePages) {
      setCurrentNoticePage(currentNoticePage + 1);
    }
  };

  // 카카오 시작하기 버튼 눌렀을 때
  const handleKakaoLogin = () => {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className="flex min-h-screen w-[120rem] items-center justify-center gap-3">
      <div className="flex gap-3">
        <div className="flex w-[62.68rem] flex-col gap-3">
          <section className="flex h-[20.93rem] w-full items-center justify-center rounded-sm border border-gray-300">
            <h2>캐러셀 배너</h2>
          </section>

          <section className="grid h-[43rem] w-full grid-cols-2 gap-3">
            <h2 className="hidden">포스트</h2>
            <div className="rounded-sm border border-gray-300">포스트</div>
            <div className="rounded-sm border border-gray-300">포스트</div>
            <div className="rounded-sm border border-gray-300">포스트</div>
            <div className="rounded-sm border border-gray-300">포스트</div>
          </section>
        </div>

        <aside className="flex w-[17.125rem] flex-col gap-3">
          <section className="flex h-[15.0625rem] w-full flex-col justify-center gap-6 rounded-sm border border-gray-300">
            <h2 className="hidden">회원가입</h2>
            <div className="flex flex-col items-center gap-5">
              <p className="text-center text-base font-semibold">
                지금 가입해서{' '}
                <span className="font-extrabold">전국의 소품샵</span>을 <br />
                <span className="font-extrabold">한눈에 확인</span>하세요!
              </p>

              <div className="relative inline-block rounded-[12.5px] border border-gray-200 bg-white px-3 py-1 shadow-[0_1px_0_0_rgba(0,0,0,0.25)] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white after:drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
                <p className="text-xs font-medium">
                  <span className="font-semibold">3초안에</span> 빠른 회원가입
                </p>
              </div>

              <button
                className="flex w-[13.25rem] items-center justify-center gap-2 rounded-sm bg-[#FEE500] py-2 text-xs font-bold"
                onClick={handleKakaoLogin}
              >
                카카오로 시작하기
                <img src={KakaoLogo} alt="dear objet 로고" />
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="hidden">축제</h2>
            <div className="flex items-center rounded-sm border border-gray-300 px-7 py-2">
              <p className="pr-8 text-xs">지역</p>
              <div className="relative">
                <select className="appearance-none pr-6 text-sm font-extrabold">
                  {regions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>

            <div className="h-[15.75rem] bg-gray-200"></div>

            <div className="flex gap-10 self-center">
              <Button variant="icon" icon={<ChevronLeft />} />
              <Button variant="icon" icon={<ChevronRight />} />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2>공지&이벤트</h2>
            <div className="w-full rounded-sm border border-gray-300 p-3">
              <div className="flex flex-col gap-3">
                {currentNotices.map((notice, index) => (
                  <div key={index} className="flex text-[0.625rem] font-normal">
                    <span className="w-12 shrink-0 text-center">
                      {notice.category}
                    </span>
                    <span className="truncate text-left">{notice.content}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative flex items-center gap-10 self-center after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm after:content-[attr(data-page)]"
              data-page={`${currentNoticePage}/${totalNoticePages}`}
            >
              <Button
                variant="icon"
                icon={<ChevronLeft />}
                onClick={handleNoticePrevPage}
                disabled={currentNoticePage === 1}
              />
              <Button
                variant="icon"
                icon={<ChevronRight />}
                onClick={handleNoticeNextPage}
                disabled={currentNoticePage === totalNoticePages}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = true;
  const themeMode = useAppSelector((state) => state.theme.mode);

  // 시스템 테마 로드 (모든 사용자)
  const { data: systemTheme, isSuccess } = useGetSystemThemeQuery();

  // 사용자 다크모드 설정 로드 (로그인 시만)
  const { data: userTheme } = useGetUserThemeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // 초기 다크모드 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  // 시스템 테마 적용
  useEffect(() => {
    if (isSuccess && systemTheme) {
      dispatch(setSystemTheme(systemTheme));
    }
  }, [systemTheme, isSuccess, dispatch]);

  // 사용자 다크모드 적용
  useEffect(() => {
    if (userTheme) {
      dispatch(setThemeMode(userTheme.mode));
    }
  }, [userTheme, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/admin" element={<ThemeCustomizer />} />
    </Routes>
  );
};

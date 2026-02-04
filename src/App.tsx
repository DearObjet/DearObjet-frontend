import './App.css';
import { Routes, Route, useNavigate } from 'react-router';
import Counter from './components/Counter';
import { Button } from './components/ui/button';
import { Signup } from './auth/sign-up';
import Aside from './components/aside/aside';
import ShopArtistNotice from './page/shop-artist-notice';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setThemeMode, setSystemTheme } from './store/slices/themeSlice';
import {
  useGetSystemThemeQuery,
  useGetUserThemeQuery,
} from './store/api/themeApi';
import { ThemeCustomizer } from './page/admin/theme-customizer';

function MainPage() {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Aside />
      <div className="rounded-lg bg-card p-8 shadow-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-foreground">
          moduLapProject
        </h1>
        <Counter />
        <div className="mt-6 space-y-4">
          <Button
            variant="primary"
            size="medium"
            label="회원가입"
            onClick={handleSignupClick}
          />
          <Button
            variant="secondaryLight"
            size="medium"
            label="Secondary Light"
            onClick={() => {}}
          />
          <Button
            variant="secondaryDark"
            size="medium"
            label="Secondary Dark"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
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
      <Route path="/shop-artist-notice" element={<ShopArtistNotice />} />
      <Route path="/admin" element={<ThemeCustomizer />} />
    </Routes>
  );
}

export default App;

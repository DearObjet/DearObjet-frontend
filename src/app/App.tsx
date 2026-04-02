import { useEffect } from 'react';
import { Routes, Route } from 'react-router';

import { useAppDispatch, useAppSelector } from './hooks';
import {
  useGetSystemThemeQuery,
  useGetUserThemeQuery,
} from '../features/admin/theme/api/theme-api';
import {
  setSystemTheme,
  setThemeMode,
} from '../features/admin/theme/slices/theme-slice';

import { HomePage } from '../pages/home/home-page';
import { Signup } from '../features/signup/pages/sign-up';
import { OAuthCallback } from '../features/auth/pages/oauth-callback';
import { ThemeCustomizer } from '../features/admin/theme/pages/theme-customizer';

import '../App.css';

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
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/admin" element={<ThemeCustomizer />} />
    </Routes>
  );
};

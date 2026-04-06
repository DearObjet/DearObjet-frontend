import { useEffect } from 'react';
import { Routes, Route } from 'react-router';

import { useAppDispatch, useAppSelector } from './hooks';

import {
  useGetSystemThemeQuery,
  useGetUserThemeQuery,
  setSystemTheme,
  setThemeMode,
  ThemeCustomizer,
} from '../features/admin/theme';

import { HomePage } from '../pages/home/home-page';
import { Signup } from '../features/signup';
import {
  OAuthCallback,
  setUser,
  useGetCurrentUserQuery,
} from '../features/auth';

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

  const { data: user, isSuccess: isUserSuccess } = useGetCurrentUserQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );

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

  // 사용자 정보 저장
  useEffect(() => {
    if (isUserSuccess && user) {
      dispatch(setUser(user));
    }
  }, [isUserSuccess, user, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/admin" element={<ThemeCustomizer />} />
    </Routes>
  );
};

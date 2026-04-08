import { useEffect } from 'react';
import { RouterProvider } from 'react-router';

import { useAppDispatch, useAppSelector } from './hooks';

import {
  setAccessToken,
  setUser,
  useGetCurrentUserQuery,
  useRefreshTokenOnInitQuery,
} from '../features/auth';
import {
  useGetSystemThemeQuery,
  useGetUserThemeQuery,
  setSystemTheme,
  setThemeMode,
} from '../features/admin/theme';

import { router } from './router';

import '../App.css';

export const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const themeMode = useAppSelector((state) => state.theme.mode);

  const { data: refreshData } = useRefreshTokenOnInitQuery();
  const { data: systemTheme, isSuccess } = useGetSystemThemeQuery();

  const { data: userTheme } = useGetUserThemeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  // init
  useEffect(() => {
    if (refreshData?.accessToken) {
      dispatch(setAccessToken(refreshData.accessToken));
    }
  }, [refreshData, dispatch]);

  // 유저정보 조회
  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch]);

  // 초기 다크모드 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  // 사용자 다크모드
  useEffect(() => {
    if (userTheme) {
      dispatch(setThemeMode(userTheme.mode));
    }
  }, [userTheme, dispatch]);

  // 시스템 테마
  useEffect(() => {
    if (isSuccess && systemTheme) {
      dispatch(setSystemTheme(systemTheme));
    }
  }, [systemTheme, isSuccess, dispatch]);

  return <RouterProvider router={router} />;
};

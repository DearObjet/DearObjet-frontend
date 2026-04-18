import { useEffect } from 'react';
import { RouterProvider } from 'react-router';

import { useAppDispatch, useAppSelector } from './hooks';

import {
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

  // 세션 복구
  const { isLoading: isSessionLoading } = useRefreshTokenOnInitQuery();

  // 유저 정보 조회
  const { isLoading: isUserLoading } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  const { data: systemTheme, isSuccess } = useGetSystemThemeQuery();

  const { data: userTheme } = useGetUserThemeQuery(undefined, {
    skip: !isAuthenticated,
  });

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

  // 세션 복구 또는 유저 정보 로딩 중
  const isInitializing = isSessionLoading || (!!accessToken && isUserLoading);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-300 border-t-theme-900" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

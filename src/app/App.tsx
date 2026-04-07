import { useEffect } from 'react';
import { RouterProvider } from 'react-router';

import { useAppDispatch, useAppSelector } from './hooks';

import {
  useGetSystemThemeQuery,
  useGetUserThemeQuery,
} from '../features/admin/theme';
import {
  setSystemTheme,
  setThemeMode,
} from '../features/admin/theme/slices/theme-slice';

import { router } from './router';

import '../App.css';

export const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = true;
  const themeMode = useAppSelector((state) => state.theme.mode);

  const { data: systemTheme, isSuccess } = useGetSystemThemeQuery();

  const { data: userTheme } = useGetUserThemeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // 초기 다크모드
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

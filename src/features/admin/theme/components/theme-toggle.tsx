import { Moon, Sun } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../app/hooks';

import { toggleTheme } from '../slices/theme-slice';
import { useUpdateUserThemeMutation } from '../api/theme-api';

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  // const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const isAuthenticated = true;
  const [updateUserTheme] = useUpdateUserThemeMutation();

  const handleToggle = async () => {
    dispatch(toggleTheme());

    // 로그인 상태면 서버에도 저장
    if (isAuthenticated) {
      const newMode = mode === 'light' ? 'dark' : 'light';
      try {
        await updateUserTheme({ mode: newMode });
      } catch (error) {
        console.error('테마 저장 실패:', error);
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="hover:bg-accent/10 rounded-lg border border-border bg-card p-2 transition-colors"
      aria-label="테마 전환"
    >
      {mode === 'light' ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
};

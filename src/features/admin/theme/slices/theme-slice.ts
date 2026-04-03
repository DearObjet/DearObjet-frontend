import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SystemTheme } from '../types/theme-types';

import { DEFAULT_SYSTEM_THEME } from '../constants/default-theme';

interface ThemeState {
  mode: 'light' | 'dark';
  systemTheme: SystemTheme;
}

const loadInitialTheme = (): SystemTheme => {
  try {
    const stored = localStorage.getItem('system-theme');
    if (!stored) return DEFAULT_SYSTEM_THEME;

    const parsed = JSON.parse(stored);

    if (
      parsed.primary?.default &&
      parsed.secondaryLight?.default &&
      parsed.secondaryDark?.default &&
      parsed.theme
    ) {
      return parsed;
    }

    console.warn('Invalid theme structure in localStorage, using default');
    return DEFAULT_SYSTEM_THEME;
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return DEFAULT_SYSTEM_THEME;
  }
};

const initialState: ThemeState = {
  mode: (localStorage.getItem('theme-mode') as 'light' | 'dark') || 'light',
  systemTheme: loadInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },

    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      localStorage.setItem('theme-mode', action.payload);
      document.documentElement.classList.toggle(
        'dark',
        action.payload === 'dark'
      );
    },

    setSystemTheme: (state, action: PayloadAction<SystemTheme>) => {
      state.systemTheme = action.payload;
      applyThemeToDOM(action.payload);
    },

    resetToDefaultTheme: (state) => {
      state.systemTheme = DEFAULT_SYSTEM_THEME;
      localStorage.removeItem('system-theme');
      applyThemeToDOM(DEFAULT_SYSTEM_THEME);
    },
  },
});

const applyThemeToDOM = (theme: SystemTheme): void => {
  if (
    !theme ||
    !theme.primary ||
    !theme.secondaryLight ||
    !theme.secondaryDark ||
    !theme.theme
  ) {
    console.error('Invalid theme structure');
    return;
  }

  const root = document.documentElement;

  try {
    // Primary
    root.style.setProperty(
      '--color-primary-bg',
      theme.primary.default?.bg || '83 152 255'
    );
    root.style.setProperty(
      '--color-primary-border',
      theme.primary.default?.border || '83 152 255'
    );
    root.style.setProperty(
      '--color-primary-text',
      theme.primary.default?.text || '255 255 255'
    );
    root.style.setProperty(
      '--color-primary-hover-bg',
      theme.primary.hover?.bg || '83 152 255'
    );
    root.style.setProperty(
      '--color-primary-hover-border',
      theme.primary.hover?.border || '41 121 255'
    );
    root.style.setProperty(
      '--color-primary-hover-text',
      theme.primary.hover?.text || '255 255 255'
    );
    root.style.setProperty(
      '--color-primary-active-bg',
      theme.primary.active?.bg || '41 121 255'
    );
    root.style.setProperty(
      '--color-primary-active-border',
      theme.primary.active?.border || '41 121 255'
    );
    root.style.setProperty(
      '--color-primary-active-text',
      theme.primary.active?.text || '255 255 255'
    );
    root.style.setProperty(
      '--color-primary-disabled-bg',
      theme.primary.disabled?.bg || '224 224 224'
    );
    root.style.setProperty(
      '--color-primary-disabled-border',
      theme.primary.disabled?.border || '224 224 224'
    );
    root.style.setProperty(
      '--color-primary-disabled-text',
      theme.primary.disabled?.text || '255 255 255'
    );

    // Secondary Light
    root.style.setProperty(
      '--color-secondary-light-bg',
      theme.secondaryLight.default?.bg || '255 255 255'
    );
    root.style.setProperty(
      '--color-secondary-light-border',
      theme.secondaryLight.default?.border || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-light-text',
      theme.secondaryLight.default?.text || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-light-hover-bg',
      theme.secondaryLight.hover?.bg || '245 245 245'
    );
    root.style.setProperty(
      '--color-secondary-light-hover-border',
      theme.secondaryLight.hover?.border || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-light-hover-text',
      theme.secondaryLight.hover?.text || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-light-active-bg',
      theme.secondaryLight.active?.bg || '224 224 224'
    );
    root.style.setProperty(
      '--color-secondary-light-active-border',
      theme.secondaryLight.active?.border || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-light-active-text',
      theme.secondaryLight.active?.text || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-light-disabled-bg',
      theme.secondaryLight.disabled?.bg || '255 255 255'
    );
    root.style.setProperty(
      '--color-secondary-light-disabled-border',
      theme.secondaryLight.disabled?.border || '224 224 224'
    );
    root.style.setProperty(
      '--color-secondary-light-disabled-text',
      theme.secondaryLight.disabled?.text || '224 224 224'
    );

    // Secondary Dark
    root.style.setProperty(
      '--color-secondary-dark-bg',
      theme.secondaryDark.default?.bg || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-dark-border',
      theme.secondaryDark.default?.border || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-dark-text',
      theme.secondaryDark.default?.text || '255 255 255'
    );
    root.style.setProperty(
      '--color-secondary-dark-hover-bg',
      theme.secondaryDark.hover?.bg || '97 97 97'
    );
    root.style.setProperty(
      '--color-secondary-dark-hover-border',
      theme.secondaryDark.hover?.border || '33 33 33'
    );
    root.style.setProperty(
      '--color-secondary-dark-hover-text',
      theme.secondaryDark.hover?.text || '255 255 255'
    );
    root.style.setProperty(
      '--color-secondary-dark-active-bg',
      theme.secondaryDark.active?.bg || '0 0 0'
    );
    root.style.setProperty(
      '--color-secondary-dark-active-border',
      theme.secondaryDark.active?.border || '0 0 0'
    );
    root.style.setProperty(
      '--color-secondary-dark-active-text',
      theme.secondaryDark.active?.text || '255 255 255'
    );
    root.style.setProperty(
      '--color-secondary-dark-disabled-bg',
      theme.secondaryDark.disabled?.bg || '227 227 227'
    );
    root.style.setProperty(
      '--color-secondary-dark-disabled-border',
      theme.secondaryDark.disabled?.border || '227 227 227'
    );
    root.style.setProperty(
      '--color-secondary-dark-disabled-text',
      theme.secondaryDark.disabled?.text || '158 158 158'
    );

    // Theme Colors
    root.style.setProperty(
      '--color-theme-100',
      theme.theme[100] || '245 245 245'
    );
    root.style.setProperty(
      '--color-theme-200',
      theme.theme[200] || '227 227 227'
    );
    root.style.setProperty(
      '--color-theme-300',
      theme.theme[300] || '179 179 179'
    );
    root.style.setProperty(
      '--color-theme-500',
      theme.theme[500] || '158 158 158'
    );
    root.style.setProperty('--color-theme-700', theme.theme[700] || '97 97 97');
    root.style.setProperty('--color-theme-900', theme.theme[900] || '33 33 33');
  } catch (error) {
    console.error('Error applying theme to DOM:', error);
  }
};

export const {
  toggleTheme,
  setThemeMode,
  setSystemTheme,
  resetToDefaultTheme,
} = themeSlice.actions;
export default themeSlice.reducer;

import type { SystemTheme } from '../types/theme-types';

export const DEFAULT_SYSTEM_THEME: SystemTheme = {
  primary: {
    default: { bg: '83 152 255', border: '83 152 255', text: '255 255 255' },
    hover: { bg: '83 152 255', border: '41 121 255', text: '255 255 255' },
    active: { bg: '41 121 255', border: '41 121 255', text: '255 255 255' },
    disabled: { bg: '224 224 224', border: '224 224 224', text: '255 255 255' },
  },
  secondaryLight: {
    default: { bg: '255 255 255', border: '33 33 33', text: '33 33 33' },
    hover: { bg: '245 245 245', border: '33 33 33', text: '33 33 33' },
    active: { bg: '224 224 224', border: '33 33 33', text: '33 33 33' },
    disabled: { bg: '255 255 255', border: '224 224 224', text: '224 224 224' },
  },
  secondaryDark: {
    default: { bg: '33 33 33', border: '33 33 33', text: '255 255 255' },
    hover: { bg: '97 97 97', border: '33 33 33', text: '255 255 255' },
    active: { bg: '0 0 0', border: '0 0 0', text: '255 255 255' },
    disabled: { bg: '227 227 227', border: '227 227 227', text: '158 158 158' },
  },
  theme: {
    100: '245 245 245',
    200: '227 227 227',
    300: '179 179 179',
    500: '158 158 158',
    700: '97 97 97',
    900: '33 33 33',
  },
};

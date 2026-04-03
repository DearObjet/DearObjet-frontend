export interface ButtonStateColors {
  bg: string;
  border: string;
  text: string;
}

export interface ButtonVariantColors {
  default: ButtonStateColors;
  hover: ButtonStateColors;
  active: ButtonStateColors;
  disabled: ButtonStateColors;
}

export interface ThemeColors {
  100: string;
  200: string;
  300: string;
  500: string;
  700: string;
  900: string;
}

export interface SystemTheme {
  primary: ButtonVariantColors;
  secondaryLight: ButtonVariantColors;
  secondaryDark: ButtonVariantColors;
  theme: ThemeColors;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        orange: 'rgb(var(--color-orange) / <alpha-value>)',

        // Primary Button
        'primary-bg': 'rgb(var(--color-primary-bg) / <alpha-value>)',
        'primary-border': 'rgb(var(--color-primary-border) / <alpha-value>)',
        'primary-text': 'rgb(var(--color-primary-text) / <alpha-value>)',
        'primary-hover-bg':
          'rgb(var(--color-primary-hover-bg) / <alpha-value>)',
        'primary-hover-border':
          'rgb(var(--color-primary-hover-border) / <alpha-value>)',
        'primary-hover-text':
          'rgb(var(--color-primary-hover-text) / <alpha-value>)',
        'primary-active-bg':
          'rgb(var(--color-primary-active-bg) / <alpha-value>)',
        'primary-active-border':
          'rgb(var(--color-primary-active-border) / <alpha-value>)',
        'primary-active-text':
          'rgb(var(--color-primary-active-text) / <alpha-value>)',
        'primary-disabled-bg':
          'rgb(var(--color-primary-disabled-bg) / <alpha-value>)',
        'primary-disabled-border':
          'rgb(var(--color-primary-disabled-border) / <alpha-value>)',
        'primary-disabled-text':
          'rgb(var(--color-primary-disabled-text) / <alpha-value>)',

        // Secondary Light Button
        'secondary-light-bg':
          'rgb(var(--color-secondary-light-bg) / <alpha-value>)',
        'secondary-light-border':
          'rgb(var(--color-secondary-light-border) / <alpha-value>)',
        'secondary-light-text':
          'rgb(var(--color-secondary-light-text) / <alpha-value>)',
        'secondary-light-hover-bg':
          'rgb(var(--color-secondary-light-hover-bg) / <alpha-value>)',
        'secondary-light-hover-border':
          'rgb(var(--color-secondary-light-hover-border) / <alpha-value>)',
        'secondary-light-hover-text':
          'rgb(var(--color-secondary-light-hover-text) / <alpha-value>)',
        'secondary-light-active-bg':
          'rgb(var(--color-secondary-light-active-bg) / <alpha-value>)',
        'secondary-light-active-border':
          'rgb(var(--color-secondary-light-active-border) / <alpha-value>)',
        'secondary-light-active-text':
          'rgb(var(--color-secondary-light-active-text) / <alpha-value>)',
        'secondary-light-disabled-bg':
          'rgb(var(--color-secondary-light-disabled-bg) / <alpha-value>)',
        'secondary-light-disabled-border':
          'rgb(var(--color-secondary-light-disabled-border) / <alpha-value>)',
        'secondary-light-disabled-text':
          'rgb(var(--color-secondary-light-disabled-text) / <alpha-value>)',

        // Secondary Dark Button
        'secondary-dark-bg':
          'rgb(var(--color-secondary-dark-bg) / <alpha-value>)',
        'secondary-dark-border':
          'rgb(var(--color-secondary-dark-border) / <alpha-value>)',
        'secondary-dark-text':
          'rgb(var(--color-secondary-dark-text) / <alpha-value>)',
        'secondary-dark-hover-bg':
          'rgb(var(--color-secondary-dark-hover-bg) / <alpha-value>)',
        'secondary-dark-hover-border':
          'rgb(var(--color-secondary-dark-hover-border) / <alpha-value>)',
        'secondary-dark-hover-text':
          'rgb(var(--color-secondary-dark-hover-text) / <alpha-value>)',
        'secondary-dark-active-bg':
          'rgb(var(--color-secondary-dark-active-bg) / <alpha-value>)',
        'secondary-dark-active-border':
          'rgb(var(--color-secondary-dark-active-border) / <alpha-value>)',
        'secondary-dark-active-text':
          'rgb(var(--color-secondary-dark-active-text) / <alpha-value>)',
        'secondary-dark-disabled-bg':
          'rgb(var(--color-secondary-dark-disabled-bg) / <alpha-value>)',
        'secondary-dark-disabled-border':
          'rgb(var(--color-secondary-dark-disabled-border) / <alpha-value>)',
        'secondary-dark-disabled-text':
          'rgb(var(--color-secondary-dark-disabled-text) / <alpha-value>)',

        // Theme Colors
        theme: {
          100: 'rgb(var(--color-theme-100) / <alpha-value>)',
          200: 'rgb(var(--color-theme-200) / <alpha-value>)',
          300: 'rgb(var(--color-theme-300) / <alpha-value>)',
          500: 'rgb(var(--color-theme-500) / <alpha-value>)',
          700: 'rgb(var(--color-theme-700) / <alpha-value>)',
          900: 'rgb(var(--color-theme-900) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};

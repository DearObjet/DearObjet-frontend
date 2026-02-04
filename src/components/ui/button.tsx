import type React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondaryLight' | 'secondaryDark';
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  label,
  onClick,
  className = '',
  disabled = false,
  style,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `
      bg-primary-bg text-primary-text border-2 border-primary-border rounded-lg
      hover:bg-primary-hover-bg hover:text-primary-hover-text hover:border-primary-hover-border
      active:bg-primary-active-bg active:text-primary-active-text active:border-primary-active-border active:scale-95
      disabled:bg-primary-disabled-bg disabled:text-primary-disabled-text disabled:border-primary-disabled-border disabled:cursor-not-allowed
      transition-all duration-200
    `,
    secondaryLight: `
      bg-secondary-light-bg text-secondary-light-text border-2 border-secondary-light-border rounded-lg
      hover:bg-secondary-light-hover-bg hover:text-secondary-light-hover-text hover:border-secondary-light-hover-border
      active:bg-secondary-light-active-bg active:text-secondary-light-active-text active:border-secondary-light-active-border active:scale-95
      disabled:bg-secondary-light-disabled-bg disabled:text-secondary-light-disabled-text disabled:border-secondary-light-disabled-border disabled:cursor-not-allowed
      transition-all duration-200
    `,
    secondaryDark: `
      bg-secondary-dark-bg text-secondary-dark-text border-2 border-secondary-dark-border rounded-lg
      hover:bg-secondary-dark-hover-bg hover:text-secondary-dark-hover-text hover:border-secondary-dark-hover-border
      active:bg-secondary-dark-active-bg active:text-secondary-dark-active-text active:border-secondary-dark-active-border active:scale-95
      disabled:bg-secondary-dark-disabled-bg disabled:text-secondary-dark-disabled-text disabled:border-secondary-dark-disabled-border disabled:cursor-not-allowed
      transition-all duration-200
    `,
  };

  return (
    <button
      type="button"
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {label}
    </button>
  );
};

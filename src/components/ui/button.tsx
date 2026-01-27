import type { ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondaryLight' | 'secondaryDark' | 'icon';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  label,
  icon,
  onClick,
  className = '',
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-blue-100 border-blue-100 hover:border-blue-300 text-white rounded active:bg-blue-300 active:border-blue-300 disabled:bg-gray-300 disabled:border-gray-300',
    secondaryLight:
      'border-gray-900 hover:bg-gray-100 hover:border-gray-900 text-gray-900 rounded active:bg-gray-200 active:border-gray-900 disabled:bg-white disabled:border-gray-300 disabled:text-gray-300',
    secondaryDark:
      'bg-gray-900 border-gray-900 hover:border-gray-900 hover:border-gray-700 text-white rounded active:bg-black active:border-gray-900 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500',
    icon: 'disabled:text-gray-200 text-black',
  };

  return (
    <button
      type="button"
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon || label}
    </button>
  );
};

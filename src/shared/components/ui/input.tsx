import { type ChangeEvent } from 'react';

export interface InputProps {
  id?: string;
  type?: 'text' | 'password' | 'number' | 'email' | 'tel';
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  value?: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export const Input = ({
  type = 'text',
  placeholder = '',
  size = 'medium',
  disabled = false,
  value,
  className,
  ...props
}: InputProps) => {
  const baseClasses =
    'border border-gray-500 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:border-gray-200 disabled:bg-white';

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-base',
    large: 'px-4 py-3 text-lg',
  };

  const disabledClasses = disabled
    ? 'cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300'
    : 'bg-white text-gray-900';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${disabledClasses} ${className || ''}`}
      {...props}
    />
  );
};

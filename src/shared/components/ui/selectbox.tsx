import type { ChangeEvent } from 'react';

export interface SelectBoxProps {
  options: { value: string; label: string }[];
  value?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export const SelectBox = ({
  options,
  value,
  placeholder,
  size = 'medium',
  backgroundColor,
  onChange,
  className,
  error,
  disabled,
}: SelectBoxProps) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-base',
    large: 'px-4 py-3 text-lg',
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
        error
          ? 'border-red-400 focus:ring-red-400'
          : 'border-gray-300 focus:ring-blue-500'
      } ${sizeClasses[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className ?? ''}`}
      style={{
        ...(backgroundColor ? { backgroundColor } : undefined),
        color: value === '' ? '#B3B3B3' : 'inherit',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

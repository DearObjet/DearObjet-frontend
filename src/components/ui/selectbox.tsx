import type { ChangeEvent } from 'react';

export interface SelectBoxProps {
  options: { value: string; label: string }[];
  value?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SelectBox = ({
  options,
  value,
  placeholder,
  size = 'medium',
  backgroundColor,
  onChange,
  className,
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
      className={`rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${sizeClasses[size]} ${className ?? ''}`}
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

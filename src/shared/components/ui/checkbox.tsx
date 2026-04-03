import { type ChangeEvent } from 'react';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  checked = false,
  disabled = false,
  size = 'medium',
  label,
  className,
  onChange,
  ...props
}: CheckboxProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const disabledClasses = disabled
    ? 'cursor-not-allowed bg-gray-100 border-gray-300'
    : 'cursor-pointer bg-white border-gray-500';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked);
  };

  return (
    <label className={`inline-flex items-center space-x-2 ${className || ''}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={`${sizeClasses[size]} ${disabledClasses} rounded transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

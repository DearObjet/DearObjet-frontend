import type { ComponentType, SVGProps, MouseEvent } from 'react';

export interface ButtonProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  className?: string;
  disabled?: boolean;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

export const Asidetab = ({
  icon: Icon,
  label,
  disabled = false,
  className = '',
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`group flex items-center gap-[1.125rem] border-none bg-transparent p-0 text-[#C1C1C1] outline-none focus:text-white focus:outline-none focus:ring-0 active:text-white ${className}`}
      onClick={onClick}
    >
      {Icon && (
        <Icon
          className={`${
            disabled
              ? 'text-gray-400'
              : 'text-[#C1C1C1] group-focus:text-white group-active:text-white'
          }`}
          width={24}
          height={24}
        />
      )}
      <span>{label}</span>
    </button>
  );
};

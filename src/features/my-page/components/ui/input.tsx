import type { InputHTMLAttributes } from 'react';

import { Button } from '../../../../shared/components/ui';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  prefix?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  variant?: 'default' | 'horizontal';
}

export const Input = ({
  id,
  label,
  prefix,
  buttonLabel,
  onButtonClick,
  buttonDisabled,
  variant = 'default',
  ...props
}: InputProps) => {
  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`${isHorizontal ? 'flex items-center gap-4' : ''} flex-1`}>
      <label htmlFor={id} className={isHorizontal ? 'min-w-28' : ''}>
        {label}
      </label>

      <div className="flex flex-1 items-center border-b border-black">
        {prefix && <span className="mr-2">{prefix}</span>}

        <input id={id} className="h-[3rem] flex-1 outline-none" {...props} />

        {buttonLabel && (
          <Button
            type="button"
            style={{ height: '2.5rem', paddingTop: 0, paddingBottom: 0 }}
            label={buttonLabel}
            variant="secondaryLight"
            onClick={onButtonClick}
            disabled={buttonDisabled}
          />
        )}
      </div>
    </div>
  );
};

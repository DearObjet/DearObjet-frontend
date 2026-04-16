import type { InputHTMLAttributes } from 'react';

import { Button } from '../../../../shared/components/ui';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export const Input = ({
  id,
  label,
  buttonLabel,
  onButtonClick,
  ...props
}: InputProps) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="flex items-center border-b border-black">
        <input id={id} className="h-[3rem] flex-1 outline-none" {...props} />
        {buttonLabel && (
          <Button
            type="button"
            style={{ height: '2.5rem', paddingTop: 0, paddingBottom: 0 }}
            label={buttonLabel}
            variant="secondaryLight"
            onClick={onButtonClick}
          />
        )}
      </div>
    </>
  );
};

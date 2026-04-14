import { type ChangeEvent } from 'react';
import { ChevronRight } from 'lucide-react';

import { Input, Button, Checkbox } from '../../../shared/components/ui';
import type { TermItem } from '../types/signup-types';

export interface LabeledInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'password' | 'tel';
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  error?: string;
}

export const LabeledInput = ({
  id,
  label,
  type = 'text',
  className = '',
  placeholder,
  value,
  onChange,
  readOnly,
  error,
}: LabeledInputProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label htmlFor={id} className={error ? 'text-red-400' : ''}>
      {label}
    </label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

export interface LabeledInputWithButtonProps extends LabeledInputProps {
  buttonLabel: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
}

export const LabeledInputWithButton = ({
  id,
  label,
  type = 'text',
  buttonLabel,
  onButtonClick,
  buttonDisabled,
  placeholder,
  value,
  onChange,
  readOnly,
  error,
}: LabeledInputWithButtonProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className={error ? 'text-red-400' : ''}>
      {label}
    </label>
    <div className="flex w-full gap-2">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`flex-1 ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Button
        label={buttonLabel}
        variant="secondaryDark"
        onClick={onButtonClick}
        type="button"
        disabled={buttonDisabled}
      />
    </div>
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

interface TermItemProps {
  term: TermItem;
  checked: boolean;
  isOpen: boolean;
  onCheck: (isChecked: boolean) => void;
  onToggle: () => void;
}

export const TermItemComponent = ({
  term,
  checked,
  isOpen,
  onCheck,
  onToggle,
}: TermItemProps) => (
  <>
    <div className="flex justify-between">
      <Checkbox
        id={`agree-${term.key}`}
        label={term.label}
        checked={checked}
        onChange={onCheck}
      />
      {term.hasDetail && (
        <ChevronRight className="cursor-pointer" onClick={onToggle} />
      )}
    </div>
    {isOpen && term.hasDetail && (
      <p className="text-sm text-gray-600">{'내용'.repeat(50)}</p>
    )}
  </>
);

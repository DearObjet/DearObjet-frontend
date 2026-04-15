import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const Input = ({ id, label, ...props }: InputProps) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="h-[3rem] border-b border-black" {...props} />
    </>
  );
};

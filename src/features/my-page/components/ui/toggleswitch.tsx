import { useState } from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
}

export const ToggleSwitch = ({ id, label }: ToggleSwitchProps) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        id={id}
        onClick={() => setIsOn(!isOn)}
        className={`relative h-[1.5rem] w-[3rem] rounded-full transition-colors duration-200 ${
          isOn ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-[50%] h-[1.1rem] w-[1.1rem] translate-y-[-50%] rounded-full bg-white shadow transition-all duration-200 ${
            isOn ? 'left-[1.6rem]' : 'left-[0.2rem]'
          }`}
        />
      </button>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

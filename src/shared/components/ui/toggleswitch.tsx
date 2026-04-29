interface ToggleSwitchProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ToggleSwitch = ({
  id,
  label,
  checked = false,
  onChange,
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        id={id}
        onClick={() => onChange?.(!checked)}
        className={`relative h-[1.5rem] w-[3rem] rounded-full transition-colors duration-200 ${
          checked ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-[50%] h-[1.1rem] w-[1.1rem] translate-y-[-50%] rounded-full bg-white shadow transition-all duration-200 ${
            checked ? 'left-[1.6rem]' : 'left-[0.2rem]'
          }`}
        />
      </button>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

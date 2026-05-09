import type { ConfirmModalProps } from '../types/post-type';

export const ConfirmModal = ({ message, onYes, onNo }: ConfirmModalProps) => (
  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
    <div className="w-60 overflow-hidden rounded-xl border bg-white shadow-lg">
      <p className="px-5 pb-5 pt-6 text-center text-[13px] text-gray-700">
        {message}
      </p>
      <div className="grid grid-cols-2 border-t">
        <button
          onClick={onYes}
          className="border-r py-3 text-xs font-medium text-red-500 transition-colors hover:bg-gray-100"
        >
          네
        </button>
        <button
          onClick={onNo}
          className="py-3 text-xs text-gray-500 transition-colors hover:bg-gray-100"
        >
          아니요
        </button>
      </div>
    </div>
  </div>
);

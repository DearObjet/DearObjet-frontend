import { Button } from '../../../../shared/components/ui';

import type { InboundMemoProps } from '../types/inbound';

export const InboundMemo = ({
  memo,
  onChange,
  onSave,
  onDelete,
}: InboundMemoProps) => {
  return (
    <section className="flex flex-col rounded-xl bg-white px-6 pb-5 pt-4">
      <div className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="font-bold">메모</h2>
        <div className="flex gap-1">
          <Button
            variant="secondaryLight"
            className="px-4 py-2 text-xs"
            label="삭제"
            onClick={onDelete}
          />
          <Button
            variant="secondaryDark"
            className="px-4 py-2 text-xs"
            label="저장"
            onClick={onSave}
          />
        </div>
      </div>
      <label htmlFor="inbound-memo" className="sr-only">
        입고 메모
      </label>
      <textarea
        id="inbound-memo"
        className="mt-4 flex-1 resize-none text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
        value={memo}
        onChange={(e) => onChange(e.target.value)}
        placeholder="작가를 선택하면 메모를 입력할 수 있습니다."
      />
    </section>
  );
};

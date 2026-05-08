import { useState, useEffect } from 'react';

import { Button } from '../../../../shared/components/ui';

import {
  useGetProductMemoQuery,
  useUpdateProductMemoMutation,
  useDeleteProductMemoMutation,
} from '../api/artist-product-api';

type ProductMemoProps = {
  selectedId: number | null;
};

export const ProductMemo = ({ selectedId }: ProductMemoProps) => {
  const [memo, setMemo] = useState('');

  const { data: memoData } = useGetProductMemoQuery(selectedId!, {
    skip: selectedId === null,
  });
  const [updateMemo] = useUpdateProductMemoMutation();
  const [deleteMemo] = useDeleteProductMemoMutation();

  useEffect(() => {
    if (selectedId === null) {
      setMemo('');
      return;
    }
    setMemo(memoData?.memo ?? '');
  }, [selectedId, memoData]);

  const handleSave = async () => {
    if (selectedId === null) return;
    try {
      if (memo.trim() === '') {
        await deleteMemo(selectedId).unwrap();
      } else {
        await updateMemo({ productId: selectedId, memo: memo.trim() }).unwrap();
      }
      alert('메모가 저장되었습니다.');
    } catch {
      alert('메모 저장에 실패했습니다.');
    }
  };

  const handleClear = async () => {
    if (selectedId === null) return;
    try {
      await deleteMemo(selectedId).unwrap();
      setMemo('');
    } catch {
      alert('메모 삭제에 실패했습니다.');
    }
  };

  return (
    <section className="flex flex-1 flex-col rounded-xl bg-white px-6 pb-5 pt-4">
      <div className="flex shrink-0 items-center justify-between border-b pb-3">
        <h2 className="my-1.5 font-bold">상품 메모</h2>
        {selectedId !== null && (
          <div className="flex gap-1">
            <Button
              variant="secondaryDark"
              className="flex items-center justify-center px-4 py-2 text-xs"
              label="초기화"
              onClick={handleClear}
            />
            <Button
              variant="secondaryDark"
              className="flex items-center justify-center px-5 py-2 text-xs"
              label="저장"
              onClick={handleSave}
            />
          </div>
        )}
      </div>
      <label htmlFor="product-memo" className="sr-only">
        상품 메모
      </label>
      <textarea
        id="product-memo"
        className="mt-4 flex-1 resize-none text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder={
          selectedId === null
            ? '상품을 선택하면 메모를 입력할 수 있습니다.'
            : '메모를 입력해주세요'
        }
        disabled={selectedId === null}
        maxLength={1000}
      />
    </section>
  );
};

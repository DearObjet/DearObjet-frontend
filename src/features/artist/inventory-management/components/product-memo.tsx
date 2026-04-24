import { useState } from 'react';

const MOCK_MEMO =
  '2차 입고분은 9/30 발송 예정\n원단 단종으로 11월부터 색상 변경 예정(베이지 → 라이트그레이)\n불량률 2% 내외 → 검수 시 지퍼 부분 꼼꼼히 확인 필요';

export const ProductMemo = () => {
  const [memo, setMemo] = useState(MOCK_MEMO);

  return (
    <section className="flex flex-1 flex-col rounded-xl bg-white px-6 pb-5 pt-4">
      <div className="shrink-0 border-b pb-3">
        <h2 className="font-bold">상품 메모</h2>
      </div>
      <label htmlFor="product-memo" className="sr-only">
        상품 메모
      </label>
      <textarea
        id="product-memo"
        className="mt-4 flex-1 resize-none text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모를 입력해주세요"
      />
    </section>
  );
};

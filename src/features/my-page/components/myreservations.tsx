import { Button } from '../../../shared/components/ui';

import { MyPageLayout } from './my-page-layout';

export const MyReservations = () => {
  return (
    <MyPageLayout>
      <div className="flex w-[43.562rem] flex-col gap-12 text-[26px]">
        <section className="flex flex-col gap-5">
          <h2 className="">예약 현황</h2>
          <div className="flex flex-col gap-5 rounded-xl border border-black p-10">
            <p>예약번호</p>
            <p>예약매장</p>
            <hr />
            <p>일정 날짜, 시간</p>
            <p>클래스 명</p>

            <div className="mt-5 flex h-[4.375rem] gap-3">
              <Button
                variant="secondaryDark"
                label="변경"
                className="w-full text-[26px]"
              />
              <Button
                variant="secondaryDark"
                label="취소"
                className="w-full text-[26px]"
              />
            </div>
          </div>
        </section>

        <section className="mb-[4rem] h-[9.375rem] border-b">
          <h2 className="hidden">디어오브제 공지</h2>
          <p className="text-sm">꼭 확인해주세요!</p>
          <span>디어오브제에서 전하는 공지</span>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-xl">지난 예약</h2>
          <div className="flex flex-col gap-5 rounded-xl border border-black p-10">
            <p>예약번호</p>
            <p>예약매장</p>
            <hr />
            <p>일정 날짜, 시간</p>
            <p>클래스 명</p>
          </div>
        </section>
      </div>
    </MyPageLayout>
  );
};

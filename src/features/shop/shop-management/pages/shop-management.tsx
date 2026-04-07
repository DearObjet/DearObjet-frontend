import { Aside } from '../../../../shared/components/layout';

import { Button } from '../../../../shared/components/ui';
import { Input } from '../../../../shared/components/ui';
import { ImagePlus } from 'lucide-react';

export const ShopManagement = () => {
  return (
    <div className="flex h-screen w-screen">
      <Aside />
      <div className="flex flex-1 flex-col">
        <header className="h-[4.5rem] w-full bg-white p-6 text-black">
          <h2>관리 홈 / 나의 소품샵 관리</h2>
        </header>
        <main className="grid w-full flex-1 grid-cols-2 gap-3 overflow-y-auto bg-gray-100 p-5 px-[3.625rem]">
          {/* 클래스 등록하기 */}
          <div className="flex h-full flex-col gap-3">
            <section className="flex flex-col rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3>클래스 등록하기</h3>
                <Button
                  variant="secondaryDark"
                  className="flex items-center justify-center px-4 py-2 text-xs"
                  label="새 클래스 등록"
                />
              </div>

              <div>
                <form className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">
                      클래스 이름을 등록해주세요
                    </p>
                    <Input className="w-full" disabled />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">
                      클래스 소개글을 작성해주세요
                    </p>
                    <textarea
                      className="h-[7.0625rem] w-full resize-none rounded-lg border border-gray-500 px-3 py-2 text-sm disabled:border-gray-200 disabled:bg-white"
                      disabled
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex w-full flex-col gap-2">
                      <p className="text-sm font-medium">
                        결제 금액을 작성해주세요 (1인 기준입니다)
                      </p>
                      <Input className="w-full" disabled />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <p className="text-sm font-medium">최대 예약인원</p>
                      <Input className="w-full" disabled />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">
                      클래스 유의 사항을 작성해주세요
                    </p>
                    <Input className="w-full" disabled />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">사진을 추가해주세요</p>
                    <button className="flex h-[5.625rem] w-[5.625rem] items-center justify-center rounded-lg bg-gray-200">
                      <ImagePlus className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="flex h-full flex-col rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3>클래스 리스트</h3>
                <div className="flex gap-1">
                  <Button
                    variant="secondaryLight"
                    className="flex items-center justify-center border-[1px] px-4 py-2 text-xs"
                    label="수정"
                  />
                  <Button
                    variant="secondaryDark"
                    className="flex items-center justify-center px-4 py-2 text-xs"
                    label="삭제"
                  />
                </div>
              </div>

              <div></div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

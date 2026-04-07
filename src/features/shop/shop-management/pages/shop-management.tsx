import { Aside } from '../../../../shared/components/layout';

export const ShopManagement = () => {
  return (
    <div className="flex h-screen w-screen">
      <Aside />
      <div className="flex flex-1 flex-col">
        <header className="h-[4.5rem] w-full bg-white p-6 text-black">
          <h2>관리 홈 / 나의 소품샵 관리</h2>
        </header>
        <main className="grid w-full flex-1 grid-cols-2 gap-3 overflow-y-auto bg-gray-100 p-5 px-[3.625rem]"></main>
      </div>
    </div>
  );
};

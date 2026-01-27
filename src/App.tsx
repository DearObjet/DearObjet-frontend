import './App.css';
import { Routes, Route, useNavigate } from 'react-router';
import { Signup } from './auth/sign-up';
import ShopArtistNotice from './page/shop-artist-notice';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

function MainPage() {
  const navigate = useNavigate();
  const regions = [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'incheon', label: '인천' },
  ];

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen w-[120rem] items-center justify-center gap-3">
      <div className="flex gap-3">
        <div className="flex w-[62.68rem] flex-col gap-3">
          <section className="flex h-[20.93rem] w-full items-center justify-center rounded-sm border border-gray-300">
            <h2>캐러셀 배너</h2>
          </section>

          <section className="grid h-[43rem] w-full grid-cols-2 gap-3">
            <h2 className="hidden">포스트</h2>
            <div className="rounded-sm border border-gray-300">포스트</div>
            <div className="rounded-sm border border-gray-300">포스트</div>
            <div className="rounded-sm border border-gray-300">포스트</div>
            <div className="rounded-sm border border-gray-300">포스트</div>
          </section>
        </div>

        <aside className="flex w-[17.125rem] flex-col gap-3">
          <section className="flex h-[15.0625rem] w-full flex-col justify-center gap-6 rounded-sm border border-gray-300">
            <h2 className="hidden">회원가입</h2>
            <div className="flex flex-col items-center gap-5">
              <p className="text-center text-base font-semibold">
                지금 가입해서{' '}
                <span className="font-extrabold">전국의 소품샵</span>을 <br />
                <span className="font-extrabold">한눈에 확인</span>하세요!
              </p>

              <div className="relative inline-block rounded-[12.5px] border border-gray-200 bg-white px-3 py-1 shadow-[0_1px_0_0_rgba(0,0,0,0.25)] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white after:drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
                <p className="text-xs font-medium">
                  <span className="font-semibold">3초안에</span> 빠른 회원가입
                </p>
              </div>

              <button
                className="w-[13.25rem] bg-[#FEE500] text-xs font-bold"
                onClick={handleSignupClick}
              >
                카카오로 시작하기
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="hidden">축제</h2>
            <div className="flex items-center rounded-sm border border-gray-300 px-7 py-2">
              <p className="pr-8 text-xs">지역</p>
              <div className="relative">
                <select className="appearance-none pr-6 text-sm font-extrabold">
                  {regions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>

            <div className="h-[15.75rem] bg-gray-200"></div>

            <div className="flex gap-10 self-center">
              <ChevronLeft />
              <ChevronRight />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2>공지&이벤트</h2>
            <div className="h-[10rem] w-full rounded-sm border border-gray-300"></div>

            <div className="relative flex items-center gap-10 self-center after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm after:content-['1/6']">
              <ChevronLeft />
              <ChevronRight />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/shop-artist-notice" element={<ShopArtistNotice />} />
    </Routes>
  );
}

export default App;

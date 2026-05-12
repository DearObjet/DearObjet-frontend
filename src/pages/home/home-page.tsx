import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { useAppSelector } from '../../app/hooks';
import { Button } from '../../shared/components/ui';
import { API_BASE_URL } from '../../shared/constants';
import { useGetNoticesQuery } from '../../features/notice/api/notice-api';
import { CATEGORY_LABEL } from '../../features/notice/constants/notice-constants';
import { FestivalSection } from '../../features/festival/components/festival-section';

import KakaoLogo from '../../assets/kakao-logo.svg';
import CatImg from '../../assets/cat.png';

const HOME_NOTICES_PER_PAGE = 5;

export const HomePage = () => {
  const [currentNoticePage, setCurrentNoticePage] = useState(1);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const { data: noticeData } = useGetNoticesQuery({
    target: 'USER',
    page: 1,
  });

  const allNotices = noticeData?.items ?? [];
  const totalNoticePages = Math.ceil(allNotices.length / HOME_NOTICES_PER_PAGE);
  const currentNotices = allNotices.slice(
    (currentNoticePage - 1) * HOME_NOTICES_PER_PAGE,
    currentNoticePage * HOME_NOTICES_PER_PAGE
  );

  const handleNoticePrevPage = () => {
    if (currentNoticePage > 1) setCurrentNoticePage(currentNoticePage - 1);
  };

  const handleNoticeNextPage = () => {
    if (currentNoticePage < totalNoticePages)
      setCurrentNoticePage(currentNoticePage + 1);
  };

  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <section className="flex h-[20.93rem] w-full items-center justify-center rounded-sm border border-gray-300">
          <h2>캐러셀 배너</h2>
        </section>

        <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <h2 className="sr-only">포스트</h2>
          <div className="h-[21rem] rounded-sm border border-gray-300">
            포스트
          </div>
          <div className="h-[21rem] rounded-sm border border-gray-300">
            포스트
          </div>
          <div className="h-[21rem] rounded-sm border border-gray-300">
            포스트
          </div>
          <div className="h-[21rem] rounded-sm border border-gray-300">
            포스트
          </div>
        </section>
      </div>

      <aside className="flex w-full flex-col gap-3 lg:w-[17.125rem] lg:shrink-0">
        <section className="flex h-[15.0625rem] w-full flex-col items-center justify-center gap-6 rounded-sm border border-gray-300">
          {isAuthenticated ? (
            <>
              <h2 className="sr-only">이번주말 추천</h2>
              <p className="text-base font-semibold">이번주말 ~ 어때요?</p>
              <div className="h-[8rem] w-[8rem] overflow-hidden rounded-full bg-gray-200">
                <img
                  src={CatImg}
                  alt="이번주말 추천 이미지"
                  className="h-full w-full object-cover"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="sr-only">회원가입</h2>
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
                  className="flex w-[13.25rem] items-center justify-center gap-2 rounded-sm bg-[#FEE500] py-2 text-xs font-bold"
                  onClick={handleKakaoLogin}
                >
                  카카오로 시작하기
                  <img src={KakaoLogo} alt="" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </section>

        <FestivalSection />

        <section className="flex flex-col gap-3">
          <h2>공지&이벤트</h2>
          <div className="h-[10rem] w-full rounded-sm border border-gray-300 p-3">
            {currentNotices.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-gray-400">등록된 공지가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {currentNotices.map((notice) => (
                  <button
                    key={notice.noticeId}
                    className="flex w-full text-[0.625rem] font-normal hover:underline"
                    onClick={() => navigate(`/notices?id=${notice.noticeId}`)}
                  >
                    <span className="w-12 shrink-0 text-center">
                      {CATEGORY_LABEL[notice.category]}
                    </span>
                    <span className="truncate text-left">{notice.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative flex items-center gap-10 self-center after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm after:content-[attr(data-page)]"
            data-page={`${currentNoticePage}/${totalNoticePages || 1}`}
          >
            <Button
              variant="icon"
              icon={<ChevronLeft />}
              onClick={handleNoticePrevPage}
              disabled={currentNoticePage === 1}
            />
            <Button
              variant="icon"
              icon={<ChevronRight />}
              onClick={handleNoticeNextPage}
              disabled={currentNoticePage === totalNoticePages}
            />
          </div>
        </section>
      </aside>
    </div>
  );
};

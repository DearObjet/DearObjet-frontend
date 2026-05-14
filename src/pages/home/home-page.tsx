import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { useAppSelector } from '../../app/hooks';
import { Button } from '../../shared/components/ui';
import { CarouselBanner } from '../../shared/components/common/carousel-banner';
import { API_BASE_URL, ROUTES } from '../../shared/constants';

import { useGetNoticesQuery } from '../../features/notice/api/notice-api';
import { CATEGORY_LABEL } from '../../features/notice/constants/notice-constants';
import { FestivalSection } from '../../features/festival/components/festival-section';
import { useGetAllPostsQuery } from '../../features/post/api/post-api';

import KakaoLogo from '../../assets/kakao-logo.svg';
import CatImg from '../../assets/cat.png';

const HOME_NOTICES_PER_PAGE = 5;
const HOME_POSTS_LIMIT = 4;

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
  const { data: postData } = useGetAllPostsQuery(1);
  const latestPosts = (postData?.items ?? []).slice(0, HOME_POSTS_LIMIT);

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
        <section className="h-[20.93rem] w-full overflow-hidden rounded-sm">
          <h2 className="sr-only">캐러셀 배너</h2>
          <CarouselBanner />
        </section>

        <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <h2 className="sr-only">포스트</h2>
          {latestPosts.length === 0
            ? Array.from({ length: HOME_POSTS_LIMIT }).map((_, i) => (
                <div
                  key={i}
                  className="h-[21rem] rounded-sm border border-gray-300"
                />
              ))
            : latestPosts.map((post) => (
                <button
                  key={post.postId}
                  onClick={() => navigate(`${ROUTES.POSTS}?id=${post.postId}`)}
                  className="group relative h-[21rem] overflow-hidden rounded-sm border border-gray-300 focus:outline-none"
                >
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={`${post.authorName}의 포스트`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-theme-200" />
                  )}

                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-white px-3 py-3">
                    {post.authorProfileUrl ? (
                      <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <img
                          src={post.authorProfileUrl}
                          alt={post.authorName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
                        {post.authorName[0]}
                      </div>
                    )}
                    <span className="truncate text-xs font-medium text-gray-700">
                      {post.authorName}
                    </span>
                  </div>
                </button>
              ))}
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

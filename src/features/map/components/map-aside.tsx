import { useState, useEffect } from 'react';
import { Star, MessageCircle, Share2 } from 'lucide-react';

import { Button } from '../../../shared/components/ui';

import type { ShopPanelProps, TabMenu } from '../types/map-types';

import { DAY_LABEL, DAY_ORDER, TAB_MENUS } from '../constants/map-constants';
import { OneDayClassTab } from './one-day-class-tab';

export const MapAside = ({ shopDetail, shopId }: ShopPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabMenu>('스토리');

  const handleLikeToggle = () => {
    console.log('좋아요');
  };

  const handleWriteReview = () => {
    console.log('리뷰작성하기');
  };

  const handleShareContent = () => {
    console.log('공유하기');
  };

  const handleApplyForPartnership = () => {
    console.log('입점신청하기');
  };

  // 다른 소품샵 선택 시 탭 초기화
  useEffect(() => {
    setActiveTab('스토리');
  }, [shopDetail?.shopName]);

  if (!shopDetail) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-theme-300">
        지도에서 소품샵을 선택해주세요!
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto [scrollbar-gutter:stable]">
      {/* 포스트 사진 그리드 */}
      <div className="grid grid-cols-[repeat(3,136px)] grid-rows-[repeat(3,136px)] gap-[1.5px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-[8.375rem] w-[8.375rem] overflow-hidden bg-theme-200"
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-7 py-7">
        {/* 샵 이름 */}
        <h2 className="text-2xl font-semibold text-gray-900">
          {shopDetail.shopName}
        </h2>

        {/* 찜, 리뷰작성, 공유하기 버튼 */}
        <div className="flex gap-2">
          {[
            {
              label: '찜하기',
              icon: <Star className="h-5 w-5" />,
              handler: handleLikeToggle,
            },
            {
              label: '리뷰작성',
              icon: <MessageCircle className="h-5 w-5" />,
              handler: handleWriteReview,
            },
            {
              label: '공유하기',
              icon: <Share2 className="h-5 w-5" />,
              handler: handleShareContent,
            },
          ].map(({ label, icon, handler }) => (
            <Button
              key={label}
              aria-label={label}
              variant="secondaryLight"
              size="small"
              onClick={handler}
              icon={icon}
            />
          ))}
        </div>

        {/* 입점 신청하기 버튼 */}
        <Button
          size="medium"
          variant="secondaryDark"
          label="입점 신청하기"
          onClick={handleApplyForPartnership}
        />
      </div>

      <hr className="mx-4 mt-4 border-theme-300" />

      {/* 상세 정보 */}
      <div className="flex flex-col gap-5 px-4 py-7 text-sm text-theme-900">
        <p>
          <span className="mr-2 font-bold">전화번호 :</span>
          {shopDetail.phoneNumber}
        </p>
        <p>
          <span className="mr-2 font-bold">주소 :</span>
          {shopDetail.businessAddress}
        </p>
        <div className="flex">
          <span className="mr-2 shrink-0 font-bold">영업시간</span>
          <div className="flex flex-col gap-0.5">
            {shopDetail.businessHours ? (
              DAY_ORDER.map((day) => {
                const hours = shopDetail.businessHours![day];
                return (
                  <div key={day} className="flex gap-2">
                    <span className="w-13 shrink-0">{DAY_LABEL[day]} :</span>
                    <span>
                      {hours.openTime && hours.closeTime
                        ? `${hours.openTime} ~ ${hours.closeTime}`
                        : '휴무'}
                    </span>
                  </div>
                );
              })
            ) : (
              <span>소품샵이 영업시간을 등록하지 않았습니다.</span>
            )}
          </div>
        </div>
      </div>

      <hr className="border-theme-300" />

      {/* 탭 메뉴 */}
      <div className="flex shrink-0 justify-center border-b border-theme-200">
        {TAB_MENUS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-theme-900'
                : 'text-theme-300 hover:text-theme-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-theme-900" />
            )}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1">
        {activeTab === '원데이클래스' && shopId && (
          <OneDayClassTab shopId={shopId} shopName={shopDetail.shopName} />
        )}
      </div>
    </div>
  );
};

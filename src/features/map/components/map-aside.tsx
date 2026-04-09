import { useState } from 'react';
import { Star, MessageCircle, Share2 } from 'lucide-react';

import { Button } from '../../../shared/components/ui';

// 더미 데이터
const DUMMY_SHOP = {
  name: '솜다람잡화점',
  phoneNumber: '050 - 873 - 4468',
  address: '대구광역시 당산로 171',
  operatingHours: [
    { day: '월요일', time: '10:00 ~ 20:00' },
    { day: '화요일', time: '10:00 ~ 20:00' },
    { day: '수요일', time: '10:00 ~ 20:00' },
    { day: '목요일', time: '10:00 ~ 20:00' },
    { day: '금요일', time: '10:00 ~ 20:00' },
    { day: '토요일', time: '10:00 ~ 20:00' },
    { day: '일요일', time: '10:00 ~ 20:00' },
  ],
  thumbnailUrls: Array(9).fill(''),
};

const TAB_MENUS = [
  '스토리',
  '원데이클래스',
  '입점작가',
  '정보',
  '인근놀거리',
] as const;
type TabMenu = (typeof TAB_MENUS)[number];

export const MapAside = () => {
  const [activeTab, setActiveTab] = useState<TabMenu>('스토리');
  const shop = DUMMY_SHOP;

  const applyForStoreEntry = () => {
    console.log('입점신청하기');
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* 포스트 사진 그리드 */}
      <div className="grid grid-cols-[repeat(3,136px)] grid-rows-[repeat(3,136px)] gap-[3px]">
        {shop.thumbnailUrls.slice(0, 9).map((url, i) => (
          <div
            key={i}
            style={{ width: 136, height: 136 }}
            className="overflow-hidden bg-theme-200"
          >
            {url && (
              <img
                src={url}
                alt={`포스트 ${i + 1}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* 샵 이름 + 액션 버튼 + 입점신청 */}
      <div className="flex flex-col items-center gap-7 py-4">
        {/* 샵 이름 */}
        <h2 className="text-2xl font-semibold text-gray-900">{shop.name}</h2>
        {/* 액션 버튼 3개 */}
        <div className="flex gap-2">
          <Button
            className="rounded-full"
            variant="secondaryLight"
            size="small"
            // onClick={}
            icon={<Star className="h-5 w-5" />}
          />
          <Button
            className="rounded-full"
            variant="secondaryLight"
            size="small"
            // onClick={}
            icon={<MessageCircle className="h-5 w-5" />}
          />
          <Button
            className="rounded-full"
            variant="secondaryLight"
            size="small"
            // onClick={}
            icon={<Share2 className="h-5 w-5" />}
          />
        </div>

        {/* 입점 신청하기 버튼 */}
        <Button
          size="medium"
          variant="secondaryDark"
          label="입점 신청하기"
          onClick={applyForStoreEntry}
        />
      </div>

      {/* 구분선 */}
      <hr className="mx-4 mt-4 border-theme-300" />

      {/* 상세 정보 */}
      <div className="flex flex-col gap-5 px-4 py-4">
        <div className="text-sm text-theme-900">
          <span className="mr-2">전화번호 :</span>
          {shop.phoneNumber}
        </div>

        <div className="text-sm text-theme-900">
          <span className="mr-2">주소 :</span>
          {shop.address}
        </div>

        <div className="text-sm text-theme-900">
          <div className="flex">
            <span className="mr-2 shrink-0">영업시간</span>
            <div className="flex flex-col gap-0">
              {shop.operatingHours.map((hour) => (
                <div key={hour.day} className="flex gap-2">
                  <span className="w-[3.5rem] shrink-0">{hour.day} :</span>
                  <span>{hour.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="border-theme-300" />

      {/* 탭 메뉴 */}
      <div className="flex shrink-0 justify-center border-b border-theme-200">
        {TAB_MENUS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ fontSize: 12 }}
            className={`relative px-3 py-3 font-medium transition-colors ${
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

      {/* 탭 컨텐츠 (추후 작업) */}
      <div className="flex-1" />
    </div>
  );
};

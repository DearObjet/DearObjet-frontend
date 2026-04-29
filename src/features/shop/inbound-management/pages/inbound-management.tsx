import { useState } from 'react';

import { ArtistList } from '../components/artist-list';
import { InboundMemo } from '../components/inbound-memo';
import { InboundRecordList } from '../components/inbound-record-list';
import type { InboundArtist, InboundRecord } from '../types/inbound';

const MOCK_ARTISTS: InboundArtist[] = [
  {
    id: 1,
    imageUrl: '',
    name: '김동이1',
    category: '액세서리',
    lastInboundDate: '2025.09.20',
    inboundConfirm: '승인',
    memo: '해당 상품 서울일러스트페어 인기 제품으로 재고 10 이상 유지할 것',
  },
  {
    id: 2,
    imageUrl: '',
    name: '별사탕나라',
    category: '인테리어 소품',
    lastInboundDate: '2025.09.20',
    inboundConfirm: '미확인',
    memo: '',
  },
  {
    id: 3,
    imageUrl: '',
    name: '재미나이',
    category: '문구',
    lastInboundDate: '2025.09.20',
    inboundConfirm: '미확인',
    memo: '',
  },
  {
    id: 4,
    imageUrl: '',
    name: '김작가',
    category: '일러스트-아트',
    lastInboundDate: '2025.09.20',
    inboundConfirm: '미확인',
    memo: '',
  },
  {
    id: 5,
    imageUrl: '',
    name: '박아리',
    category: '일러스트-아트',
    lastInboundDate: '2025.09.20',
    inboundConfirm: '미확인',
    memo: '',
  },
];

const MOCK_ALL_RECORDS: InboundRecord[] = [
  {
    id: 1,
    imageUrl: '',
    productName: '1번 상품',
    price: 10000,
    stock: 2,
    commission: '30%',
    commissionRate: 30,
    marginAmount: 3000,
    settlementPerUnit: 7000,
    artistName: '박아리',
    lastInboundDate: '2025.09.10',
  },
  {
    id: 2,
    imageUrl: '',
    productName: '2번 상품',
    price: 10000,
    stock: 2,
    commission: '25%',
    commissionRate: 25,
    marginAmount: 2500,
    settlementPerUnit: 7500,
    artistName: '박아리',
    lastInboundDate: '2025.09.10',
  },
  {
    id: 3,
    imageUrl: '',
    productName: '3번 상품',
    price: 10000,
    stock: 0,
    commission: '35%',
    commissionRate: 35,
    marginAmount: 3500,
    settlementPerUnit: 6500,
    artistName: '박아리',
    lastInboundDate: '2025.08.10',
  },
];

const MOCK_RECENT_RECORDS: InboundRecord[] = [
  {
    id: 1,
    imageUrl: '',
    productName: '별토끼의 반짝이는 스마트톡',
    price: 10000,
    stock: 5,
    commission: '30%',
    commissionRate: 30,
    marginAmount: 3000,
    settlementPerUnit: 7000,
    artistName: '별사탕나라',
    lastInboundDate: '2025.09.20',
  },
  {
    id: 2,
    imageUrl: '',
    productName: '볼토리 엽서 세트 (꽃길 버전)',
    price: 10000,
    stock: 3,
    commission: '25%',
    commissionRate: 25,
    marginAmount: 2500,
    settlementPerUnit: 7500,
    artistName: '별사탕나라',
    lastInboundDate: '2025.09.20',
  },
];

const INITIAL_MEMOS = Object.fromEntries(
  MOCK_ARTISTS.map((a) => [a.id, a.memo])
);

export const InboundManagement = () => {
  const [artists, setArtists] = useState<InboundArtist[]>(MOCK_ARTISTS);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [viewArtistId, setViewArtistId] = useState<number | null>(null);
  const [isRecentMode, setIsRecentMode] = useState(false);
  const [memoValue, setMemoValue] = useState('');
  const [savedMemos, setSavedMemos] =
    useState<Record<number, string>>(INITIAL_MEMOS);

  const records: InboundRecord[] = (() => {
    if (isRecentMode) return MOCK_RECENT_RECORDS;
    if (viewArtistId !== null) return MOCK_ALL_RECORDS;
    return [];
  })();

  const handleArtistRowClick = (artist: InboundArtist) => {
    const newId = selectedArtistId === artist.id ? null : artist.id;
    setSelectedArtistId(newId);
    setMemoValue(newId !== null ? (savedMemos[newId] ?? '') : '');
  };

  const handleInboundAllView = (artistId: number) => {
    setViewArtistId(artistId);
    setIsRecentMode(false);
  };

  const handleInboundRecentView = (artistId: number) => {
    setViewArtistId(artistId);
    setIsRecentMode(true);
  };

  const handleConfirmToggle = (artistId: number) => {
    setArtists((prev) =>
      prev.map((a) =>
        a.id === artistId
          ? {
              ...a,
              inboundConfirm: a.inboundConfirm === '승인' ? '미확인' : '승인',
            }
          : a
      )
    );
  };

  const handleMemoSave = () => {
    if (selectedArtistId === null) return;
    setSavedMemos((prev) => ({ ...prev, [selectedArtistId]: memoValue }));
    alert('메모가 저장되었습니다.');
  };

  const handleMemoDelete = () => {
    setMemoValue('');
    if (selectedArtistId !== null) {
      setSavedMemos((prev) => ({ ...prev, [selectedArtistId]: '' }));
    }
  };

  const handleStockSave = (stocks: Record<number, number>) => {
    console.log('재고 저장 요청:', stocks);
    alert('재고가 저장되었습니다.');
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden bg-gray-100">
      {/* 입고작가 리스트 + 메모 */}
      <div className="grid grid-cols-[3fr_2fr] gap-3">
        <ArtistList
          artists={artists}
          selectedId={selectedArtistId}
          onRowClick={handleArtistRowClick}
          onInboundAllView={handleInboundAllView}
          onInboundRecentView={handleInboundRecentView}
          onConfirmToggle={handleConfirmToggle}
        />
        <InboundMemo
          memo={memoValue}
          onChange={setMemoValue}
          onSave={handleMemoSave}
          onDelete={handleMemoDelete}
        />
      </div>

      {/* 전체입고 / 최근입고 리스트 */}
      <InboundRecordList
        records={records}
        isRecentMode={isRecentMode}
        onStockSave={handleStockSave}
      />
    </div>
  );
};

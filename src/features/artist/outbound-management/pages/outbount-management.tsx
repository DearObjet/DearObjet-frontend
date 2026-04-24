import { useState } from 'react';
import type {
  OutboundItem,
  OutboundProduct,
  OutboundRecord,
  Shop,
} from '../types/outbound';
import { ShopList } from '../components/shop-list';
import { OutboundList } from '../components/outbound-list';
import { OutboundProductList } from '../components/outbound-product-list';

const MOCK_SHOPS: Shop[] = [
  {
    id: 1,
    name: '1번 소품샵',
    category: '액세서리',
    contractStart: '2025.09.10',
    contractEnd: '2026.09.10',
    outboundConfirm: '미확인',
  },
  {
    id: 2,
    name: '2번 소품샵',
    category: '인테리어 소품',
    contractStart: '2025.08.20',
    contractEnd: '2026.08.20',
    outboundConfirm: '확인',
  },
  {
    id: 3,
    name: '3번 소품샵',
    category: '문구',
    contractStart: '2025.08.20',
    contractEnd: '2026.08.20',
    outboundConfirm: '미확인',
  },
  {
    id: 4,
    name: '4번 소품샵',
    category: '편집샵',
    contractStart: '2025.08.20',
    contractEnd: '2026.08.20',
    outboundConfirm: '미확인',
  },
];

const MOCK_PRODUCTS: OutboundProduct[] = [
  {
    id: 1,
    imageUrl: '',
    name: '달꼬미의 포근포근 키링',
    price: 10000,
    stock: 100,
  },
  {
    id: 2,
    imageUrl: '',
    name: '별토끼의 반짝이는 스마트톡',
    price: 10000,
    stock: 50,
  },
  { id: 3, imageUrl: '', name: '몽글낭 낮잠 파우치', price: 10000, stock: 30 },
  {
    id: 4,
    imageUrl: '',
    name: '구름어우 산채 아크릴 스탠드',
    price: 10000,
    stock: 20,
  },
];

const MOCK_INBOUND_ALL: OutboundRecord[] = [
  {
    id: 1,
    productName: '달꼬미의 포근포근 키링',
    price: 10000,
    quantity: 30,
    commission: '30%',
    settlement: 7000,
  },
  {
    id: 2,
    productName: '달꼬미의 포근포근 키링',
    price: 10000,
    quantity: 30,
    commission: '30%',
    settlement: 7000,
  },
  {
    id: 3,
    productName: '달꼬미의 포근포근 키링',
    price: 10000,
    quantity: 30,
    commission: '30%',
    settlement: 7000,
  },
  {
    id: 3,
    productName: '달꼬미의 포근포근 키링',
    price: 10000,
    quantity: 30,
    commission: '30%',
    settlement: 7000,
  },
  {
    id: 1,
    productName: '달꼬미의 포근포근 키링',
    price: 10000,
    quantity: 30,
    commission: '30%',
    settlement: 7000,
  },
  {
    id: 2,
    productName: '달꼬미의 포근포근 키링',
    price: 10000,
    quantity: 30,
    commission: '30%',
    settlement: 7000,
  },
];

const MOCK_INBOUND_RECENT: OutboundRecord[] = [
  {
    id: 1,
    productName: '별토끼의 반짝이는 스마트톡',
    price: 10000,
    quantity: 20,
    commission: '30%',
    settlement: 7000,
  },
  {
    id: 2,
    productName: '볼토리 엽서 세트 (꽃길 버전)',
    price: 10000,
    quantity: 15,
    commission: '25%',
    settlement: 7500,
  },
];

export const OutboundManagement = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [outboundShopId, setOutboundShopId] = useState<number | null>(null);
  const [isRecentMode, setIsRecentMode] = useState(false);

  const displayedProducts = selectedShopId !== null ? MOCK_PRODUCTS : [];

  const outboundRecords: OutboundRecord[] = (() => {
    if (isRecentMode) return MOCK_INBOUND_RECENT;
    if (outboundShopId !== null) return MOCK_INBOUND_ALL;
    return [];
  })();

  const handleShopRowClick = (shop: Shop) => {
    setSelectedShopId((prev) => (prev === shop.id ? null : shop.id));
  };

  const handleOutboundView = (shopId: number) => {
    setOutboundShopId(shopId);
    setIsRecentMode(false);
  };

  const handleToggleRecentMode = () => {
    setIsRecentMode((prev) => !prev);
  };

  const handleOutbound = (items: OutboundItem[]) => {
    console.log('출고 요청:', items);
    alert(`${items.length}개 상품의 출고가 완료되었습니다.`);
  };

  return (
    <div className="h-full flex-1 overflow-hidden bg-gray-100">
      <div className="grid h-full grid-cols-2 gap-3">
        {/* 입점 매장 목록 + 전체출고 */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <ShopList
            shops={MOCK_SHOPS}
            selectedId={selectedShopId}
            onRowClick={handleShopRowClick}
            onOutboundView={handleOutboundView}
          />
          <OutboundList
            records={outboundRecords}
            isRecentMode={isRecentMode}
            onToggleMode={handleToggleRecentMode}
          />
        </div>

        {/* 품목 */}
        <OutboundProductList
          products={displayedProducts}
          onOutbound={handleOutbound}
        />
      </div>
    </div>
  );
};

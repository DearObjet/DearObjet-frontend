import { useState } from 'react';

import { SettlementList } from '../components/settlement-list';
import { SettlementPeriodFilter } from '../components/settlement-period-filter';
import type {
  DateRange,
  SettlementItem,
} from '../types/settlement-history-types';

const MOCK_ITEMS: SettlementItem[] = [
  {
    settlementId: 1,
    shopName: '1번 소품샵',
    amount: 10000,
    settlementDate: '2025.03.19',
    identifier: 'SETTLE-ART123-202509-01',
  },
  {
    settlementId: 2,
    shopName: '2번 소품샵',
    amount: 10000,
    settlementDate: '2025.03.19',
    identifier: 'SETTLE-ART124-202509-01',
  },
  {
    settlementId: 3,
    shopName: '3번 소품샵',
    amount: 10000,
    settlementDate: '2025.03.20',
    identifier: 'SETTLE-ART125-202509-01',
  },
];

export const SettlementHistory = () => {
  const [items, setItems] = useState<SettlementItem[]>(MOCK_ITEMS);
  const [isLoading] = useState(false);

  const handleSearch = (_range: DateRange) => {
    console.log(_range);
    setItems(MOCK_ITEMS);
  };

  return (
    <div className="h-full flex-1 overflow-hidden bg-gray-100">
      <div className="flex h-full gap-3">
        <SettlementList items={items} isLoading={isLoading} />
        <SettlementPeriodFilter onSearch={handleSearch} />
      </div>
    </div>
  );
};

import { useState } from 'react';

import { ShopSettlementList } from '../components/shop-settlement-list';
import { RecentSettlementList } from '../components/recent-settlement-list';
import { TaxInvoiceList } from '../components/tax-invoice-list';
import {
  MOCK_RECENT_SETTLEMENTS,
  MOCK_SHOP_SETTLEMENTS,
  MOCK_TAX_INVOICE_ITEMS,
} from '../constants/settlement-management-mock-data';
import type { ShopSettlement } from '../types/settlement-management-types';

export const SettlementManagement = () => {
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );

  const handleShopRowClick = (shop: ShopSettlement) => {
    setSelectedContractId((prev) =>
      prev === shop.contractId ? null : shop.contractId
    );
  };

  const handleIssue = (id: number) => {
    // TODO: 백엔드 연동 후 API 호출로 교체
    console.log('세금계산서 발행 요청 id:', id);
    alert('세금계산서가 발행되었습니다.');
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden bg-gray-100">
      <div className="grid grid-cols-[3fr_2fr] gap-3">
        <ShopSettlementList
          shops={MOCK_SHOP_SETTLEMENTS}
          selectedId={selectedContractId}
          isLoading={false}
          onRowClick={handleShopRowClick}
        />
        <RecentSettlementList
          settlements={MOCK_RECENT_SETTLEMENTS}
          isLoading={false}
        />
      </div>

      <TaxInvoiceList
        items={MOCK_TAX_INVOICE_ITEMS}
        isLoading={false}
        onIssue={handleIssue}
      />
    </div>
  );
};

import { useState } from 'react';

import { ArtistSettlementList } from '../components/artist-settlement-list';
import { RecentSettlementList } from '../components/recent-settlement-list';
import { SettlementProductList } from '../components/settlement-product-list';
import {
  MOCK_RECENT_SETTLEMENTS,
  MOCK_SETTLEMENT_ARTISTS,
  MOCK_SETTLEMENT_PRODUCTS,
} from '../constants/settlement-mock-data';
import type { SettlementArtist } from '../types/settlement-calculation-types';

export const SettlementCalculation = () => {
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );

  const products =
    selectedContractId !== null
      ? (MOCK_SETTLEMENT_PRODUCTS[selectedContractId] ?? [])
      : [];

  const handleArtistRowClick = (artist: SettlementArtist) => {
    setSelectedContractId((prev) =>
      prev === artist.contractId ? null : artist.contractId
    );
  };

  const handleSettle = (selectedIds: number[]) => {
    // TODO: 백엔드 연동 후 API 호출로 교체
    console.log('정산 요청 productIds:', selectedIds);
    alert('정산이 완료되었습니다.');
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden bg-gray-100">
      <div className="grid grid-cols-[3fr_2fr] gap-3">
        <ArtistSettlementList
          artists={MOCK_SETTLEMENT_ARTISTS}
          selectedId={selectedContractId}
          isLoading={false}
          onRowClick={handleArtistRowClick}
        />
        <RecentSettlementList
          settlements={MOCK_RECENT_SETTLEMENTS}
          isLoading={false}
        />
      </div>

      <SettlementProductList
        products={products}
        isLoading={false}
        onSettle={handleSettle}
      />
    </div>
  );
};

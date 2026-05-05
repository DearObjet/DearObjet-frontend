import { useState, useEffect } from 'react';

import { ArtistList } from '../components/artist-list';
import { InboundMemo } from '../components/inbound-memo';
import { InboundRecordList } from '../components/inbound-record-list';
import {
  useGetInventoryArtistsQuery,
  useGetContractProductsQuery,
  useUpdateMemoMutation,
  useToggleInboundConfirmationMutation,
  useAddStockMovementMutation,
} from '../api/inbound-api';
import type { InboundArtist } from '../types/inbound';

export const InboundManagement = () => {
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [viewContractId, setViewContractId] = useState<number | null>(null);
  const [isRecentMode, setIsRecentMode] = useState(false);
  const [memoValue, setMemoValue] = useState('');

  const { data: artists = [], isLoading: isArtistsLoading } =
    useGetInventoryArtistsQuery();

  const { data: selectedArtistData, isFetching: isMemoFetching } =
    useGetContractProductsQuery(selectedArtistId!, {
      skip: selectedArtistId === null,
    });

  const { data: viewContractData, isLoading: isRecordsLoading } =
    useGetContractProductsQuery(viewContractId!, {
      skip: viewContractId === null,
    });

  const [updateMemo, { isLoading: isMemoSaving }] = useUpdateMemoMutation();
  const [toggleConfirmation] = useToggleInboundConfirmationMutation();
  const [addStockMovement] = useAddStockMovementMutation();

  useEffect(() => {
    if (selectedArtistId === null) {
      setMemoValue('');
      return;
    }
    if (selectedArtistData !== undefined) {
      setMemoValue(selectedArtistData.memo);
    }
  }, [selectedArtistId, selectedArtistData]);

  const records = viewContractData?.records ?? [];

  const handleArtistRowClick = (artist: InboundArtist) => {
    setSelectedArtistId((prev) => (prev === artist.id ? null : artist.id));
  };

  const handleInboundAllView = (contractId: number) => {
    setViewContractId(contractId);
    setIsRecentMode(false);
  };

  const handleInboundRecentView = (contractId: number) => {
    setViewContractId(contractId);
    setIsRecentMode(true);
  };

  const handleConfirmToggle = async (artistId: number) => {
    try {
      await toggleConfirmation(artistId).unwrap();
    } catch {
      alert('입고 확인 상태 변경에 실패했습니다.');
    }
  };

  const handleMemoSave = async () => {
    if (selectedArtistId === null) return;
    try {
      await updateMemo({
        contractId: selectedArtistId,
        memo: memoValue,
      }).unwrap();
      alert('메모가 저장되었습니다.');
    } catch {
      alert('메모 저장에 실패했습니다.');
    }
  };

  const handleMemoDelete = () => {
    setMemoValue('');
  };

  const handleStockSave = async (pendingStocks: Record<number, number>) => {
    if (viewContractId === null) return;

    const occurredAt = new Date().toISOString().slice(0, 19);

    const movements = Object.entries(pendingStocks)
      .map(([id, newStock]) => {
        const original = records.find((r) => r.id === Number(id));
        return {
          contractProductId: Number(id),
          delta: newStock - (original?.stock ?? 0),
        };
      })
      .filter(({ delta }) => delta !== 0);

    if (movements.length === 0) {
      alert('변경된 재고가 없습니다.');
      return;
    }

    try {
      await Promise.all(
        movements.map(({ contractProductId, delta }) =>
          addStockMovement({
            contractId: viewContractId,
            contractProductId,
            movementType: delta > 0 ? 'INBOUND' : 'ADJUSTMENT_DECREASE',
            quantity: Math.abs(delta),
            occurredAt,
          }).unwrap()
        )
      );
      alert('재고가 저장되었습니다.');
    } catch {
      alert('재고 저장에 실패했습니다.');
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden bg-gray-100">
      <div className="grid grid-cols-[3fr_2fr] gap-3">
        <ArtistList
          artists={artists}
          selectedId={selectedArtistId}
          isLoading={isArtistsLoading}
          onRowClick={handleArtistRowClick}
          onInboundAllView={handleInboundAllView}
          onInboundRecentView={handleInboundRecentView}
          onConfirmToggle={handleConfirmToggle}
        />
        <InboundMemo
          memo={memoValue}
          isDisabled={selectedArtistId === null}
          isSaving={isMemoSaving || isMemoFetching}
          onChange={setMemoValue}
          onSave={handleMemoSave}
          onDelete={handleMemoDelete}
        />
      </div>

      <InboundRecordList
        records={records}
        isRecentMode={isRecentMode}
        isLoading={isRecordsLoading}
        onStockSave={handleStockSave}
      />
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectChatRoom } from '../../../features/chat/slices/chat-slice';
import { useGetOrCreateDirectChatMutation } from '../../../features/chat/api/chat-api';
import { UserProfile } from '../../../shared/components/layout/aside/user-profile';
import { Post } from '../../../shared/components/common/post';
import { Button } from '../../../shared/components/ui';
import { ROUTES } from '../../../shared/constants';
import type {
  ShopContractItem,
  ShopSuggestionItem,
} from '../types/artist-tenant-types';
import {
  useGetShopContractsQuery,
  useGetShopContractDetailQuery,
  useGetShopSuggestionsQuery,
  // useReleaseCancellationMutation,
  // useReleaseRequestMutation,
} from '../api/artist-tenant-api';
import { ContractDocument } from '../components/contract-document';
import {
  TenantListTable,
  type TenantStatus,
} from '../components/tenant-list-table';

export const ShopTenantManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );
  const [releaseRequestedIds, setReleaseRequestedIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<ShopSuggestionItem | null>(null);

  const { data: contractsData } = useGetShopContractsQuery(userId!, {
    skip: !userId,
  });
  const { data: contractDetail } = useGetShopContractDetailQuery(
    { contractId: selectedContractId!, userId: userId! },
    { skip: !selectedContractId || !userId }
  );
  const { data: suggestionsData } = useGetShopSuggestionsQuery(userId!, {
    skip: !userId,
  });

  // const [releaseRequest] = useReleaseRequestMutation();
  // const [releaseCancellation] = useReleaseCancellationMutation();
  const [getOrCreateDirectChat] = useGetOrCreateDirectChatMutation();

  useEffect(() => {
    if (!contractDetail) return;
    if (contractDetail.contractRequestType === 'TERMINATION') {
      setReleaseRequestedIds((prev) =>
        new Set(prev).add(contractDetail.contractId)
      );
    } else {
      setReleaseRequestedIds((prev) => {
        const next = new Set(prev);
        next.delete(contractDetail.contractId);
        return next;
      });
    }
  }, [contractDetail]);

  const handleReleaseToggle = async (contractId: number) => {
    if (!userId) return;
    if (releaseRequestedIds.has(contractId)) {
      // await releaseCancellation({ contractId, userId });
      setReleaseRequestedIds((prev) => {
        const next = new Set(prev);
        next.delete(contractId);
        return next;
      });
    } else {
      // await releaseRequest({ contractId, userId });
      setReleaseRequestedIds((prev) => new Set(prev).add(contractId));
    }
  };

  const tenantItems =
    contractsData?.items.map((item: ShopContractItem) => {
      const releaseAction = item.actions.find(
        (a) => a.code === 'RELEASE_REQUEST' || a.code === 'RELEASE_CANCELLATION'
      );

      const nextAction = releaseRequestedIds.has(item.contractId)
        ? { code: 'RELEASE_CANCELLATION', label: '해제 취소' }
        : item.statusCode === 'EXTENSION_AVAILABLE'
          ? (releaseAction ?? { code: 'NONE', label: '없음' })
          : releaseAction
            ? { code: releaseAction.code, label: releaseAction.label }
            : (item.actions[0] ?? { code: 'NONE', label: '없음' });

      return {
        id: String(item.contractId),
        shopName: item.shopName,
        contractStart: item.contractStartDate,
        contractEnd: item.contractEndDate,
        status: item.statusLabel as TenantStatus,
        contract: '',
        nextAction,
        detailAvailable: item.detailAvailable,
      };
    }) ?? [];

  const handleView = (id: string) => {
    setSelectedContractId(Number(id));
    setSelectedSuggestion(null);
    setSelectedUserId(null);
  };

  const handleSelectSuggestion = (item: ShopSuggestionItem) => {
    setSelectedUserId(item.userId);
    setSelectedSuggestion(item);
    setSelectedContractId(null);
  };

  const handleSuggest = async () => {
    if (!selectedSuggestion) return;
    const room = await getOrCreateDirectChat(
      selectedSuggestion.userId
    ).unwrap();
    dispatch(selectChatRoom(room.roomId));
    navigate(ROUTES.ARTIST_MESSAGES);
  };

  const rightPanelContent = selectedSuggestion
    ? 'post'
    : selectedContractId
      ? 'contract'
      : 'empty';

  return (
    <div className="flex h-full gap-2">
      <div className="flex h-full flex-col gap-2">
        <section className="flex h-[39.1875rem] w-[46.8125rem] flex-col rounded-xl bg-white">
          <h2 className="hidden">입점처 리스트</h2>
          <TenantListTable
            items={tenantItems}
            onView={handleView}
            variant="artist"
            onActionClick={(id) => {
              const item = contractsData?.items.find(
                (i) => String(i.contractId) === id
              );
              if (item) {
                handleReleaseToggle(item.contractId);
              }
            }}
          />
        </section>

        <section className="flex h-[23.125rem] w-[46.8125rem] flex-col rounded-xl bg-white">
          <div className="ml-[1.625rem] mr-5 flex justify-between border-b border-b-gray-200">
            <h2 className="mt-5">입점 소품샵 제안</h2>
            <Button
              variant="secondaryDark"
              label="입점신청하기"
              className="mb-[0.4375rem] mt-[0.875rem]"
              disabled={!selectedSuggestion}
              onClick={handleSuggest}
            />
          </div>

          <div className="grid grid-cols-5 gap-y-2 p-2">
            {suggestionsData?.items.map((item: ShopSuggestionItem) => (
              <UserProfile
                key={item.userId}
                variant="author"
                userName={item.shopName}
                userId={String(item.userId)}
                userImage={item.shopImageUrl}
                isSelected={selectedUserId === item.userId}
                onAction={() => handleSelectSuggestion(item)}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="flex h-[63rem] w-full flex-col rounded-xl bg-white pb-[2.625rem]">
        {rightPanelContent === 'contract' && (
          <Button
            variant="secondaryDark"
            className="mr-5 mt-4 self-end"
            label="PDF로 내려받기"
          />
        )}
        <div className="flex h-full flex-col items-center justify-center">
          {rightPanelContent === 'post' && selectedSuggestion && (
            <Post
              userName={selectedSuggestion.shopName}
              userImage={selectedSuggestion.shopImageUrl}
              userId={String(selectedSuggestion.userId)}
              showSuggest={false}
              hasPost={false}
            />
          )}
          {rightPanelContent === 'contract' && contractDetail && (
            <div className="self-start pl-[1.875rem] pt-4">
              <ContractDocument contractDetail={contractDetail} />
            </div>
          )}
          {rightPanelContent === 'empty' && (
            <p className="text-gray-500">소품샵을 선택해주세요.</p>
          )}
        </div>
      </section>
    </div>
  );
};

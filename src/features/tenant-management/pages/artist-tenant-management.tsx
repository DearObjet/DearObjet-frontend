import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectChatRoom } from '../../../features/chat/slices/chat-slice';
import { useGetOrCreateDirectChatMutation } from '../../../features/chat/api/chat-api';
import { UserProfile } from '../../../shared/components/layout/aside/user-profile';
import { UserPostList } from '../../../shared/components/common/user-post-list';
import { Button } from '../../../shared/components/ui';
import { ROUTES } from '../../../shared/constants';
import {
  useGetArtistContractDetailQuery,
  useGetArtistContractsQuery,
  useGetArtistSuggestionsQuery,
} from '../api/artist-tenant-api';
import type {
  ArtistSuggestionItem,
  ArtistContractItem,
} from '../types/artist-tenant-types';
import { ContractDocument } from '../components/contract-document';
import {
  TenantListTable,
  type TenantStatus,
} from '../components/tenant-list-table';

export const ArtistTenantManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<ArtistSuggestionItem | null>(null);

  const { data: contractsData } = useGetArtistContractsQuery(userId!, {
    skip: !userId,
  });
  const { data: contractDetail } = useGetArtistContractDetailQuery(
    { contractId: selectedContractId!, userId: userId! },
    { skip: !selectedContractId || !userId }
  );
  const { data: suggestionsData } = useGetArtistSuggestionsQuery(userId!, {
    skip: !userId,
  });

  const [getOrCreateDirectChat] = useGetOrCreateDirectChatMutation();

  const tenantItems =
    contractsData?.items.map((item: ArtistContractItem) => ({
      id: String(item.contractId),
      shopName: item.artistName,
      contractStart: item.contractStartDate,
      contractEnd: item.contractEndDate,
      status: item.contractStatusLabel as TenantStatus,
      contract: '',
      nextAction: {
        code: item.nextAction.code,
        label:
          item.nextAction.code === 'WAITING_ARTIST_SUBMISSION'
            ? '대기'
            : item.nextAction.code === 'NONE'
              ? item.contractStatusLabel
              : item.nextAction.label,
      },
      detailAvailable: item.detailAvailable,
    })) ?? [];

  const handleView = (id: string) => {
    setSelectedContractId(Number(id));
    setSelectedSuggestion(null);
    setSelectedUserId(null);
  };

  const handleSelectSuggestion = (item: ArtistSuggestionItem) => {
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
    navigate(ROUTES.SHOP_MESSAGES);
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
          <h2 className="hidden">작가 리스트</h2>
          <TenantListTable
            items={tenantItems}
            onView={handleView}
            variant="shop"
          />
        </section>

        <section className="flex h-[23.125rem] w-[46.8125rem] flex-col rounded-xl bg-white">
          <div className="ml-[1.625rem] mr-5 flex justify-between border-b border-b-gray-200">
            <h2 className="mt-5">입점 작가 제안</h2>
            <Button
              variant="secondaryDark"
              label="입점 제안하기"
              className="mb-[0.4375rem] mt-[0.875rem]"
              disabled={!selectedSuggestion}
              onClick={handleSuggest}
            />
          </div>

          <div className="grid grid-cols-5 gap-y-2 p-2">
            {suggestionsData?.items.map((item: ArtistSuggestionItem) => (
              <UserProfile
                key={item.userId}
                variant="author"
                userName={item.artistName}
                userId={String(item.userId)}
                userImage={item.artistImageUrl}
                isSelected={selectedUserId === item.userId}
                onAction={() => handleSelectSuggestion(item)}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="flex h-[63rem] w-full flex-col items-center justify-center rounded-xl bg-white pb-[2.625rem]">
        <div className="ml-[1.875rem]">
          {rightPanelContent === 'post' && (
            <UserPostList
              userName={selectedSuggestion!.artistName}
              userImage={selectedSuggestion!.artistImageUrl}
              userId={selectedSuggestion!.userId}
              showSuggest={false}
            />
          )}
          {rightPanelContent === 'contract' && contractDetail && (
            <ContractDocument
              contractDetail={contractDetail}
              showDownload={true}
            />
          )}
          {rightPanelContent === 'empty' && (
            <p className="text-gray-500">작가를 선택해주세요.</p>
          )}
        </div>
      </section>
    </div>
  );
};

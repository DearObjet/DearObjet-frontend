import { useState } from 'react';

import { useAppSelector } from '../../../../app/hooks';
import { UserProfile } from '../../../../shared/components/layout/aside/user-profile';
import { Button } from '../../../../shared/components/ui';

import {
  TenantListTable,
  type TenantStatus,
} from '../../../artist/tenant-management/components/tenant-list-table';
import {
  useGetArtistContractDetailQuery,
  useGetArtistContractsQuery,
  useGetArtistSuggestionsQuery,
} from '../api/artist-tenant-api';
import { ContractDocument } from '../components/contract-document';

export const ArtistTenantManagement = () => {
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

  const tenantItems =
    contractsData?.items.map((item) => ({
      id: String(item.contractId),
      shopName: item.artistName,
      contractStart: item.contractStartDate,
      contractEnd: item.contractEndDate,
      status: item.contractStatusLabel as TenantStatus,
      contract: '',
      nextAction: item.nextAction,
      detailAvailable: item.detailAvailable,
    })) ?? [];

  const handleView = (id: string) => {
    setSelectedContractId(Number(id));
  };

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
            />
          </div>

          <div className="grid grid-cols-5 gap-y-2 p-2">
            {suggestionsData?.items.map((item) => (
              <UserProfile
                key={item.userId}
                variant="author"
                userName={item.artistName}
                userId={String(item.userId)}
                userImage={item.artistImageUrl}
                isSelected={selectedUserId === item.userId}
                onAction={() => setSelectedUserId(item.userId)}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="flex h-[63rem] w-full flex-col rounded-xl bg-white pb-[2.625rem]">
        <Button
          variant="secondaryDark"
          className="mr-5 mt-4 self-end"
          label="PDF로 내려받기"
        />

        <h2 className="mb-[2.1875rem] text-center text-[32px] font-medium">
          입점 계약서
        </h2>

        <div className="ml-[1.875rem]">
          {contractDetail ? (
            <ContractDocument contractDetail={contractDetail} />
          ) : (
            <p className="text-gray-500">작가를 선택해주세요.</p>
          )}
        </div>
      </section>
    </div>
  );
};

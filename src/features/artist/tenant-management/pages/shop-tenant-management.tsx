import { useState } from 'react';

import { Button } from '../../../../shared/components/ui';
import { UserProfile } from '../../../../shared/components/layout/aside/user-profile';

import { TenantListTable } from '../components/tenant-list-table';

const mockTenants = [
  {
    id: '1',
    shopName: '1번소품샵',
    contractStart: '2025.03.19',
    contractEnd: '2025.03.19',
    status: '계약완료' as const,
    contract: '1번소품샵의 계약서 내용입니다.',
  },
  {
    id: '2',
    shopName: '2번소품샵',
    contractStart: '2025.03.19',
    contractEnd: '2025.03.19',
    status: '계약대기' as const,
    contract: '2번소품샵의 계약서 내용입니다.',
  },
  {
    id: '3',
    shopName: '3번소품샵',
    contractStart: '2025.03.20',
    contractEnd: '2025.03.20',
    status: '계약연장' as const,
    contract: '3번소품샵의 계약서 내용입니다.',
  },
];

const suggestionItems = [
  { userName: '소품샵 이름', userId: 'user1', userImage: '' },
  { userName: '소품샵 이름', userId: 'user2', userImage: '' },
  { userName: '소품샵 이름', userId: 'user3', userImage: '' },
  { userName: '소품샵 이름', userId: 'user4', userImage: '' },
  { userName: '소품샵 이름', userId: 'user5', userImage: '' },
  { userName: '소품샵 이름', userId: 'user6', userImage: '' },
  { userName: '소품샵 이름', userId: 'user7', userImage: '' },
  { userName: '소품샵 이름', userId: 'user8', userImage: '' },
  { userName: '소품샵 이름', userId: 'user9', userImage: '' },
  { userName: '소품샵 이름', userId: 'user10', userImage: '' },
];

export const ShopTenantManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  const handleView = (id: string) => {
    const tenant = mockTenants.find((t) => t.id === id);
    setSelectedContract(tenant?.contract ?? null);
  };

  return (
    <div className="flex h-full gap-2">
      <div className="flex h-full flex-col gap-2">
        <section className="flex h-[39.1875rem] w-[46.8125rem] flex-col rounded-xl bg-white">
          <h2 className="hidden">입점처 리스트</h2>
          <TenantListTable
            items={mockTenants}
            onView={handleView}
            variant="artist"
          />
        </section>

        <section className="flex h-[23.125rem] w-[46.8125rem] flex-col rounded-xl bg-white">
          <div className="ml-[1.625rem] mr-5 flex justify-between border-b border-b-gray-200">
            <h2 className="mt-5">입점 소품샵 제안</h2>
            <Button
              variant="secondaryDark"
              label="입점신청하기"
              className="mb-[0.4375rem] mt-[0.875rem]"
            />
          </div>

          <div className="grid grid-cols-5 gap-y-2 p-2">
            {suggestionItems.map((item) => (
              <UserProfile
                key={item.userId}
                variant="author"
                userName={item.userName}
                userId={item.userId}
                userImage={item.userImage}
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
        <p className="ml-[1.875rem] h-[53.1875rem] w-[33.75rem] overflow-y-auto whitespace-pre-wrap break-words text-gray-700">
          {selectedContract ?? '소품샵을 선택해주세요.'}
        </p>
      </section>
    </div>
  );
};

import { useState } from 'react';
import { Button } from '../../../../shared/components/ui';
import { UserProfile } from '../../../../shared/components/layout/aside/user-profile';

const items = [
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

export const TenantManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="flex h-full gap-2">
      <div className="flex h-full flex-col gap-2">
        <section className="flex h-[39.1875rem] w-[46.8125rem] flex-col rounded-xl bg-white">
          <h2 className="hidden">입점처 리스트</h2>
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
            {items.map((item) => (
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
          계약서 내용
        </p>
      </section>
    </div>
  );
};

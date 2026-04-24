import { useState } from 'react';

import { Button } from '../../../shared/components/ui';
import { SelectBox } from '../../../shared/components/ui';

import { ProfileForm } from '../components/profile-form';
import { Input } from '../components/ui/input';

export const PartnerProfile = () => {
  const [instagram, setInstagram] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [bank, setBank] = useState('');
  const [bzeemail, setBzeemail] = useState('');
  const [hometaxApiKey, setHometaxApiKey] = useState('');

  const bankOptions = [
    { value: 'kb', label: 'KB국민은행' },
    { value: 'shinhan', label: '신한은행' },
    { value: 'woori', label: '우리은행' },
    { value: 'hana', label: '하나은행' },
    { value: 'kakao', label: '카카오뱅크' },
    { value: 'toss', label: '토스뱅크' },
  ];

  return (
    <div className="grid min-h-0 w-full flex-1 grid-cols-2 gap-3 bg-gray-100">
      <section className="flex h-full w-full justify-center rounded-xl bg-white p-8">
        <h3 className="hidden">개인 정보</h3>
        <div className="flex w-full justify-center">
          <ProfileForm>
            <Input
              id="business-phone"
              label="사업장 전화번호"
              type="text"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
            />
            <Input
              id="instagram"
              label="Instagram Business Account ID"
              type="text"
              prefix="@"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </ProfileForm>
        </div>
      </section>

      <section className="flex h-full w-full flex-col gap-10 rounded-xl bg-white px-[4.375rem] py-[3.125rem]">
        <div className="flex flex-col gap-3">
          <h3 className="mb-3">사업자 정보</h3>
          <div className="flex flex-col gap-2">
            <Input variant="horizontal" label="상호명" id="" readOnly />
            <Input variant="horizontal" label="사업자 번호" id="" readOnly />
            <Input variant="horizontal" label="대표자명" id="" readOnly />
            <Input variant="horizontal" label="사업자주소" id="" readOnly />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex">
            <h3 className="mb-3">정산 계좌</h3>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="min-w-28">은행</span>
              <SelectBox
                options={bankOptions}
                value={bank}
                onChange={setBank}
                placeholder="은행을 선택하세요"
                className="w-full"
              />
            </div>
            <Input variant="horizontal" label="계좌번호" id="" />
            <Input variant="horizontal" label="예금주" id="" />
            <div className="flex gap-4">
              <Input variant="horizontal" label="통장사본 업로드" id="" />
              <Button variant="secondaryDark" label="업로드" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="mb-3">세금 정보</h3>
          <div className="flex flex-col gap-2">
            <Input
              id="instagram"
              label="세금계산서 발행용 이메일"
              type="email"
              value={bzeemail}
              onChange={(e) => setBzeemail(e.target.value)}
            />

            <Input
              id="hometax-api-key"
              label="홈택스 API 연동 인증키 등록"
              type="text"
              value={hometaxApiKey}
              onChange={(e) => setHometaxApiKey(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="col-span-2 flex shrink-0 justify-center gap-3 py-8">
        <Button variant="secondaryLight" label="취소" className="w-[8.6rem]" />
        <Button variant="secondaryDark" label="저장" className="w-[8.6rem]" />
      </div>
    </div>
  );
};

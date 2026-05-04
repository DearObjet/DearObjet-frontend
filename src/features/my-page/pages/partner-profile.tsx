import { useState, useEffect, useRef, type ChangeEvent } from 'react';

import { Button } from '../../../shared/components/ui';
import { SelectBox } from '../../../shared/components/ui';

import {
  useGetBusinessProfileQuery,
  useUpdateBusinessProfileMutation,
} from '../api/my-page-api';
import { ProfileForm } from '../components/profile-form';
import type { ProfileFormRef } from '../components/profile-form';
import { Input } from '../components/ui/underline-input';

export const PartnerProfile = () => {
  const { data: businessProfile } = useGetBusinessProfileQuery();
  const [updateBusinessProfile] = useUpdateBusinessProfileMutation();
  const profileFormRef = useRef<ProfileFormRef>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessPhoneError, setBusinessPhoneError] = useState('');
  const [instagramError, setInstagramError] = useState('');
  const [bank, setBank] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountNumberError, setBankAccountNumberError] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountHolderError, setAccountHolderError] = useState('');
  const [bankbookImage, setBankbookImage] = useState<File | null>(null);
  const [bankbookImagePreview, setBankbookImagePreview] = useState('');
  const [bzeemail, setBzeemail] = useState('');
  const [bzeemailError, setBzeemailError] = useState('');

  const bankOptions = [
    { value: 'kb', label: 'KB국민은행' },
    { value: 'shinhan', label: '신한은행' },
    { value: 'woori', label: '우리은행' },
    { value: 'hana', label: '하나은행' },
    { value: 'kakao', label: '카카오뱅크' },
    { value: 'toss', label: '토스뱅크' },
  ];

  useEffect(() => {
    if (businessProfile) {
      setInstagram(businessProfile.instagramId ?? '');
      setBusinessPhone(
        businessProfile.businessPhoneNumber ?? businessProfile.phoneNumber ?? ''
      );
      setBank(businessProfile.bankName ?? '');
      setBankAccountNumber(businessProfile.bankAccountNumber ?? '');
      setAccountHolder(businessProfile.accountHolder ?? '');
      setBankbookImagePreview(businessProfile.bankbookImageUrl ?? '');
      setBzeemail(
        businessProfile.taxInvoiceEmail ?? businessProfile.email ?? ''
      );
    }
  }, [businessProfile]);

  const handleCancel = () => {
    if (businessProfile) {
      setInstagram(businessProfile.instagramId ?? '');
      setBusinessPhone(
        businessProfile.businessPhoneNumber ?? businessProfile.phoneNumber ?? ''
      );
      setBank(businessProfile.bankName ?? '');
      setBankAccountNumber(businessProfile.bankAccountNumber ?? '');
      setAccountHolder(businessProfile.accountHolder ?? '');
      setBankbookImagePreview(businessProfile.bankbookImageUrl ?? '');
      setBankbookImage(null);
      setBzeemail(
        businessProfile.taxInvoiceEmail ?? businessProfile.email ?? ''
      );
    }
    setBusinessPhoneError('');
    setInstagramError('');
    setBankAccountNumberError('');
    setAccountHolderError('');
    setBzeemailError('');
    setIsEditing(false);
  };

  const handleBankbookImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBankbookImage(file);
    setBankbookImagePreview(URL.createObjectURL(file));
  };

  const handleBusinessPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setBusinessPhone(raw);
    setBusinessPhoneError('');
  };

  const handleInstagramChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^a-zA-Z0-9._]/g, '');
    setInstagram(filtered);
    setInstagramError('');
  };

  const handleBankAccountNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setBankAccountNumber(raw);
    setBankAccountNumberError('');
  };

  const handleAccountHolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
    setAccountHolder(filtered);
    setAccountHolderError('');
  };

  const handleBzeemailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBzeemail(e.target.value);
    setBzeemailError('');
  };

  const validatePartnerFields = () => {
    let isValid = true;

    if (!businessPhone) {
      setBusinessPhoneError('필수 입력 항목입니다.');
      isValid = false;
    }

    if (instagram && !/^[a-zA-Z0-9._]+$/.test(instagram)) {
      setInstagramError('영문, 숫자, 마침표(.), 밑줄(_)만 입력 가능합니다.');
      isValid = false;
    }

    if (!bankAccountNumber) {
      setBankAccountNumberError('필수 입력 항목입니다.');
      isValid = false;
    }

    if (!accountHolder) {
      setAccountHolderError('필수 입력 항목입니다.');
      isValid = false;
    }

    if (bzeemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bzeemail)) {
      setBzeemailError('올바른 이메일 형식이 아닙니다.');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    const isProfileValid = profileFormRef.current?.validate() ?? true;
    const isPartnerValid = validatePartnerFields();

    if (!isProfileValid || !isPartnerValid) return;

    const profileImage = profileFormRef.current?.getProfileImage() ?? null;

    try {
      await updateBusinessProfile({
        businessPhoneNumber: businessPhone,
        instagramId: instagram,
        bankName: bank,
        bankAccountNumber,
        accountHolder,
        taxInvoiceEmail: bzeemail,
        ...(bankbookImage && { bankbookImage }),
        ...(profileImage && { profileImage }),
      }).unwrap();
      alert('저장되었습니다.');
      setIsEditing(false);
    } catch {
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="grid min-h-0 w-full flex-1 grid-cols-2 gap-3 bg-gray-100">
      <section className="flex h-full w-full justify-center rounded-xl bg-white p-8">
        <h3 className="hidden">개인 정보</h3>
        <div className="flex w-full justify-center">
          <ProfileForm ref={profileFormRef} isEditing={isEditing} isPartner>
            <div className="flex flex-col gap-1">
              <Input
                id="business-phone"
                label="사업장 전화번호"
                variant="horizontal"
                type="text"
                value={businessPhone}
                readOnly={!isEditing}
                onChange={handleBusinessPhoneChange}
              />
              {businessPhoneError && (
                <p className="text-sm text-red-400">{businessPhoneError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                id="instagram"
                label="Instagram Business Account ID"
                type="text"
                prefix="@"
                value={instagram}
                readOnly={!isEditing}
                onChange={handleInstagramChange}
              />
              {instagramError && (
                <p className="text-sm text-red-400">{instagramError}</p>
              )}
            </div>
          </ProfileForm>
        </div>
      </section>

      <section className="flex h-full w-full flex-col gap-10 rounded-xl bg-white px-[4.375rem] py-[3.125rem]">
        <div className="flex flex-col gap-3">
          <h3 className="mb-3">사업자 정보</h3>
          <div className="flex flex-col gap-2">
            <Input
              variant="horizontal"
              label="상호명"
              id="businessName"
              value={businessProfile?.businessName ?? ''}
              readOnly
            />
            <Input
              variant="horizontal"
              label="사업자 번호"
              id="businessNumber"
              value={businessProfile?.businessNumber ?? ''}
              readOnly
            />
            <Input
              variant="horizontal"
              label="대표자명"
              id="ownerName"
              value={businessProfile?.ownerName ?? ''}
              readOnly
            />
            <Input
              variant="horizontal"
              label="사업자주소"
              id="businessAddress"
              value={businessProfile?.businessAddress ?? ''}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="mb-3">정산 계좌</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="min-w-28">은행</span>
              <SelectBox
                options={bankOptions}
                value={bank}
                onChange={setBank}
                placeholder="은행을 선택하세요"
                className="w-full"
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Input
                variant="horizontal"
                label="계좌번호"
                id="bankAccountNumber"
                value={bankAccountNumber}
                readOnly={!isEditing}
                onChange={handleBankAccountNumberChange}
              />
              {bankAccountNumberError && (
                <p className="text-sm text-red-400">{bankAccountNumberError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                variant="horizontal"
                label="예금주"
                id="accountHolder"
                value={accountHolder}
                readOnly={!isEditing}
                onChange={handleAccountHolderChange}
              />
              {accountHolderError && (
                <p className="text-sm text-red-400">{accountHolderError}</p>
              )}
            </div>
            <div className="flex gap-4">
              <Input
                variant="horizontal"
                label="통장사본 업로드"
                id="bankbook-upload-display"
                value={
                  bankbookImage
                    ? bankbookImage.name
                    : bankbookImagePreview
                      ? '파일 등록됨'
                      : ''
                }
                readOnly
              />
              {isEditing && (
                <>
                  <Button
                    variant="secondaryDark"
                    label="업로드"
                    type="button"
                    onClick={() =>
                      document.getElementById('bankbook-upload')?.click()
                    }
                  />
                  <input
                    id="bankbook-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleBankbookImageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="mb-3">세금 정보</h3>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                id="bzeemail"
                label="세금계산서 발행용 이메일"
                type="email"
                value={bzeemail}
                readOnly={!isEditing}
                onChange={handleBzeemailChange}
              />
              {bzeemailError && (
                <p className="text-sm text-red-400">{bzeemailError}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="col-span-2 flex shrink-0 justify-center gap-3 py-4">
        {isEditing ? (
          <>
            <Button
              variant="secondaryLight"
              label="취소"
              className="w-[8.6rem]"
              onClick={handleCancel}
            />
            <Button
              variant="secondaryDark"
              label="저장"
              className="w-[8.6rem]"
              onClick={handleSave}
            />
          </>
        ) : (
          <Button
            variant="secondaryLight"
            label="수정"
            className="w-[8.6rem]"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

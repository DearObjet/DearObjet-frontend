import { type ChangeEvent, type FormEvent, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { RootState } from '../../../app/store';

import {
  Input,
  Button,
  Checkbox,
  SelectBox,
} from '../../../shared/components/ui';

import {
  toggleTerm,
  setAgreement,
  setAllAgreements,
  initialState as signupInitialState,
} from '../slices/signup-slice';
import { setAddress, setDetailAddress } from '../slices/signup-address-slice';
import {
  useCompleteShopSignupMutation,
  useCompleteArtistSignupMutation,
} from '../api/signup-api';
import type {
  AgreementKey,
  BusinessType,
  BusinessCategory,
  Specialty,
} from '../types/signup-types';
import {
  TERMS,
  BUSINESS_TYPE_OPTIONS,
  BUSINESS_CATEGORY_OPTIONS,
  SPECIALTY_OPTIONS,
} from '../constants/signup-constants';
import { usePhoneVerification } from '../hooks/use-phone-verification';
import {
  LabeledInput,
  LabeledInputWithButton,
  TermItemComponent,
} from './signup-common';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => DaumPostcode;
    };
  }
}

interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
}

interface DaumPostcode {
  open: () => void;
}

export const SignupPartner = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userType, openTerms, agreements } = useAppSelector(
    (state: RootState) => state.signup ?? signupInitialState
  );

  const { zipcode, roadAddress, detailAddress } = useAppSelector(
    (state: RootState) => state.signupAddress
  );

  const [completeShopSignup, { isLoading: isLoadingShop }] =
    useCompleteShopSignupMutation();
  const [completeArtistSignup, { isLoading: isLoadingArtist }] =
    useCompleteArtistSignupMutation();

  const isLoading = isLoadingShop || isLoadingArtist;

  const {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isPhoneVerified,
    isCodeExpired,
    timeLeft,
    isSendDisabled,
    formatTime,
    resetVerification,
    handleSendVerification,
    handleVerifyCode,
  } = usePhoneVerification();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null
  );

  const [formData, setFormData] = useState({
    phoneNumber: '',
    shopName: '',
    ownerName: '',
    businessNumber: '',
    businessType: '' as BusinessType | '',
    businessCategory: '' as BusinessCategory | '',
    specialty: '' as Specialty | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const formatBusinessNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
  };

  const clearError = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: '' }));

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');

    if (raw.length <= 11) {
      setFormData({ ...formData, phoneNumber: formatPhoneNumber(raw) });

      resetVerification();
      clearError('phoneNumber');
      clearError('phoneVerified');
    }
  };

  const handleBusinessNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');

    if (raw.length <= 10) {
      setFormData({ ...formData, businessNumber: formatBusinessNumber(raw) });
      clearError('businessNumber');
    }
  };

  const visibleTerms = TERMS.filter((term) =>
    term.showForUserTypes.includes(userType)
  );

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      const script = document.createElement('script');
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => openPostcode();
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        dispatch(
          setAddress({ zipcode: data.zonecode, roadAddress: data.roadAddress })
        );
        clearError('roadAddress');
      },
    }).open();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    const requiredTerms: AgreementKey[] = [
      'age',
      'terms',
      'businessInfo',
      'settlement',
      'fraud',
    ];

    if (!requiredTerms.every((key) => agreements[key])) {
      newErrors.terms = '필수 약관에 모두 동의해주세요.';
    }

    if (!formData.shopName) newErrors.shopName = '필수 입력 항목입니다.';
    if (!formData.ownerName) newErrors.ownerName = '필수 입력 항목입니다.';
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = '필수 입력 항목입니다.';
    } else if (isCodeSent && !isPhoneVerified) {
      newErrors.phoneVerified = '휴대폰 인증을 완료해주세요.';
    } else if (!isPhoneVerified) {
      newErrors.phoneVerified = '휴대폰 인증을 해주세요.';
    }
    if (!formData.businessNumber)
      newErrors.businessNumber = '필수 입력 항목입니다.';
    if (!formData.businessType)
      newErrors.businessType = '필수 입력 항목입니다.';
    if (!formData.businessCategory)
      newErrors.businessCategory = '필수 입력 항목입니다.';
    if (!formData.specialty) newErrors.specialty = '필수 입력 항목입니다.';
    if (!roadAddress) newErrors.roadAddress = '필수 입력 항목입니다.';
    if (!businessLicenseFile)
      newErrors.businessLicenseFile = '필수 입력 항목입니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const businessAddress = detailAddress
      ? `${roadAddress} ${detailAddress}`
      : roadAddress;

    const request = {
      marketingAgreement: agreements.marketing || false,
      reviewDataAgreement: agreements.customerData || false,
      businessNumber: formData.businessNumber.replace(/-/g, ''),
      businessName: formData.shopName,
      name: formData.shopName,
      smsAgreement: agreements.notification || false,
      businessAddress,
      phoneNumber: formData.phoneNumber.replace(/-/g, ''),
      businessType: formData.businessType as BusinessType,
      businessCategory: formData.businessCategory as BusinessCategory,
      specialty: formData.specialty as Specialty,
      ownerName: formData.ownerName,
    };

    try {
      if (userType === '소품샵') {
        await completeShopSignup({
          request,
          businessLicenseFile: businessLicenseFile!,
        }).unwrap();
      } else {
        await completeArtistSignup({
          request,
          businessLicenseFile: businessLicenseFile!,
        }).unwrap();
      }
      navigate('/');
    } catch {
      setErrors({ submit: '등록 신청에 실패했습니다. 다시 시도해주세요.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4"
    >
      <LabeledInput
        id="shopName"
        label="상호명"
        value={formData.shopName}
        error={errors.shopName}
        onChange={(e) => {
          setFormData({ ...formData, shopName: e.target.value });
          clearError('shopName');
        }}
      />

      <LabeledInput
        id="ownerName"
        label="대표자명"
        value={formData.ownerName}
        error={errors.ownerName}
        onChange={(e) => {
          setFormData({ ...formData, ownerName: e.target.value });
          clearError('ownerName');
        }}
      />

      <div className="flex flex-col gap-1">
        <LabeledInputWithButton
          id="phone"
          label="휴대폰번호"
          buttonLabel="휴대폰인증"
          buttonDisabled={isSendDisabled}
          type="tel"
          value={formData.phoneNumber}
          error={errors.phoneNumber}
          onChange={handlePhoneNumberChange}
          onButtonClick={() =>
            handleSendVerification(
              formData.phoneNumber.replace(/-/g, ''),
              (msg) => setErrors((prev) => ({ ...prev, phoneNumber: msg }))
            )
          }
        />

        {isCodeSent && !isPhoneVerified && (
          <>
            <div
              className={`flex w-full items-center rounded-md border px-3 py-2 ${
                isCodeExpired || errors.verificationCode
                  ? 'border-red-400'
                  : 'border-gray-900'
              }`}
            >
              <input
                placeholder="인증코드 6자리"
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  clearError('verificationCode');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleVerifyCode(
                      formData.phoneNumber.replace(/-/g, ''),
                      () =>
                        setErrors((prev) => ({
                          ...prev,
                          phoneVerified: '',
                          verificationCode: '',
                        })),
                      (msg) =>
                        setErrors((prev) => ({
                          ...prev,
                          verificationCode: msg,
                        }))
                    );
                  }
                }}
                maxLength={6}
                disabled={isCodeExpired}
              />
              <span className="mr-3 text-sm text-red-500">
                {formatTime(timeLeft)}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleVerifyCode(
                    formData.phoneNumber.replace(/-/g, ''),
                    () =>
                      setErrors((prev) => ({
                        ...prev,
                        phoneVerified: '',
                        verificationCode: '',
                      })),
                    (msg) =>
                      setErrors((prev) => ({
                        ...prev,
                        verificationCode: msg,
                      }))
                  )
                }
                disabled={!verificationCode || isCodeExpired}
                className="text-sm text-black disabled:cursor-not-allowed disabled:text-gray-300"
              >
                확인
              </button>
            </div>

            {isCodeExpired && (
              <p className="text-sm text-red-400">
                유효시간이 지났어요. &apos;휴대폰 인증&apos;을 다시 해주세요.
              </p>
            )}
            {errors.verificationCode && !isCodeExpired && (
              <p className="text-sm text-red-400">{errors.verificationCode}</p>
            )}
          </>
        )}

        {errors.phoneVerified && (
          <p className="text-sm text-red-400">{errors.phoneVerified}</p>
        )}

        {isPhoneVerified && (
          <p className="text-sm text-blue-200">✓ 휴대폰 인증 완료</p>
        )}
      </div>

      <LabeledInput
        id="shopNumber"
        label="사업자 등록번호"
        value={formData.businessNumber}
        error={errors.businessNumber}
        onChange={handleBusinessNumberChange}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="shopAddress"
          className={errors.roadAddress ? 'text-red-400' : ''}
        >
          사업자 주소지
        </label>
        <div className="flex gap-2">
          <Input
            id="zipcode"
            value={zipcode}
            readOnly
            className={errors.roadAddress ? 'border-red-400' : ''}
          />
          <Button
            label="주소찾기"
            variant="secondaryDark"
            onClick={openPostcode}
            type="button"
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            id="shopAddress"
            className={`w-full ${errors.roadAddress ? 'border-red-400' : ''}`}
            value={roadAddress}
            readOnly
          />
          <Input
            id="shopAddressDetail"
            value={detailAddress}
            onChange={(e) => dispatch(setDetailAddress(e.target.value))}
            className="w-full"
            placeholder="상세주소"
          />
        </div>
        {errors.roadAddress && (
          <p className="text-sm text-red-400">{errors.roadAddress}</p>
        )}
      </div>

      <div className="flex w-full gap-2">
        <div className="flex w-full flex-col">
          <label
            htmlFor="businessType"
            className={errors.businessType ? 'text-red-400' : ''}
          >
            업종
          </label>
          <SelectBox
            options={BUSINESS_TYPE_OPTIONS}
            placeholder="업종을 선택해주세요."
            value={formData.businessType}
            onChange={(value) => {
              setFormData({
                ...formData,
                businessType: value as BusinessType | '',
              });
              clearError('businessType');
            }}
            error={errors.businessType}
          />
          {errors.businessType && (
            <p className="text-sm text-red-400">{errors.businessType}</p>
          )}
        </div>
        <div className="flex w-full flex-col">
          <label
            htmlFor="businessCategory"
            className={errors.businessCategory ? 'text-red-400' : ''}
          >
            업태
          </label>
          <SelectBox
            options={BUSINESS_CATEGORY_OPTIONS}
            value={formData.businessCategory}
            placeholder="업태를 선택해주세요."
            onChange={(value) => {
              setFormData({
                ...formData,
                businessCategory: value as BusinessCategory | '',
              });
              clearError('businessCategory');
            }}
            error={errors.businessCategory}
          />
          {errors.businessCategory && (
            <p className="text-sm text-red-400">{errors.businessCategory}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="businessCert"
          className={errors.businessLicenseFile ? 'text-red-400' : ''}
        >
          사업자등록증 업로드
        </label>
        <div className="flex w-full gap-2">
          <Input
            id="businessCert"
            className={`flex-1 ${errors.businessLicenseFile ? 'border-red-400' : ''}`}
            value={businessLicenseFile?.name ?? ''}
            readOnly
            placeholder="파일을 선택해주세요"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBusinessLicenseFile(file);
                clearError('businessLicenseFile');
              }
            }}
          />
          <Button
            label="업로드"
            variant="secondaryDark"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          />
        </div>
        {errors.businessLicenseFile && (
          <p className="text-sm text-red-400">{errors.businessLicenseFile}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <label
          htmlFor="specialty"
          className={errors.specialty ? 'text-red-400' : ''}
        >
          주요 카테고리
        </label>
        <SelectBox
          options={SPECIALTY_OPTIONS}
          value={formData.specialty}
          placeholder="주요 카테고리를 선택해주세요."
          onChange={(value) => {
            setFormData({
              ...formData,
              specialty: value as Specialty | '',
            });
            clearError('specialty');
          }}
          error={errors.specialty}
        />
        {errors.specialty && (
          <p className="text-sm text-red-400">{errors.specialty}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-medium">약관동의</span>
        <div className="flex flex-col gap-2 border bg-gray-900 p-3 text-white">
          <Checkbox
            id="agree-all"
            label="전체동의"
            checked={agreements.all}
            onChange={(isChecked: boolean) => {
              dispatch(setAllAgreements(isChecked));
              clearError('terms');
            }}
            className="border-b border-gray-300 pb-2"
          />
          {visibleTerms.map((term) => (
            <TermItemComponent
              key={term.key}
              term={term}
              checked={agreements[term.key]}
              isOpen={openTerms[term.key]}
              onCheck={(isChecked: boolean) => {
                dispatch(setAgreement({ key: term.key, isChecked }));
                clearError('terms');
              }}
              onToggle={() => dispatch(toggleTerm(term.key))}
            />
          ))}
        </div>
        {errors.terms && <p className="text-sm text-red-400">{errors.terms}</p>}
      </div>

      {errors.submit && <p className="text-sm text-red-400">{errors.submit}</p>}

      <div className="flex gap-2">
        <Button
          type="submit"
          label={userType === '소품샵' ? '소품샵 등록 신청' : '작가 등록 신청'}
          variant="secondaryDark"
          disabled={isLoading}
          className="flex-1"
        />
      </div>
    </form>
  );
};

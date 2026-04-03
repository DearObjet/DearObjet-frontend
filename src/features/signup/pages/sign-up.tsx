import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';

import {
  Input,
  Button,
  Checkbox,
  SelectBox,
} from '../../../shared/components/ui';

import {
  setUserType,
  toggleTerm,
  setAgreement,
  setAllAgreements,
  initialState as signupInitialState,
} from '../slices/signup-slice';
import { setAddress, setDetailAddress } from '../slices/signup-address-slice';

import type { RootState } from '../../../app/store';
import type {
  AgreementKey,
  BusinessCategory,
  BusinessType,
  CompleteSignupRequest,
  Specialty,
  TermItem,
} from '../types/signup-types';
import {
  useCompleteArtistSignupMutation,
  useCompleteShopSignupMutation,
  useCompleteSignupMutation,
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation,
} from '../api/signup-api';
import {
  BUSINESS_CATEGORY_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  SPECIALTY_OPTIONS,
  SUBMIT_BUTTON_LABELS,
  TERMS,
  USER_TYPES,
} from '../constants/signup-constants';

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

interface LabeledInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'password' | 'tel';
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  error?: string;
}

const LabeledInput = ({
  id,
  label,
  type = 'text',
  className = '',
  placeholder,
  value,
  onChange,
  readOnly,
  error,
}: LabeledInputProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label htmlFor={id} className={error ? 'text-red-400' : ''}>
      {label}
    </label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

interface LabeledInputWithButtonProps extends LabeledInputProps {
  buttonLabel: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
}

const LabeledInputWithButton = ({
  id,
  label,
  type = 'text',
  buttonLabel,
  onButtonClick,
  buttonDisabled,
  placeholder,
  value,
  onChange,
  readOnly,
  error,
}: LabeledInputWithButtonProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className={error ? 'text-red-400' : ''}>
      {label}
    </label>
    <div className="flex w-full gap-2">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`flex-1 ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Button
        label={buttonLabel}
        variant="secondaryDark"
        onClick={onButtonClick}
        type="button"
        disabled={buttonDisabled}
      />
    </div>
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

interface TermItemProps {
  term: TermItem;
  checked: boolean;
  isOpen: boolean;
  onCheck: (isChecked: boolean) => void;
  onToggle: () => void;
}

const TermItemComponent = ({
  term,
  checked,
  isOpen,
  onCheck,
  onToggle,
}: TermItemProps) => (
  <>
    <div className="flex justify-between">
      <Checkbox
        id={`agree-${term.key}`}
        label={term.label}
        checked={checked}
        onChange={onCheck}
      />
      {term.hasDetail && (
        <ChevronRight className="cursor-pointer" onClick={onToggle} />
      )}
    </div>
    {isOpen && term.hasDetail && (
      <p className="text-sm text-gray-600">{'내용'.repeat(50)}</p>
    )}
  </>
);

export const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userType, openTerms, agreements } = useSelector(
    (state: RootState) => state.signup ?? signupInitialState
  );

  const signupRequired = useSelector(
    (state: RootState) => state.auth.signupRequired
  );

  const { zipcode, roadAddress, detailAddress } = useSelector(
    (state: RootState) => state.signupAddress
  );

  const [completeSignup, { isLoading: isLoadingCustomer }] =
    useCompleteSignupMutation();
  const [completeShopSignup, { isLoading: isLoadingShop }] =
    useCompleteShopSignupMutation();
  const [completeArtistSignup, { isLoading: isLoadingArtist }] =
    useCompleteArtistSignupMutation();
  const [sendPhoneVerification] = useSendPhoneVerificationMutation();
  const [verifyPhone] = useVerifyPhoneMutation();

  const isLoading = isLoadingCustomer || isLoadingShop || isLoadingArtist;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    shopName: '',
    ownerName: '',
    businessNumber: '',
    businessType: '' as BusinessType | '',
    businessCategory: '' as BusinessCategory | '',
    specialty: '' as Specialty | '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSendDisabled, setIsSendDisabled] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isBusinessUser = userType !== '일반회원';
  const visibleTerms = TERMS.filter((term) =>
    term.showForUserTypes.includes(userType)
  );

  useEffect(() => {
    if (!signupRequired) {
      navigate('/');
    }
  }, [signupRequired, navigate]);

  useEffect(() => {
    if (!isCodeSent || isPhoneVerified) return;
    setTimeLeft(180);
    setIsCodeExpired(false);
    setIsSendDisabled(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCodeExpired(true);
          setIsSendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCodeSent, isPhoneVerified]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const clearError = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: '' }));

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

  const handleSendVerification = async () => {
    if (!formData.phoneNumber) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: '휴대폰번호를 입력해주세요.',
      }));
      return;
    }
    try {
      await sendPhoneVerification({
        phoneNumber: formData.phoneNumber,
      }).unwrap();
      setIsCodeSent(false);
      setTimeout(() => setIsCodeSent(true), 0);
      setIsPhoneVerified(false);
      setIsCodeExpired(false);
      setVerificationCode('');
    } catch {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      }));
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증번호를 입력해주세요.',
      }));
      return;
    }
    try {
      const result = await verifyPhone({
        phoneNumber: formData.phoneNumber,
        code: verificationCode,
      }).unwrap();

      if (result.verified) {
        setIsPhoneVerified(true);
        setIsSendDisabled(true);
        setErrors((prev) => ({
          ...prev,
          phoneVerified: '',
          verificationCode: '',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          verificationCode: '인증번호가 올바르지 않습니다.',
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증에 실패했습니다. 다시 시도해주세요.',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    const requiredTerms: AgreementKey[] = ['age', 'terms'];
    if (userType !== '일반회원') {
      requiredTerms.push('businessInfo', 'settlement', 'fraud');
    }

    if (!requiredTerms.every((key) => agreements[key])) {
      newErrors.terms = '필수 약관에 모두 동의해주세요.';
    }

    if (userType === '일반회원') {
      if (!formData.name) newErrors.name = '필수 입력 항목입니다.';
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = '필수 입력 항목입니다.';
      } else if (isCodeSent && !isPhoneVerified) {
        newErrors.phoneVerified = '휴대폰 인증을 완료해주세요.';
      } else if (!isPhoneVerified) {
        newErrors.phoneVerified = '휴대폰 인증을 해주세요.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const requestData: CompleteSignupRequest = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          smsAgreement: agreements.notification || false,
          marketingAgreement: agreements.marketing || false,
        };
        await completeSignup(requestData).unwrap();
        navigate('/');
      } catch {
        setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
      }
      return;
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
      businessNumber: formData.businessNumber,
      businessName: formData.shopName,
      name: formData.shopName,
      smsAgreement: agreements.notification || false,
      businessAddress,
      phoneNumber: formData.phoneNumber,
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
    <div className="flex w-screen flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-md gap-2">
        {USER_TYPES.map((type) => (
          <Button
            key={type.value}
            label={type.label}
            variant={
              userType === type.value ? 'secondaryDark' : 'secondaryLight'
            }
            onClick={() => {
              dispatch(setUserType(type.value));
              setErrors({});
            }}
            className="flex-1"
            type="button"
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4"
      >
        {!isBusinessUser && (
          <LabeledInput
            id="username"
            label="이름"
            value={formData.name}
            error={errors.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              clearError('name');
            }}
          />
        )}

        <div className="flex flex-col gap-1">
          <LabeledInputWithButton
            id="phone"
            label="휴대폰번호"
            buttonLabel="휴대폰인증"
            buttonDisabled={isSendDisabled}
            type="tel"
            value={formData.phoneNumber}
            error={errors.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
              setIsCodeSent(false);
              setIsPhoneVerified(false);
              setIsCodeExpired(false);
              setIsSendDisabled(false);
              clearError('phoneNumber');
              clearError('phoneVerified');
            }}
            onButtonClick={handleSendVerification}
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
                      handleVerifyCode();
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
                  onClick={handleVerifyCode}
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
                <p className="text-sm text-red-400">
                  {errors.verificationCode}
                </p>
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

        {isBusinessUser && (
          <>
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

            <LabeledInput
              id="shopNumber"
              label="사업자 등록번호"
              value={formData.businessNumber}
              error={errors.businessNumber}
              onChange={(e) => {
                setFormData({ ...formData, businessNumber: e.target.value });
                clearError('businessNumber');
              }}
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
                  <p className="text-sm text-red-400">
                    {errors.businessCategory}
                  </p>
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
                <p className="text-sm text-red-400">
                  {errors.businessLicenseFile}
                </p>
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
          </>
        )}

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
          {errors.terms && (
            <p className="text-sm text-red-400">{errors.terms}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-sm text-red-400">{errors.submit}</p>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            label={SUBMIT_BUTTON_LABELS[userType]}
            variant="secondaryDark"
            disabled={isLoading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
};

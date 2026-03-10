import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { SelectBox } from '../components/ui/selectbox';

import {
  setUserType,
  toggleTerm,
  setAgreement,
  setAllAgreements,
  initialState as signupInitialState,
} from '../store/slices/signup-slice';

import {
  setAddress,
  setDetailAddress,
} from '../store/slices/signup-address-slice';

import {
  useCompleteSignupMutation,
  useCompleteShopSignupMutation,
  useCompleteArtistSignupMutation,
} from '../store/api/authApi';
import type { RootState } from '../store/index';
import type {
  CompleteSignupRequest,
  BusinessType,
  BusinessCategory,
  Specialty,
} from '../types/authTypes';

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

type UserType = '일반회원' | '작가' | '소품샵';
type AgreementKey =
  | 'all'
  | 'age'
  | 'terms'
  | 'businessInfo'
  | 'settlement'
  | 'fraud'
  | 'customerData'
  | 'marketing'
  | 'notification';

const USER_TYPES: { value: UserType; label: string }[] = [
  { value: '일반회원', label: '일반회원' },
  { value: '작가', label: '작가' },
  { value: '소품샵', label: '소품샵' },
];

interface TermItem {
  key: AgreementKey;
  label: string;
  hasDetail: boolean;
  showForUserTypes: UserType[];
}

const TERMS: TermItem[] = [
  {
    key: 'age',
    label: '만 14세 이상입니다 (필수)',
    hasDetail: false,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
  {
    key: 'terms',
    label: '이용약관 (필수)',
    hasDetail: true,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
  {
    key: 'businessInfo',
    label: '사업자 정보 확인 및 등록 동의 (필수)',
    hasDetail: true,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'settlement',
    label: '정산 및 수수료 정책 동의 (필수)',
    hasDetail: false,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'fraud',
    label: '부정거래 방지 및 제재 정책 동의 (필수)',
    hasDetail: true,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'customerData',
    label: '고객 리뷰 및 데이터 활용 동의 (선택)',
    hasDetail: false,
    showForUserTypes: ['작가', '소품샵'],
  },
  {
    key: 'marketing',
    label: '개인정보 마케팅 활용동의 (선택)',
    hasDetail: true,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
  {
    key: 'notification',
    label: '이벤트, 쿠폰, 특가 알림 메일 및 sms 등 수신 (선택)',
    hasDetail: false,
    showForUserTypes: ['일반회원', '작가', '소품샵'],
  },
];

const SUBMIT_BUTTON_LABELS: Record<UserType, string> = {
  일반회원: '회원가입하기',
  작가: '작가 등록 신청',
  소품샵: '소품샵 등록 신청',
};

const BUSINESS_TYPE_OPTIONS: { value: BusinessType | ''; label: string }[] = [
  { value: '', label: '' },
  { value: 'SERVICE', label: '서비스업' },
  { value: 'WHOLESALE_RETAIL', label: '도·소매업' },
];

const BUSINESS_CATEGORY_OPTIONS: {
  value: BusinessCategory | '';
  label: string;
}[] = [
  { value: '', label: '' },
  { value: 'ONLINE_MARKETPLACE', label: '통신판매중개업' },
  { value: 'ECOMMERCE_PLATFORM', label: '전자상거래 플랫폼 운영업' },
  { value: 'ECOMMERCE_RETAIL', label: '전자상거래 소매업' },
  { value: 'GENERAL_RETAIL', label: '잡화 소매업' },
  { value: 'CRAFT_RETAIL', label: '공예품 소매업' },
];

const SPECIALTY_OPTIONS: { value: Specialty | ''; label: string }[] = [
  { value: '', label: '' },
  { value: 'STATIONERY_PAPER', label: '문구·페이퍼 소품' },
  { value: 'INTERIOR_DECOR', label: '인테리어 소품' },
  { value: 'LIVING_GOODS', label: '리빙·생활잡화' },
  { value: 'DESK_OFFICE', label: '데스크·오피스 소품' },
  { value: 'EMOTIONAL_GOODS_GIFT', label: '감성 굿즈·기프트' },
  { value: 'HANDMADE_CRAFT', label: '핸드메이드·공예' },
  { value: 'ILLUSTRATION_ART_GOODS', label: '일러스트·아트굿즈' },
  { value: 'CERAMIC', label: '도자기·세라믹' },
  { value: 'FABRIC_TEXTILE', label: '패브릭·자수·텍스타일' },
  { value: 'ECO_UPCYCLE', label: '친환경·업사이클 소품' },
];

interface LabeledInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'password' | 'tel';
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
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
}: LabeledInputProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label htmlFor={id}>{label}</label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      className="w-full"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

interface LabeledInputWithButtonProps extends LabeledInputProps {
  buttonLabel: string;
  onButtonClick?: () => void;
}

const LabeledInputWithButton = ({
  id,
  label,
  type = 'text',
  buttonLabel,
  onButtonClick,
  placeholder,
  value,
  onChange,
  readOnly,
}: LabeledInputWithButtonProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id}>{label}</label>
    <div className="flex w-full gap-2">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="flex-1"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      <Button
        label={buttonLabel}
        variant="secondaryDark"
        onClick={onButtonClick}
        type="button"
      />
    </div>
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

export function Signup() {
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

  const isBusinessUser = userType !== '일반회원';
  const visibleTerms = TERMS.filter((term) =>
    term.showForUserTypes.includes(userType)
  );

  useEffect(() => {
    if (!signupRequired) {
      navigate('/');
    }
  }, [signupRequired, navigate]);

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
          setAddress({
            zipcode: data.zonecode,
            roadAddress: data.roadAddress,
          })
        );
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredTerms: AgreementKey[] = ['age', 'terms'];
    if (userType !== '일반회원') {
      requiredTerms.push('businessInfo', 'settlement', 'fraud');
    }

    const allRequiredAgreed = requiredTerms.every((key) => agreements[key]);
    if (!allRequiredAgreed) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }

    if (userType === '일반회원') {
      if (!formData.name || !formData.phoneNumber) {
        alert('필수 정보를 모두 입력해주세요.');
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

        alert('회원가입이 완료되었습니다!');
        navigate('/');
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      return;
    }

    if (
      !formData.shopName ||
      !formData.ownerName ||
      !formData.phoneNumber ||
      !formData.businessNumber ||
      !formData.businessType ||
      !formData.businessCategory ||
      !formData.specialty ||
      !roadAddress ||
      !businessLicenseFile
    ) {
      alert('사업자 정보를 모두 입력해주세요.');
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
        await completeShopSignup({ request, businessLicenseFile }).unwrap();
      } else {
        await completeArtistSignup({ request, businessLicenseFile }).unwrap();
      }

      alert('등록 신청이 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('가입 실패:', error);
      alert('등록 신청에 실패했습니다. 다시 시도해주세요.');
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
            onClick={() => dispatch(setUserType(type.value))}
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        )}

        <LabeledInputWithButton
          id="phone"
          label="휴대폰번호"
          buttonLabel="휴대폰인증"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />

        {isBusinessUser && (
          <>
            <LabeledInput
              id="shopName"
              label="상호명"
              value={formData.shopName}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
            />

            <LabeledInput
              id="ownerName"
              label="대표자명"
              value={formData.ownerName}
              onChange={(e) =>
                setFormData({ ...formData, ownerName: e.target.value })
              }
            />

            <LabeledInput
              id="shopNumber"
              label="사업자 등록번호"
              value={formData.businessNumber}
              onChange={(e) =>
                setFormData({ ...formData, businessNumber: e.target.value })
              }
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="shopAddress">사업자 주소지</label>
              <div className="flex gap-2">
                <Input id="zipcode" value={zipcode} readOnly />
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
                  className="w-full"
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
            </div>

            <div className="flex w-full gap-2">
              <div className="flex w-full flex-col">
                <label htmlFor="businessType">업종</label>
                <SelectBox
                  options={BUSINESS_TYPE_OPTIONS}
                  value={formData.businessType}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      businessType: value as BusinessType | '',
                    })
                  }
                />
              </div>
              <div className="flex w-full flex-col">
                <label htmlFor="businessCategory">업태</label>
                <SelectBox
                  options={BUSINESS_CATEGORY_OPTIONS}
                  value={formData.businessCategory}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      businessCategory: value as BusinessCategory | '',
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="businessCert">사업자등록증 업로드</label>
              <div className="flex w-full gap-2">
                <Input
                  id="businessCert"
                  className="flex-1"
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
                    if (file) setBusinessLicenseFile(file);
                  }}
                />
                <Button
                  label="업로드"
                  variant="secondaryDark"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <label htmlFor="specialty">주요 카테고리</label>
              <SelectBox
                options={SPECIALTY_OPTIONS}
                value={formData.specialty}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    specialty: value as Specialty | '',
                  })
                }
              />
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
              onChange={(isChecked: boolean) =>
                dispatch(setAllAgreements(isChecked))
              }
              className="border-b border-gray-300 pb-2"
            />
            {visibleTerms.map((term) => (
              <TermItemComponent
                key={term.key}
                term={term}
                checked={agreements[term.key]}
                isOpen={openTerms[term.key]}
                onCheck={(isChecked: boolean) =>
                  dispatch(setAgreement({ key: term.key, isChecked }))
                }
                onToggle={() => dispatch(toggleTerm(term.key))}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            label={isLoading ? '처리 중...' : SUBMIT_BUTTON_LABELS[userType]}
            variant="secondaryDark"
            disabled={isLoading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}

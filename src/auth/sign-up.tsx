import React, { useState, useEffect } from 'react';
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

import { useCompleteSignupMutation } from '../store/api/authApi';
import type { RootState } from '../store/index';
import type { CompleteSignupRequest } from '../types/authTypes';

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

interface LabeledInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'password' | 'email' | 'tel';
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

  const [completeSignup, { isLoading }] = useCompleteSignupMutation();

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    // 사업자 정보
    shopName: '',
    businessNumber: '',
    businessType: '',
    businessCategory: '',
    mainCategory: '',
  });

  const isBusinessUser = userType !== '일반회원';
  const visibleTerms = TERMS.filter((term) =>
    term.showForUserTypes.includes(userType)
  );

  // OAuth 로그인 없이 접근한 경우 메인으로 리다이렉트
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

    // 역할 매핑
    const roleMap: Record<UserType, 'CUSTOMER' | 'ARTIST' | 'SHOP'> = {
      일반회원: 'CUSTOMER',
      작가: 'ARTIST',
      소품샵: 'SHOP',
    };

    // 필수 약관 체크
    const requiredTerms: AgreementKey[] = ['age', 'terms'];
    if (userType !== '일반회원') {
      requiredTerms.push('businessInfo', 'settlement', 'fraud');
    }

    const allRequiredAgreed = requiredTerms.every((key) => agreements[key]);
    if (!allRequiredAgreed) {
      alert('필수 약관에 모두 동의해주세요.');
      return;
    }

    // 폼 검증
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // 사업자 정보 검증
    if (isBusinessUser) {
      if (
        !formData.shopName ||
        !formData.businessNumber ||
        !zipcode ||
        !roadAddress
      ) {
        alert('사업자 정보를 모두 입력해주세요.');
        return;
      }
    }

    try {
      const requestData: CompleteSignupRequest = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        smsAgreement: agreements.notification || false,
        marketingAgreement: agreements.marketing || false,
        role: roleMap[userType],
      };

      await completeSignup(requestData).unwrap();

      alert('회원가입이 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
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
          // placeholder="010-1234-5678"
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
              id="username"
              label="대표자명"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <LabeledInput
              id="shopNumber"
              label="사업자 등록번호"
              value={formData.businessNumber}
              onChange={(e) =>
                setFormData({ ...formData, businessNumber: e.target.value })
              }
              // placeholder="000-00-00000"
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
                  options={[
                    { value: '', label: '' },
                    { value: 'retail', label: '소매업' },
                    { value: 'manufacturing', label: '제조업' },
                  ]}
                  value={formData.businessType}
                  onChange={(value) =>
                    setFormData({ ...formData, businessType: value })
                  }
                />
              </div>
              <div className="flex w-full flex-col">
                <label htmlFor="businessCategory">업태</label>
                <SelectBox
                  options={[
                    { value: '', label: '' },
                    { value: 'craft', label: '공예품' },
                    { value: 'art', label: '예술품' },
                  ]}
                  value={formData.businessCategory}
                  onChange={(value) =>
                    setFormData({ ...formData, businessCategory: value })
                  }
                />
              </div>
            </div>

            <LabeledInputWithButton
              id="businessCert"
              label="사업자등록증 업로드"
              buttonLabel="업로드"
              // placeholder="파일을 선택해주세요"
            />

            <div className="flex w-full flex-col gap-2">
              <label htmlFor="mainCategory">주요 카테고리</label>
              <SelectBox
                options={[
                  { value: '', label: '' },
                  { value: 'pottery', label: '도자기' },
                  { value: 'textile', label: '섬유/직물' },
                  { value: 'wood', label: '목공예' },
                  { value: 'metal', label: '금속공예' },
                ]}
                value={formData.mainCategory}
                onChange={(value) =>
                  setFormData({ ...formData, mainCategory: value })
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

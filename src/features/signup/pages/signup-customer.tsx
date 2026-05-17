import { type ChangeEvent, type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { RootState } from '../../../app/store';

import { Button, Checkbox } from '../../../shared/components/ui';

import {
  toggleTerm,
  setAgreement,
  setAllAgreements,
  initialState as signupInitialState,
} from '../slices/signup-slice';
import { useCompleteSignupMutation } from '../api/signup-api';
import type {
  AgreementKey,
  CompleteSignupRequest,
} from '../types/signup-types';
import { TERMS } from '../constants/signup-constants';
import { usePhoneVerification } from '../hooks/use-phone-verification';
import {
  LabeledInput,
  LabeledInputWithButton,
  TermItemComponent,
} from './signup-common';

export const SignupCustomer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userType, openTerms, agreements } = useAppSelector(
    (state: RootState) => state.signup ?? signupInitialState
  );

  const [completeSignup, { isLoading }] = useCompleteSignupMutation();

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

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
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

  const visibleTerms = TERMS.filter((term) =>
    term.showForUserTypes.includes(userType)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    const requiredTerms: AgreementKey[] = ['age', 'terms'];

    if (!requiredTerms.every((key) => agreements[key])) {
      newErrors.terms = '필수 약관에 모두 동의해주세요.';
    }

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
        phoneNumber: formData.phoneNumber.replace(/-/g, ''),
        smsAgreement: agreements.notification || false,
        marketingAgreement: agreements.marketing || false,
      };
      await completeSignup(requestData).unwrap();
      navigate('/');
    } catch {
      setErrors({ submit: '회원가입에 실패했습니다. 다시 시도해주세요.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4"
    >
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
          label="회원가입하기"
          variant="secondaryDark"
          disabled={isLoading}
          className="flex-1"
        />
      </div>
    </form>
  );
};

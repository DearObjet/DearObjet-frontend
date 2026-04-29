import { useState, useEffect } from 'react';
import type { TypedMutationTrigger } from '@reduxjs/toolkit/query/react';
import type {
  FetchBaseQueryError,
  BaseQueryFn,
  FetchArgs,
} from '@reduxjs/toolkit/query';

interface SendPhoneVerificationRequest {
  phoneNumber: string;
}

interface VerifyPhoneResponse {
  verified: boolean;
}

type MutationTriggerType<Req, Res> = TypedMutationTrigger<
  Res,
  Req,
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
>;

interface UsePhoneVerificationOptions {
  sendPhoneVerification: MutationTriggerType<
    SendPhoneVerificationRequest,
    unknown
  >;
  verifyPhone: MutationTriggerType<
    { phoneNumber: string; code: string },
    VerifyPhoneResponse
  >;
}

export const usePhoneVerification = ({
  sendPhoneVerification,
  verifyPhone,
}: UsePhoneVerificationOptions) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSendDisabled, setIsSendDisabled] = useState(false);

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

  const resetVerification = () => {
    setIsCodeSent(false);
    setIsPhoneVerified(false);
    setIsCodeExpired(false);
    setIsSendDisabled(false);
    setVerificationCode('');
  };

  const handleSendVerification = async (
    phoneNumber: string,
    onError: (msg: string) => void
  ) => {
    if (!phoneNumber) {
      onError('휴대폰번호를 입력해주세요.');
      return;
    }
    try {
      await sendPhoneVerification({ phoneNumber }).unwrap();
      setIsCodeSent(false);
      setTimeout(() => setIsCodeSent(true), 0);
      setIsPhoneVerified(false);
      setIsCodeExpired(false);
      setVerificationCode('');
    } catch {
      onError('인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleVerifyCode = async (
    phoneNumber: string,
    onSuccess: () => void,
    onError: (msg: string) => void
  ) => {
    if (!verificationCode) {
      onError('인증번호를 입력해주세요.');
      return;
    }
    try {
      const result = await verifyPhone({
        phoneNumber,
        code: verificationCode,
      }).unwrap();

      if (result.verified) {
        setIsPhoneVerified(true);
        setIsSendDisabled(true);
        onSuccess();
      } else {
        onError('인증번호가 올바르지 않습니다.');
      }
    } catch {
      onError('인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
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
  };
};

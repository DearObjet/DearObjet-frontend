import {
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation,
} from '../api/my-page-api';
import { usePhoneVerification as usePhoneVerificationBase } from '../../../shared/hooks/use-phone-verification';

export const useMyPagePhoneVerification = () => {
  const [sendPhoneVerification] = useSendPhoneVerificationMutation();
  const [verifyPhone] = useVerifyPhoneMutation();

  return usePhoneVerificationBase({ sendPhoneVerification, verifyPhone });
};

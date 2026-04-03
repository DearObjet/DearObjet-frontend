export { OAuthCallback } from './pages/oauth-callback';

export { authApi } from './api/auth-api';
export {
  useCompleteSignupMutation,
  useCompleteShopSignupMutation,
  useCompleteArtistSignupMutation,
  useSendPhoneVerificationMutation,
  useVerifyPhoneMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} from './api/auth-api';

export {
  setAccessToken,
  setUser,
  setSignupRequired,
} from './slices/auth-slice';

export type {
  AuthUser,
  UserRole,
  CompleteSignupRequest,
  CompleteBusinessSignupRequest,
  BusinessType,
  BusinessCategory,
  Specialty,
} from './types/auth-types';

export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP';

export interface AuthUser {
  userId: number;
  name: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  role: UserRole;
}

export interface CompleteSignupRequest {
  name: string;
  phoneNumber: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
}

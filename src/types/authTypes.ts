export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP';

export interface AuthUser {
  name: string;
  email: string;
  profileImage: string;
  role: UserRole;
}

export interface CompleteSignupRequest {
  name: string;
  phoneNumber: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
  role: 'CUSTOMER' | 'ARTIST' | 'SHOP';
}

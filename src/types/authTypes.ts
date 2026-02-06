export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP';

export interface AuthUser {
  userId: number;
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  role: UserRole;
}

export interface CompleteSignupRequest {
  name: string;
  email: string;
  phoneNumber: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
  role: 'CUSTOMER' | 'ARTIST' | 'SHOP';
}

export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP';

export interface AuthUser {
  name: string;
  email: string;
  profileImage: string;
  role: UserRole;
}

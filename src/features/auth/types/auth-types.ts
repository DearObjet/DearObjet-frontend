export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP' | 'ADMIN';

export interface AuthUser {
  userId: number;
  name: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  role: UserRole;
}

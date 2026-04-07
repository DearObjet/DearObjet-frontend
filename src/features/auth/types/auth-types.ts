import type { UserRole } from '../../../shared/constants';

export interface AuthUser {
  userId: number;
  name: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  role: UserRole;
}

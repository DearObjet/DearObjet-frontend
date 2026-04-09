import type { UserRole } from '../../../shared/constants';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber: string | null;
  userStatus: 'ACTIVE' | 'INACTIVE';
}

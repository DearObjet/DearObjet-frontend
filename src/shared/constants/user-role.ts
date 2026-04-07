export const USER_ROLE = {
  TEMP: 'TEMP',
  CUSTOMER: 'CUSTOMER',
  ARTIST: 'ARTIST',
  SHOP: 'SHOP',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = 'TEMP' | 'CUSTOMER' | 'ARTIST' | 'SHOP' | 'ADMIN';

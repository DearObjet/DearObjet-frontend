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

export interface CompleteBusinessSignupRequest {
  marketingAgreement: boolean;
  reviewDataAgreement: boolean;
  businessNumber: string;
  businessName: string;
  name: string;
  smsAgreement: boolean;
  businessAddress: string;
  phoneNumber: string;
  businessType: BusinessType;
  businessCategory: BusinessCategory;
  specialty: Specialty;
  ownerName: string;
}

export type BusinessType = 'SERVICE' | 'WHOLESALE_RETAIL';

export type BusinessCategory =
  | 'ONLINE_MARKETPLACE'
  | 'ECOMMERCE_PLATFORM'
  | 'ECOMMERCE_RETAIL'
  | 'GENERAL_RETAIL'
  | 'CRAFT_RETAIL';

export type Specialty =
  | 'STATIONERY_PAPER'
  | 'INTERIOR_DECOR'
  | 'LIVING_GOODS'
  | 'DESK_OFFICE'
  | 'EMOTIONAL_GOODS_GIFT'
  | 'HANDMADE_CRAFT'
  | 'ILLUSTRATION_ART_GOODS'
  | 'CERAMIC'
  | 'FABRIC_TEXTILE'
  | 'ECO_UPCYCLE';

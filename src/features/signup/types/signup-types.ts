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

// 휴대폰 인증 발송
export interface SendPhoneVerificationRequest {
  phoneNumber: string;
}

export interface SendPhoneVerificationResponse {
  phoneNumber: string;
  expiresInSec: number;
}

// 휴대폰 인증 확인
export interface VerifyPhoneRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifyPhoneResponse {
  verified: boolean;
}

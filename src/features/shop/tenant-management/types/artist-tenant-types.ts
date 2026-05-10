export type ContractStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'TERMINATED'
  | 'ENDED';

export type ContractRequestType = 'NONE' | 'EXTENSION' | 'TERMINATION';

export type CommissionType = 'RATE' | 'FIXED';

export interface ArtistContractItem {
  contractId: number;
  artistId: number;
  artistName: string;
  contractStartDate: string;
  contractEndDate: string;
  contractStatus: ContractStatus;
  contractStatusLabel: string;
  nextAction: {
    code: string;
    label: string;
  };
  detailAvailable: boolean;
}

export interface ArtistContractDetail {
  contractId: number;
  shopId: number;
  shopName: string;
  artistId: number;
  artistName: string;
  contractStartDate: string;
  contractEndDate: string;
  contractStatus: ContractStatus;
  contractRequestType: ContractRequestType;
  commissionType: CommissionType;
  commissionValue: number;
  memo: string;
}

export interface ArtistSuggestionItem {
  artistId: number;
  userId: number;
  artistName: string;
  artistImageUrl: string;
  specialty: string;
  instagramId: string;
}

export interface ArtistContractListResponse {
  items: ArtistContractItem[];
}

export interface ArtistSuggestionListResponse {
  items: ArtistSuggestionItem[];
}

export interface ContractReleaseResponse {
  contractId: number;
  contractStatus: ContractStatus;
  contractRequestType: ContractRequestType;
}

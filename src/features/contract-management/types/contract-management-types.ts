export interface ArtistSearchItem {
  artistId: number;
  userId: number;
  userName: string;
  artistName: string;
  artistImageUrl: string;
  specialty: string;
  instagramId: string;
  email: string;
}

export interface ArtistSearchResponse {
  items: ArtistSearchItem[];
}

export interface SendContractRequest {
  shopBusinessName: string;
  shopOwnerName: string;
  shopBusinessNumber: string;
  shopAddress: string;
  shopContact: string;
  contractStartDate: string;
  contractEndDate: string;
  commissionRate: number;
  settlementDay: number;
  paymentDay: number;
  contractDate: string;
  shopSignatureBusinessName: string;
  shopSignatureOwnerName: string;
}

export interface ArtistSubmissionRequest {
  artistName: string;
  artistBusinessNumber: string;
  artistAddress: string;
  artistContact: string;
  artistBankName: string;
  artistAccountHolder: string;
  artistAccountNumber: string;
  artistSignatureName: string;
}

export interface InProgressContractItem {
  contractId: number;
  title: string;
  viewerType: string;
  counterpartyId: number;
  counterpartyName: string;
  contractDate: string;
  contractStartDate: string;
  contractEndDate: string;
  contractDocumentStatus: string;
  detailApiPath: string;
}

export interface InProgressContractResponse {
  items: InProgressContractItem[];
}

export interface CompletedContractItem {
  contractId: number;
  title: string;
  viewerType: string;
  counterpartyId: number;
  counterpartyName: string;
  contractDate: string;
  contractStartDate: string;
  contractEndDate: string;
  contractDocumentStatus: string;
  detailApiPath: string;
}

export interface CompletedContractResponse {
  items: CompletedContractItem[];
}

export interface SendContractResponse {
  contractId: number;
  contractStatus: string;
  contractDocumentStatus: string;
  shopBusinessName: string;
  shopOwnerName: string;
  shopBusinessNumber: string;
  shopAddress: string;
  shopContact: string;
  contractStartDate: string;
  contractEndDate: string;
  commissionRate: number;
  settlementDay: number;
  paymentDay: number;
  contractDate: string;
  shopSignatureBusinessName: string;
  shopSignatureOwnerName: string;
  artistName: string;
  artistBusinessNumber: string;
  artistAddress: string;
  artistContact: string;
  artistBankName: string;
  artistAccountHolder: string;
  artistAccountNumber: string;
  artistSignatureName: string;
}

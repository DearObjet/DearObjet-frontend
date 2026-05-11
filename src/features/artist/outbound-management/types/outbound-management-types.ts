export type GetAvailableProductsParams = {
  shopId: number;
  keyword?: string;
  page?: number;
  size?: number;
};

export type CreateShipmentParams = {
  shopId: number;
  request: CreateShipmentRequest;
};

export type CommissionType = 'RATE' | 'FIXED_AMOUNT';

export type OutboundStatusCode = 'CONFIRMED' | 'UNCONFIRMED' | 'HOLD';

export type ContractStatus = 'APPROVED' | 'ENDED' | 'TERMINATED' | 'PENDING';

export type ShopItemResponse = {
  contractId: number;
  shopId: number;
  shopName: string;
  specialty: string;
  contractStartDate: string;
  contractEndDate: string;
  inboundStatusCode: OutboundStatusCode;
  inboundStatusLabel: string;
};

export type ShopListResponse = {
  items: ShopItemResponse[];
};

export type ShopListProps = {
  shops: Shop[];
  isLoading: boolean;
  selectedId: number | null;
  onRowClick: (shop: Shop) => void;
  onOutboundView: (shopId: number) => void;
};

export type ShipmentProductItemResponse = {
  contractProductId: number;
  productImageUrl: string;
  productName: string;
  totalShipmentQuantity: number;
  sellingPrice: number;
  commissionType: CommissionType;
  commissionValue: number;
  unitSettlementAmount: number;
};

export type ShipmentProductContractResponse = {
  contractId: number;
  contractStatus: ContractStatus;
  contractStartDate: string;
  contractEndDate: string;
  items: ShipmentProductItemResponse[];
};

export type ShipmentProductListResponse = {
  shopId: number;
  contracts: ShipmentProductContractResponse[];
};

export type OutboundProductListProps = {
  shopId: number | null;
  onOutboundSuccess: () => void;
};

export type AvailableProductItemResponse = {
  productId: number;
  productImageUrl: string;
  productName: string;
  sellingPrice: number;
  shipmentQuantity: number;
  totalQuantity: number;
  version: number;
};

export type AvailableProductListResponse = {
  shopId: number;
  contractId: number;
  items: AvailableProductItemResponse[];
  page: number;
  totalPages: number;
};

export type CreateShipmentItemRequest = {
  productId: number;
  quantity: number;
  version: number;
};

export type CreateShipmentRequest = {
  items: CreateShipmentItemRequest[];
};

export type CreateShipmentItemResponse = {
  productId: number;
  contractProductId: number;
  productImageUrl: string;
  productName: string;
  sellingPrice: number;
  shipmentQuantity: number;
  remainingQuantity: number;
  commissionType: CommissionType;
  commissionValue: number;
  unitSettlementAmount: number;
};

export type CreateShipmentResponse = {
  shopId: number;
  contractId: number;
  items: CreateShipmentItemResponse[];
};

export type Shop = {
  contractId: number;
  shopId: number;
  name: string;
  category: string;
  contractStart: string;
  contractEnd: string;
  statusCode: OutboundStatusCode;
  statusLabel: string;
};

export type OutboundListProps = {
  data?: ShipmentProductListResponse;
  isRecentMode: boolean;
  onToggleMode: () => void;
};

export type OutboundRecord = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  commission: string;
  settlement: number;
};

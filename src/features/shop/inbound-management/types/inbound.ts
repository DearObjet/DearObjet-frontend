export type ArtistSortIconProps = {
  column: ArtistSortKey;
  sortKey: ArtistSortKey;
  sortOrder: SortOrder;
};

export type ArtistSortKey = 'name';

export type RecordSortIconProps = {
  column: RecordSortKey;
  sortKey: RecordSortKey;
  sortOrder: SortOrder;
};

export type RecordSortKey =
  | 'productName'
  | 'price'
  | 'stock'
  | 'commission'
  | 'marginAmount'
  | 'settlementPerUnit'
  | 'artistName'
  | 'lastInboundDate';

export type SortOrder = 'asc' | 'desc';

export type InboundArtist = {
  id: number;
  imageUrl: string;
  name: string;
  category: string;
  lastInboundDate: string;
  inboundConfirm: '승인' | '미확인';
  memo: string;
};

export type InboundRecord = {
  id: number;
  imageUrl: string;
  productName: string;
  price: number;
  stock: number;
  commission: string;
  commissionRate: number;
  marginAmount: number;
  settlementPerUnit: number;
  artistName: string;
  lastInboundDate: string;
};

export type ArtistListProps = {
  artists: InboundArtist[];
  selectedId: number | null;
  isLoading: boolean;
  onRowClick: (artist: InboundArtist) => void;
  onInboundAllView: (artistId: number) => void;
  onInboundRecentView: (artistId: number) => void;
  onConfirmToggle: (artistId: number) => void;
};

export type InboundMemoProps = {
  memo: string;
  isDisabled: boolean;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
};

export type InboundRecordListProps = {
  records: InboundRecord[];
  isRecentMode: boolean;
  isLoading: boolean;
  onStockSave: (stocks: Record<number, number>) => Promise<void>;
};

export type RawInventoryItem = {
  contractId: number;
  artistImageUrl: string;
  artistName: string;
  specialty: string;
  recentStockedAt: string | null;
  inboundConfirmed: boolean;
};

export type RawContractProduct = {
  contractProductId: number;
  totalQuantity: number;
  productImageUrl: string;
  productName: string;
  sellingPrice: number;
  stockQuantity: number;
  commissionType: 'RATE' | 'FIXED_AMOUNT';
  commissionValue: number;
  marginAmount: number;
  unitSettlementAmount: number;
  artistName: string;
  recentStockedAt: string | null;
};

export type RawContractProductsData = {
  contractId: number;
  artistName: string;
  memo: string;
  items: RawContractProduct[];
};

export type ContractProductsResult = {
  memo: string;
  records: InboundRecord[];
};

export type StockMovementRequest = {
  contractId: number;
  contractProductId: number;
  movementType:
    | 'INBOUND'
    | 'ADJUSTMENT_INCREASE'
    | 'ADJUSTMENT_DECREASE'
    | 'SALE_DECREASE'
    | 'RETURN_INCREASE'
    | 'CANCEL_RESTORE';
  quantity: number;
  occurredAt: string;
  memo?: string;
};

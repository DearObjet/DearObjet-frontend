// ─── Sort ────────────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc';

export type ArtistSortKey = 'name' | 'daysRemaining' | 'status';

export type ProductSortKey =
  | 'productName'
  | 'price'
  | 'salesQuantity'
  | 'marginAmount'
  | 'settlementAmount'
  | 'artistName'
  | 'lastInboundDate';

// ─── Sort Icon Props ──────────────────────────────────────────────────────────

export type ArtistSortIconProps = {
  column: ArtistSortKey;
  sortKey: ArtistSortKey;
  sortOrder: SortOrder;
};

export type ProductSortIconProps = {
  column: ProductSortKey;
  sortKey: ProductSortKey;
  sortOrder: SortOrder;
};

// ─── Domain ───────────────────────────────────────────────────────────────────

export type SettlementStatus = 'PENDING' | 'PAID' | 'UNPAID';
export type PaymentMethod = 'PG' | 'MANUAL';

export type SettlementArtist = {
  contractId: number;
  imageUrl: string;
  name: string;
  category: string;
  settlementDate: string;
  daysRemaining: string;
  status: SettlementStatus;
  statusLabel: string;
};

export type RecentSettlement = {
  id: number;
  rank: number;
  artistName: string;
  settlementAmount: number;
  settlementDate: string;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
};

export type SettlementProduct = {
  contractProductId: number;
  imageUrl: string;
  productName: string;
  price: number;
  salesQuantity: number;
  commission: string;
  marginAmount: number;
  settlementAmount: number;
  artistName: string;
  lastInboundDate: string;
};

// ─── Component Props ──────────────────────────────────────────────────────────

export type ArtistSettlementListProps = {
  artists: SettlementArtist[];
  selectedId: number | null;
  isLoading: boolean;
  onRowClick: (artist: SettlementArtist) => void;
};

export type RecentSettlementListProps = {
  settlements: RecentSettlement[];
  isLoading: boolean;
};

export type SettlementProductListProps = {
  products: SettlementProduct[];
  isLoading: boolean;
  onSettle: (selectedIds: number[]) => void;
};

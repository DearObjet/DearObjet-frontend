// ─── Sort ────────────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc';

export type ShopSortKey = 'name' | 'daysRemaining' | 'status';

export type TaxInvoiceSortKey =
  | 'shopName'
  | 'settlementAmount'
  | 'settlementDate'
  | 'status';

// ─── Sort Icon Props ──────────────────────────────────────────────────────────

export type ShopSortIconProps = {
  column: ShopSortKey;
  sortKey: ShopSortKey;
  sortOrder: SortOrder;
};

// ─── Domain ───────────────────────────────────────────────────────────────────

export type ShopSettlementStatus = 'COMPLETED' | 'DELAYED' | 'PENDING';
export type PaymentMethod = 'PG' | 'MANUAL';

export type ShopSettlement = {
  contractId: number;
  imageUrl: string;
  shopName: string;
  category: string;
  settlementDate: string;
  daysRemaining: string;
  status: ShopSettlementStatus;
  statusLabel: string;
};

export type RecentSettlementItem = {
  id: number;
  rank: number;
  shopName: string;
  settlementAmount: number;
  settlementDate: string;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
};

export type TaxInvoiceItem = {
  id: number;
  shopName: string;
  settlementAmount: number;
  settlementDate: string;
  status: ShopSettlementStatus;
  statusLabel: string;
};

// ─── Component Props ──────────────────────────────────────────────────────────

export type ShopSettlementListProps = {
  shops: ShopSettlement[];
  selectedId: number | null;
  isLoading: boolean;
  onRowClick: (shop: ShopSettlement) => void;
};

export type RecentSettlementListProps = {
  settlements: RecentSettlementItem[];
  isLoading: boolean;
};

export type TaxInvoiceListProps = {
  items: TaxInvoiceItem[];
  isLoading: boolean;
  onIssue: (id: number) => void;
};

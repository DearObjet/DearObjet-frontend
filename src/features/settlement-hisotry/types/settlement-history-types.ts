export type SettlementItem = {
  settlementId: number;
  shopName: string;
  amount: number;
  settlementDate: string;
  identifier: string;
};

export type SettlementListResponse = {
  items: SettlementItem[];
  totalCount: number;
};

export type PeriodPreset =
  | 'THIS_WEEK'
  | 'LAST_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_YEAR'
  | 'LAST_YEAR';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type SettlementListProps = {
  items: SettlementItem[];
  isLoading: boolean;
};

export type SettlementPeriodFilterProps = {
  onSearch: (range: DateRange) => void;
};

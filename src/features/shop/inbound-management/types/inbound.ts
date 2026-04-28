export type ArtistSortKey = 'name';

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
  onRowClick: (artist: InboundArtist) => void;
  onInboundAllView: (artistId: number) => void;
  onInboundRecentView: (artistId: number) => void;
  onConfirmToggle: (artistId: number) => void;
};

export type InboundMemoProps = {
  memo: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
};

export type InboundRecordListProps = {
  records: InboundRecord[];
  isRecentMode: boolean;
  onStockSave: (stocks: Record<number, number>) => void;
};

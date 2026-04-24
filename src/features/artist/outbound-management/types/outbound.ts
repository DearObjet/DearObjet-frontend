export type Shop = {
  id: number;
  name: string;
  category: string;
  contractStart: string;
  contractEnd: string;
  outboundConfirm: '확인' | '미확인';
};

export type OutboundProduct = {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  stock: number;
};

export type OutboundRecord = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  commission: string;
  settlement: number;
};

export type OutboundItem = {
  productId: number;
  quantity: number;
};

export type OutboundListProps = {
  records: OutboundRecord[];
  isRecentMode: boolean;
  onToggleMode: () => void;
};

export type OutboundProductListProps = {
  products: OutboundProduct[];
  onOutbound: (items: OutboundItem[]) => void;
};

export type ShopListProps = {
  shops: Shop[];
  selectedId: number | null;
  onRowClick: (shop: Shop) => void;
  onOutboundView: (shopId: number) => void;
};

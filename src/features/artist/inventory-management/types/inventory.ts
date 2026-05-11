export type SortKey =
  | 'productName'
  | 'price'
  | 'stockQuantity'
  | 'registeredAt';
export type SortOrder = 'asc' | 'desc';

export type ArtistProduct = {
  productId: number;
  imageUrl: string | null;
  productName: string;
  price: number;
  stockQuantity: number;
  registeredAt: string;
  version: number;
};

export type ArtistProductListData = {
  items: ArtistProduct[];
  page: number;
  totalPages: number;
};

export type UpdateStocksResponse = {
  items: ArtistProduct[];
};

export type ProductFormData = {
  productName: string;
  price: number;
  stockQuantity: number;
  imageFile: File | null;
};

export type GetProductsParams = {
  page?: number;
  size?: number;
};

export type UpdateStockItem = {
  productId: number;
  stockQuantity: number;
  version: number;
};

export type UpdateProductParams = {
  productId: number;
  data: ProductFormData;
};

export type ProductInventoryTableProps = {
  products: ArtistProduct[];
  selectedId: number | null;
  onRowClick: (product: ArtistProduct) => void;
  onStockSave: (
    items: { productId: number; stockQuantity: number; version: number }[]
  ) => void;
  onDelete: (ids: number[]) => void;
};

export type SortIconProps = {
  column: SortKey;
  sortKey: SortKey;
  sortOrder: SortOrder;
};

export type ProductFormProps = {
  selectedProduct: ArtistProduct | null;
  onSave: (data: ProductFormData) => void;
};

export type SortKey = 'name' | 'price' | 'stock' | 'registeredAt';
export type SortOrder = 'asc' | 'desc';

export type Product = {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  stock: number;
  registeredAt: string;
};

export type ProductFormData = {
  name: string;
  price: number;
  stock: number;
  imageFile: File | null;
};

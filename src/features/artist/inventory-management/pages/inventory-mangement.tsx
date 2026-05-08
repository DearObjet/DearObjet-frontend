import { useState } from 'react';

import { ProductInventoryTable } from '../components/product-inventory-table';
import { ProductForm } from '../components/prodcut-form';
import { ProductMemo } from '../components/product-memo';
import {
  useGetArtistProductsQuery,
  useCreateArtistProductMutation,
  useUpdateArtistProductMutation,
  useUpdateArtistProductStocksMutation,
  useDeleteArtistProductMutation,
} from '../api/artist-product-api';
import type { ArtistProduct, ProductFormData } from '../types/inventory';

export const InventoryManagement = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formKey, setFormKey] = useState(0);

  const { data, isLoading } = useGetArtistProductsQuery({ page: 1, size: 20 });
  const [createProduct] = useCreateArtistProductMutation();
  const [updateProduct] = useUpdateArtistProductMutation();
  const [updateStocks] = useUpdateArtistProductStocksMutation();
  const [deleteProduct] = useDeleteArtistProductMutation();

  const products = data?.items ?? [];
  const selectedProduct =
    products.find((p) => p.productId === selectedId) ?? null;

  const handleRowClick = (product: ArtistProduct) => {
    setSelectedId((prev) =>
      prev === product.productId ? null : product.productId
    );
  };

  const handleStockSave = async (
    items: { productId: number; stockQuantity: number; version: number }[]
  ) => {
    try {
      await updateStocks(items).unwrap();
      alert('재고가 저장되었습니다.');
    } catch (error: unknown) {
      const err = error as { status?: number };
      if (err.status === 409) {
        alert(
          '다른 사용자가 재고를 변경했습니다. 목록을 새로고침 후 다시 시도해주세요.'
        );
      } else {
        alert('재고 저장에 실패했습니다.');
      }
    }
  };

  const handleDelete = async (ids: number[]) => {
    try {
      await Promise.all(ids.map((id) => deleteProduct(id).unwrap()));
      if (selectedId !== null && ids.includes(selectedId)) {
        setSelectedId(null);
      }
    } catch {
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const handleProductSave = async (data: ProductFormData) => {
    try {
      if (selectedId !== null) {
        await updateProduct({ productId: selectedId, data }).unwrap();
        alert('상품이 수정되었습니다.');
        setSelectedId(null);
      } else {
        await createProduct(data).unwrap();
        alert('상품이 등록되었습니다.');
        setFormKey((prev) => prev + 1);
      }
    } catch {
      alert(
        selectedId !== null
          ? '상품 수정에 실패했습니다.'
          : '상품 등록에 실패했습니다.'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="h-full flex-1 overflow-hidden bg-gray-100">
      <div className="grid h-full grid-cols-2 gap-3">
        <ProductInventoryTable
          products={products}
          selectedId={selectedId}
          onRowClick={handleRowClick}
          onStockSave={handleStockSave}
          onDelete={handleDelete}
        />
        <div className="flex flex-col gap-3 overflow-y-auto">
          <ProductForm
            key={formKey}
            selectedProduct={selectedProduct}
            onSave={handleProductSave}
          />
          <ProductMemo selectedId={selectedId} />
        </div>
      </div>
    </div>
  );
};

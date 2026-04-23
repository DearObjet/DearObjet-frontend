import { useState } from 'react';

import { Aside } from '../../../../shared/components/layout';

import { ProductInventoryTable } from '../components/product-inventory-table';
import { ProductForm } from '../components/prodcut-form';
import { ProductMemo } from '../components/product-memo';
import type { Product, ProductFormData } from '../types/inventory';

let nextId = 6;

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    imageUrl: '',
    name: '1번 상품 어쩌고 짱구 흰둥이',
    price: 3000000,
    stock: 100,
    registeredAt: '2025.09.20',
  },
  {
    id: 2,
    imageUrl: '',
    name: '2번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 30,
    registeredAt: '2025.09.20',
  },
  {
    id: 3,
    imageUrl: '',
    name: '3번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 5,
    registeredAt: '2025.09.20',
  },
  {
    id: 4,
    imageUrl: '',
    name: '4번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 9,
    registeredAt: '2025.09.20',
  },
  {
    id: 5,
    imageUrl: '',
    name: '5번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 160,
    registeredAt: '2025.09.20',
  },
  {
    id: 6,
    imageUrl: '',
    name: '1번 상품 어쩌고 짱구 흰둥이',
    price: 3000000,
    stock: 100,
    registeredAt: '2025.09.20',
  },
  {
    id: 7,
    imageUrl: '',
    name: '2번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 30,
    registeredAt: '2025.09.20',
  },
  {
    id: 8,
    imageUrl: '',
    name: '3번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 5,
    registeredAt: '2025.09.20',
  },
  {
    id: 9,
    imageUrl: '',
    name: '4번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 9,
    registeredAt: '2025.09.20',
  },
  {
    id: 10,
    imageUrl: '',
    name: '5번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 160,
    registeredAt: '2025.09.20',
  },
  {
    id: 11,
    imageUrl: '',
    name: '1번 상품 어쩌고 짱구 흰둥이',
    price: 3000000,
    stock: 100,
    registeredAt: '2025.09.20',
  },
  {
    id: 12,
    imageUrl: '',
    name: '2번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 30,
    registeredAt: '2025.09.20',
  },
  {
    id: 13,
    imageUrl: '',
    name: '3번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 5,
    registeredAt: '2025.09.20',
  },
  {
    id: 14,
    imageUrl: '',
    name: '4번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 9,
    registeredAt: '2025.09.20',
  },
  {
    id: 15,
    imageUrl: '',
    name: '5번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 160,
    registeredAt: '2025.09.20',
  },
  {
    id: 16,
    imageUrl: '',
    name: '1번 상품 어쩌고 짱구 흰둥이',
    price: 3000000,
    stock: 100,
    registeredAt: '2025.09.20',
  },
  {
    id: 17,
    imageUrl: '',
    name: '2번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 30,
    registeredAt: '2025.09.20',
  },
  {
    id: 18,
    imageUrl: '',
    name: '3번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 5,
    registeredAt: '2025.09.20',
  },
  {
    id: 19,
    imageUrl: '',
    name: '4번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 9,
    registeredAt: '2025.09.20',
  },
  {
    id: 20,
    imageUrl: '',
    name: '5번 상품 어쩌고 짱구 흰둥이',
    price: 30000,
    stock: 160,
    registeredAt: '2025.09.20',
  },
];

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  const handleRowClick = (product: Product) => {
    setSelectedId((prev) => (prev === product.id ? null : product.id));
  };

  const handleStockSave = (stocks: Record<number, number>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id in stocks ? { ...p, stock: stocks[p.id] } : p))
    );
    alert('재고가 저장되었습니다.');
  };

  const handleDelete = (ids: number[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    if (selectedId !== null && ids.includes(selectedId)) {
      setSelectedId(null);
    }
  };

  const handleProductSave = (data: ProductFormData) => {
    if (selectedId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedId
            ? { ...p, name: data.name, price: data.price, stock: data.stock }
            : p
        )
      );
      alert('상품이 수정되었습니다.');
      setSelectedId(null);
    } else {
      const newProduct: Product = {
        id: nextId++,
        imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : '',
        name: data.name,
        price: data.price,
        stock: data.stock,
        registeredAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      };
      setProducts((prev) => [newProduct, ...prev]);
      alert('상품이 등록되었습니다.');
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Aside />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[4.5rem] shrink-0 items-center bg-white px-6">
          <h1 className="text-sm text-gray-700">
            입점관리 <span aria-hidden="true">/</span>{' '}
            <span className="font-medium text-black">품목 및 재고관리</span>
          </h1>
        </header>

        <main className="flex-1 overflow-hidden bg-gray-100 p-5 px-[3.625rem]">
          <div className="grid h-full grid-cols-2 gap-3">
            {/* 좌측: 품목 및 재고 테이블 */}
            <ProductInventoryTable
              products={products}
              selectedId={selectedId}
              onRowClick={handleRowClick}
              onStockSave={handleStockSave}
              onDelete={handleDelete}
            />

            {/* 우측: 상품 등록·수정 폼 + 메모 */}
            <div className="flex flex-col gap-3 overflow-y-auto">
              <ProductForm
                selectedProduct={selectedProduct}
                onSave={handleProductSave}
              />
              <ProductMemo />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

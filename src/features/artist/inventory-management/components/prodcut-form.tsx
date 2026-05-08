import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';

import { Button } from '../../../../shared/components/ui';
import { Input } from '../../../../shared/components/ui';

import type { ProductFormProps } from '../types/inventory';

const INITIAL_FORM = {
  productName: '',
  price: '',
  stockQuantity: '',
  imageUrl: null as string | null,
  imageFile: null as File | null,
};

export const ProductForm = ({ selectedProduct, onSave }: ProductFormProps) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.productName);
      setPrice(selectedProduct.price.toLocaleString());
      setStockQuantity(selectedProduct.stockQuantity.toLocaleString());
      setImageUrl(selectedProduct.imageUrl ?? null);
      setImageFile(null);
    } else {
      setProductName('');
      setPrice('');
      setStockQuantity('');
      setImageUrl(null);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    setErrors({});
  }, [selectedProduct]);

  const clearError = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: '' }));

  const handleReset = () => {
    if (selectedProduct) {
      setProductName(selectedProduct.productName);
      setPrice(selectedProduct.price.toLocaleString());
      setStockQuantity(selectedProduct.stockQuantity.toLocaleString());
      setImageUrl(selectedProduct.imageUrl ?? null);
      setImageFile(null);
    } else {
      setProductName(INITIAL_FORM.productName);
      setPrice(INITIAL_FORM.price);
      setStockQuantity(INITIAL_FORM.stockQuantity);
      setImageUrl(INITIAL_FORM.imageUrl);
      setImageFile(INITIAL_FORM.imageFile);
    }
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPrice(raw ? Number(raw).toLocaleString() : '');
    clearError('price');
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setStockQuantity(raw ? Number(raw).toLocaleString() : '');
    clearError('stockQuantity');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = '필수 입력 항목입니다.';
    } else if (/[^가-힣a-zA-Z0-9 ]/g.test(productName)) {
      newErrors.productName = '한글, 숫자, 영문만 입력이 가능합니다.';
    }

    if (!price) newErrors.price = '필수 입력 항목입니다.';

    if (!stockQuantity) {
      newErrors.stockQuantity = '필수 입력 항목입니다.';
    } else if (Number(stockQuantity.replace(/,/g, '')) > 200) {
      newErrors.stockQuantity = '재고 수량은 최대 200개까지 입력 가능합니다.';
    }

    if (!selectedProduct && !imageFile)
      newErrors.imageFile = '상품 이미지는 필수입니다.';
    return newErrors;
  };

  const handleProductNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    clearError('productName');
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      productName: productName.trim(),
      price: Number(price.replace(/,/g, '')),
      stockQuantity: Number(stockQuantity.replace(/,/g, '')),
      imageFile,
    });
  };

  return (
    <section className="flex flex-col rounded-xl bg-white px-6 pb-5 pt-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="font-bold">상품 {selectedProduct ? '정보' : '등록'}</h2>
        <div className="flex gap-1">
          <Button
            variant="secondaryDark"
            className="flex items-center justify-center px-4 py-2 text-xs"
            label="초기화"
            onClick={handleReset}
          />
          <Button
            variant="secondaryDark"
            className="flex items-center justify-center px-5 py-2 text-xs"
            label={selectedProduct ? '수정' : '등록'}
            onClick={handleSave}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="product-name">
              상품명
            </label>
            <Input
              id="product-name"
              className="w-full border-theme-300"
              value={productName}
              onChange={handleProductNameChange}
            />
            {errors.productName ? (
              <p className="h-4 text-xs text-red-400" role="alert">
                {errors.productName}
              </p>
            ) : (
              <p className="h-4" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="product-price">
              판매가
            </label>
            <Input
              id="product-price"
              className="w-full border-theme-300"
              value={price}
              onChange={handlePriceChange}
            />
            {errors.price ? (
              <p className="h-4 text-xs text-red-400" role="alert">
                {errors.price}
              </p>
            ) : (
              <p className="h-4" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="product-stock">
              총재고
            </label>
            <Input
              id="product-stock"
              className="w-full border-theme-300"
              value={stockQuantity}
              onChange={handleStockChange}
            />
            {errors.stockQuantity ? (
              <p className="h-4 text-xs text-red-400" role="alert">
                {errors.stockQuantity}
              </p>
            ) : (
              <p className="h-4" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="mb-[1.34rem] flex flex-col gap-1.5">
          <p className="text-sm font-medium">상품 이미지</p>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-theme-300">
            {imageUrl ? (
              <div className="relative h-[15.3125rem] w-full">
                <img
                  src={imageUrl}
                  alt="상품 이미지 미리보기"
                  className="h-full w-full rounded-lg object-contain"
                />
                <button
                  type="button"
                  className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow"
                  onClick={handleImageRemove}
                  aria-label="이미지 삭제"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex h-[15.3125rem] w-full cursor-pointer items-center justify-center rounded-lg">
                <ImagePlus
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <span className="sr-only">이미지 업로드</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpg,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageAdd}
                />
              </label>
            )}
          </div>
          {errors.imageFile ? (
            <p className="h-4 text-xs text-red-400" role="alert">
              {errors.imageFile}
            </p>
          ) : (
            <p className="h-4" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
};

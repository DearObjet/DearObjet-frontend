import { useState, useEffect, type ChangeEvent } from 'react';

import { ImagePlus, X } from 'lucide-react';

import { Button } from '../../../../shared/components/ui';
import { Input } from '../../../../shared/components/ui';

import {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from '../api/class-api';

import { StoryManage } from '../components/story-management';
import { RegisterBusinessHour } from '../components/register-business-hour';

type Mode = 'default' | 'registering' | 'selected' | 'editing';

export const ShopManagement = () => {
  const [mode, setMode] = useState<Mode>('default');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: classListData } = useGetClassesQuery();
  const { data: selectedClassData } = useGetClassQuery(selectedClassId!, {
    skip: selectedClassId === null,
  });
  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  useEffect(() => {
    if (!selectedClassData) return;
    const classData = selectedClassData.data;
    setClassName(classData.className);
    setClassDescription(classData.classDescription);
    setPrice(classData.price.toLocaleString());
    setMaxCapacity(classData.maxCapacity.toLocaleString());
    setNotes(classData.notes);
    setImages(classData.classImageUrls);
    setImageFiles([]);
  }, [selectedClassData]);

  const clearError = (key: string) =>
    setErrors((prev) => ({ ...prev, [key]: '' }));

  const handleClassSelect = (classId: number) => {
    setSelectedClassId(classId);
    setMode('selected');
  };

  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 5) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, url]);
    setImageFiles((prev) => [...prev, file]);
    clearError('images');
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPrice(raw ? Number(raw).toLocaleString() : '');
    clearError('price');
  };

  const handleMaxCapacityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMaxCapacity(raw ? Number(raw).toLocaleString() : '');
    clearError('maxCapacity');
  };

  const handleCancel = () => {
    setMode('default');
    setSelectedClassId(null);
    setImages([]);
    setImageFiles([]);
    setClassName('');
    setClassDescription('');
    setPrice('');
    setMaxCapacity('');
    setNotes('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!className) newErrors.className = '필수 입력 항목입니다.';
    if (!classDescription) newErrors.classDescription = '필수 입력 항목입니다.';
    if (!price) newErrors.price = '필수 입력 항목입니다.';
    if (!maxCapacity) newErrors.maxCapacity = '필수 입력 항목입니다.';
    if (!notes) newErrors.notes = '필수 입력 항목입니다.';
    if (imageFiles.length === 0)
      newErrors.images = '사진을 1장 이상 추가해주세요.';
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await createClass({
        className,
        classDescription,
        price: Number(price.replace(/,/g, '')),
        maxCapacity: Number(maxCapacity.replace(/,/g, '')),
        notes,
        classImageFiles: imageFiles,
      });
      handleCancel();
    } catch {
      alert('클래스 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleEditClick = () => {
    if (!selectedClassData) return;
    const confirmed = window.confirm(
      `${selectedClassData.data.className} 수정하시겠습니까?`
    );
    if (confirmed) setMode('editing');
  };

  const handleEditSave = async () => {
    if (!selectedClassId) return;
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await updateClass({
        classId: selectedClassId,
        className,
        classDescription,
        price: Number(price.replace(/,/g, '')),
        maxCapacity: Number(maxCapacity.replace(/,/g, '')),
        notes,
        classImageFiles: imageFiles,
      });
      handleCancel();
    } catch {
      alert('클래스 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedClassData) return;
    const confirmed = window.confirm(
      `${selectedClassData.data.className} 삭제하시겠습니까?`
    );
    if (confirmed) {
      try {
        await deleteClass(selectedClassId!);
        handleCancel();
      } catch {
        alert('클래스 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const isFormDisabled = mode === 'default' || mode === 'selected';

  return (
    <div className="grid w-full flex-1 grid-cols-2 gap-3 overflow-y-auto bg-gray-100">
      {/* 클래스 등록 및 매장 운영 정보 등록 */}
      <div className="flex flex-col gap-3">
        <StoryManage />
        <RegisterBusinessHour />
      </div>

      {/* 클래스 등록하기 */}
      <div className="flex h-full flex-col gap-3">
        <section className="flex flex-col rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3>클래스 등록하기</h3>
            {(mode === 'default' || mode === 'selected') && (
              <Button
                variant="secondaryDark"
                className="flex items-center justify-center px-4 py-2 text-xs"
                label="새 클래스 등록"
                onClick={() => {
                  setSelectedClassId(null);
                  setImages([]);
                  setImageFiles([]);
                  setClassName('');
                  setClassDescription('');
                  setPrice('');
                  setMaxCapacity('');
                  setNotes('');
                  setErrors({});
                  setMode('registering');
                }}
              />
            )}
            {mode === 'registering' && (
              <div className="flex gap-1">
                <Button
                  variant="secondaryDark"
                  className="flex items-center justify-center px-4 py-2 text-xs"
                  label="취소"
                  onClick={handleCancel}
                />
                <Button
                  variant="secondaryDark"
                  className="flex items-center justify-center px-4 py-2 text-xs"
                  label="저장"
                  onClick={handleSave}
                />
              </div>
            )}
            {mode === 'editing' && (
              <div className="flex gap-1">
                <Button
                  variant="secondaryDark"
                  className="flex items-center justify-center px-4 py-2 text-xs"
                  label="취소"
                  onClick={handleCancel}
                />
                <Button
                  variant="secondaryDark"
                  className="flex items-center justify-center px-4 py-2 text-xs"
                  label="수정"
                  onClick={handleEditSave}
                />
              </div>
            )}
          </div>

          <div>
            <form className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  클래스 이름을 등록해주세요
                </p>
                <Input
                  className="w-full"
                  disabled={isFormDisabled}
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    clearError('className');
                  }}
                />
                {errors.className && (
                  <p className="text-sm text-red-400">{errors.className}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  클래스 소개글을 작성해주세요
                </p>
                <textarea
                  className="h-[7.0625rem] w-full resize-none rounded-lg border border-gray-500 px-3 py-2 text-sm disabled:border-gray-200 disabled:bg-white"
                  disabled={isFormDisabled}
                  value={classDescription}
                  onChange={(e) => {
                    setClassDescription(e.target.value);
                    clearError('classDescription');
                  }}
                />
                {errors.classDescription && (
                  <p className="text-sm text-red-400">
                    {errors.classDescription}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex w-full flex-col gap-2">
                  <p className="text-sm font-medium">
                    결제 금액을 작성해주세요 (1인 기준입니다)
                  </p>
                  <Input
                    className="w-full"
                    disabled={isFormDisabled}
                    value={price}
                    onChange={handlePriceChange}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-400">{errors.price}</p>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <p className="text-sm font-medium">최대 예약인원</p>
                  <Input
                    className="w-full"
                    disabled={isFormDisabled}
                    value={maxCapacity}
                    onChange={handleMaxCapacityChange}
                  />
                  {errors.maxCapacity && (
                    <p className="text-sm text-red-400">{errors.maxCapacity}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  클래스 유의 사항을 작성해주세요
                </p>
                <Input
                  className="w-full"
                  disabled={isFormDisabled}
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    clearError('notes');
                  }}
                />
                {errors.notes && (
                  <p className="text-sm text-red-400">{errors.notes}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">사진을 추가해주세요</p>
                <div className="flex flex-row gap-2">
                  {images.length < 5 && (
                    <label
                      className={`flex h-[5.625rem] w-[5.625rem] flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 ${
                        isFormDisabled
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer'
                      }`}
                    >
                      <ImagePlus className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/jpg, image/jpeg, image/png"
                        className="hidden"
                        disabled={isFormDisabled}
                        onChange={handleImageAdd}
                      />
                    </label>
                  )}
                  {images.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-[5.625rem] w-[5.625rem] flex-shrink-0"
                    >
                      <img
                        src={url}
                        alt={`uploaded-${index}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <Button
                        variant="icon"
                        className="absolute right-1 top-1 flex h-4 w-4"
                        onClick={() => handleImageRemove(index)}
                        icon={<X />}
                        disabled={isFormDisabled}
                      />
                    </div>
                  ))}
                </div>
                {errors.images && (
                  <p className="text-sm text-red-400">{errors.images}</p>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="flex h-full flex-col rounded-xl bg-white px-[3.125rem] pb-[1.6875rem] pt-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3>클래스 리스트</h3>
            <div className="flex gap-1">
              <Button
                variant="secondaryLight"
                className="flex items-center justify-center border-[1px] px-4 py-2 text-xs"
                label="수정"
                onClick={handleEditClick}
              />
              <Button
                variant="secondaryDark"
                className="flex items-center justify-center px-4 py-2 text-xs"
                label="삭제"
                onClick={handleDeleteClick}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto">
            {classListData?.data.items.map((item) => (
              <article
                key={item.classId}
                className="flex flex-shrink-0 cursor-pointer flex-col"
                onClick={() => handleClassSelect(item.classId)}
              >
                <img
                  src={item.firstImageUrl}
                  alt="이미지"
                  className="h-[8rem] w-[11.1875rem] bg-gray-700 object-cover"
                />
                <div className="h-[6.4375rem] w-[11.1875rem] bg-gray-200 p-4">
                  <p className="text-xs">{item.className}</p>
                  <span className="text-[10px]">
                    최대인원 {item.maxCapacity.toLocaleString()}명
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

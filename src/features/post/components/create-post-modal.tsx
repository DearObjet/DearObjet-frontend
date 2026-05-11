import { useRef, useState, type ChangeEvent } from 'react';

import XIcon from '../../../assets/x-icon.svg';
import CheckIcon from '../../../assets/check-icon.svg';
import UploadFile from '../../../assets/upload-file.svg';

import { Button } from '../../../shared/components/ui';

import { Avatar } from './avatar';
import { ConfirmModal } from './confirm-modal';
import type { CreatePostModalProps } from '../types/post-type';

export const CreatePostModal = ({
  authorName,
  onSubmit,
  onClose,
}: CreatePostModalProps) => {
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!draftImage) {
      alert('이미지를 첨부해주세요.');
      return;
    }
    if (!draftContent.trim()) {
      alert('포스트 내용을 입력해주세요.');
      return;
    }
    onSubmit(draftImage, draftContent);
  };

  const handleClose = () => {
    if (draftImage || draftContent.trim()) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onClose();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDraftImage(URL.createObjectURL(file));
  };

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative flex max-h-[calc(100%-90px)] w-96 flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center gap-2.5 px-4 py-3">
          <Avatar name={authorName} />
          <span className="flex-1 text-sm font-medium">{authorName}</span>
          <Button
            icon={<img src={CheckIcon} alt="" width={16} height={16} />}
            size="small"
            variant="icon"
            onClick={handleSubmit}
            aria-label="포스트 작성"
          />
          <Button
            icon={<img src={XIcon} alt="" width={16} height={16} />}
            size="small"
            variant="icon"
            onClick={handleClose}
            aria-label="닫기"
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-square w-full shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden bg-theme-300"
        >
          {draftImage ? (
            <img
              src={draftImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={UploadFile} alt="" aria-label="이미지 등록" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 내용 입력 */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="내용을 입력하세요."
            className="min-h-[180px] w-full resize-none border-none bg-transparent text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* 종료 확인 모달 */}
      {showExitConfirm && (
        <ConfirmModal
          message="포스트를 저장하지 않고 종료하시겠습니까?"
          onYes={handleConfirmExit}
          onNo={() => setShowExitConfirm(false)}
        />
      )}
    </div>
  );
};

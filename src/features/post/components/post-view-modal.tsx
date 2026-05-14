import { useState } from 'react';

import XIcon from '../../../assets/x-icon.svg';
import TrashIcon from '../../../assets/trash-icon.svg';

import { Button } from '../../../shared/components/ui';

import { ConfirmModal } from './confirm-modal';
import { Avatar } from './avatar';
import type { PostViewModalProps } from '../types/post-type';

export const PostViewModal = ({
  post,
  user,
  onClose,
  onDelete,
}: PostViewModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAuthor = user !== null && user.userId === post.userId;
  const imageUrl = post.imageUrls[0] ?? null;

  const postAuthor = {
    name: post.userName,
    profileUrl: post.profileUrl,
  };

  const handleDelete = () => {
    onDelete(post.postId);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className="absolute inset-0 z-10 flex items-start justify-center bg-black/40 pt-20"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex max-h-[calc(100%-90px)] w-[32rem] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex shrink-0 items-center gap-2.5 px-4 py-3">
          <Avatar user={postAuthor} />
          <span className="flex-1 text-sm font-medium">{post.userName}</span>
          {isAuthor && (
            <Button
              icon={<img src={TrashIcon} alt="" width={16} height={16} />}
              size="small"
              variant="icon"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="삭제"
            />
          )}
          <Button
            icon={<img src={XIcon} alt="" width={16} height={16} />}
            size="small"
            variant="icon"
            onClick={onClose}
            aria-label="닫기"
          />
        </div>

        {/* 이미지 */}
        <div className="aspect-square w-full shrink-0 overflow-hidden bg-theme-200">
          {imageUrl && (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        {/* 내용 */}
        <div className="max-h-52 min-h-32 overflow-y-auto px-4 py-3.5">
          <p className="whitespace-pre-wrap text-xs text-gray-700">
            {post.content}
          </p>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          message="해당 포스트를 삭제하시겠습니까?"
          onYes={handleDelete}
          onNo={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

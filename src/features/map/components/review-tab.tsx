import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { MoreVertical, ImagePlus } from 'lucide-react';

import { Button } from '../../../shared/components/ui';
import { ExpandableText } from './expandable-text';

import {
  useLazyGetShopReviewsQuery,
  useCreateShopReviewMutation,
  useUpdateShopReviewMutation,
  useDeleteShopReviewMutation,
} from '../api/review-api';
import type { ShopReviewItem } from '../types/review-types';

interface ReviewTabProps {
  shopId: number;
}

type Mode = 'list' | 'write' | 'edit';

const formatDate = (dateStr: string) => dateStr.slice(0, 10).replace(/-/g, '.');

const buildFormData = (
  title: string,
  content: string,
  image: File | null
): FormData => {
  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify({ title, content })], { type: 'application/json' })
  );
  if (image) formData.append('image', image);
  return formData;
};

export const ReviewTab = ({ shopId }: ReviewTabProps) => {
  const [mode, setMode] = useState<Mode>('list');
  const [editTarget, setEditTarget] = useState<ShopReviewItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const [reviews, setReviews] = useState<ShopReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ref로 커서·로딩 상태 관리 → 클로저 stale 방지
  const stateRef = useRef({
    cursor: null as number | null,
    loading: false,
    hasMore: true,
  });
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fetchReviews] = useLazyGetShopReviewsQuery();
  const [createReview, { isLoading: isCreating }] =
    useCreateShopReviewMutation();
  const [updateReview, { isLoading: isUpdating }] =
    useUpdateShopReviewMutation();
  const [deleteReview] = useDeleteShopReviewMutation();

  // 첫 페이지 로드 (shopId 변경 시 상태 초기화 포함)
  const loadInitial = useCallback(() => {
    stateRef.current = { cursor: null, loading: true, hasMore: true };
    setReviews([]);
    setHasMore(true);
    setIsLoading(true);

    fetchReviews({ shopId, cursorId: null })
      .unwrap()
      .then((res) => {
        setReviews(res.items);
        stateRef.current.cursor = res.nextCursorId;
        stateRef.current.hasMore = res.hasNext;
        setHasMore(res.hasNext);
      })
      .catch(() => {})
      .finally(() => {
        stateRef.current.loading = false;
        setIsLoading(false);
      });
  }, [fetchReviews, shopId]);

  // 커서 기반 추가 로드
  const loadMore = useCallback(() => {
    const s = stateRef.current;
    if (s.loading || !s.hasMore) return;
    s.loading = true;
    setIsLoading(true);

    fetchReviews({ shopId, cursorId: s.cursor })
      .unwrap()
      .then((res) => {
        setReviews((prev) => [...prev, ...res.items]);
        stateRef.current.cursor = res.nextCursorId;
        stateRef.current.hasMore = res.hasNext;
        setHasMore(res.hasNext);
      })
      .catch(() => {})
      .finally(() => {
        stateRef.current.loading = false;
        setIsLoading(false);
      });
  }, [fetchReviews, shopId]);

  useEffect(() => {
    loadInitial();
    setMode('list');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  // 무한 스크롤 observer
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  // 메뉴 외부 클릭 닫기
  useEffect(() => {
    if (openMenuId === null) return;
    const handle = () => setOpenMenuId(null);
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [openMenuId]);

  const resetForm = () => {
    setReviewTitle('');
    setReviewContent('');
    setReviewImage(null);
    setEditTarget(null);
  };

  const handleOpenWrite = () => {
    resetForm();
    setMode('write');
  };

  const handleOpenEdit = (review: ShopReviewItem) => {
    setEditTarget(review);
    setReviewTitle(review.title);
    setReviewContent(review.content);
    setReviewImage(null);
    setOpenMenuId(null);
    setMode('edit');
  };

  const handleCancel = () => {
    resetForm();
    setMode('list');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setReviewImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!reviewTitle.trim() || !reviewContent.trim()) return;

    try {
      if (mode === 'write') {
        if (!reviewImage) return;
        const formData = buildFormData(reviewTitle, reviewContent, reviewImage);
        const newReview = await createReview({ shopId, formData }).unwrap();
        setReviews((prev) => [newReview, ...prev]);
      } else if (mode === 'edit' && editTarget) {
        const formData = buildFormData(reviewTitle, reviewContent, reviewImage);
        const updated = await updateReview({
          shopId,
          reviewId: editTarget.reviewId,
          formData,
        }).unwrap();
        setReviews((prev) =>
          prev.map((r) => (r.reviewId === updated.reviewId ? updated : r))
        );
      }
      resetForm();
      setMode('list');
    } catch {
      alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteReview({ shopId, reviewId }).unwrap();
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
    setOpenMenuId(null);
  };

  const isFormMode = mode === 'write' || mode === 'edit';
  const isSubmitting = isCreating || isUpdating;
  const canSubmit =
    reviewTitle.trim() !== '' &&
    reviewContent.trim() !== '' &&
    (mode === 'edit' || reviewImage !== null);

  return (
    <div className="flex flex-col">
      {/* 액션 버튼 */}
      <div className="flex gap-2 border-b p-4">
        {isFormMode ? (
          <>
            <Button
              label="취소"
              variant="secondaryLight"
              size="medium"
              className="flex-1"
              onClick={handleCancel}
            />
            <Button
              label={mode === 'edit' ? '수정 완료' : '등록하기'}
              variant="secondaryDark"
              size="medium"
              className="flex-1"
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
            />
          </>
        ) : (
          <Button
            label="리뷰 작성하기"
            variant="secondaryDark"
            size="medium"
            className="w-full"
            onClick={handleOpenWrite}
          />
        )}
      </div>

      {isFormMode ? (
        <div className="flex flex-col gap-4 p-4">
          {/* 이미지 업로드 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-theme-200"
          >
            {reviewImage ? (
              <img
                src={URL.createObjectURL(reviewImage)}
                alt="리뷰 이미지"
                className="h-full w-full object-cover"
              />
            ) : mode === 'edit' && editTarget?.imageUrl ? (
              <img
                src={editTarget.imageUrl}
                alt="기존 리뷰 이미지"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-theme-500">
                <ImagePlus className="h-8 w-8" />
                {mode === 'write' && (
                  <span className="text-xs">이미지를 선택해주세요 (필수)</span>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <input
            type="text"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="리뷰 제목을 입력해주세요"
            className="rounded-lg border border-theme-200 px-3 py-2 text-sm text-theme-900 outline-none placeholder:text-theme-300 focus:border-theme-700"
          />

          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="리뷰 내용을 입력해주세요. (최대 150자)"
            maxLength={150}
            className="h-32 resize-none rounded-lg border border-theme-200 px-3 py-2 text-sm text-theme-900 outline-none placeholder:text-theme-300 focus:border-theme-700"
          />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-theme-200">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="relative flex flex-col gap-3 p-4"
            >
              {/* 프로필 + 이름 + 메뉴 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-theme-200">
                    {review.authorProfileUrl && (
                      <img
                        src={review.authorProfileUrl}
                        alt={review.authorName}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-theme-900">
                    {review.authorName}
                  </p>
                </div>

                {review.owner && (
                  <div className="relative">
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === review.reviewId
                            ? null
                            : review.reviewId
                        )
                      }
                      className="absolute -right-1 -top-4 text-theme-500 hover:text-theme-900"
                    >
                      <MoreVertical className="h-8 w-4" />
                    </button>

                    {openMenuId === review.reviewId && (
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute right-2 top-6 z-10 flex flex-col overflow-hidden rounded-lg border border-theme-200 bg-white shadow-md"
                      >
                        <button
                          className="w-14 border-b p-2 text-center text-xs text-theme-900 hover:bg-theme-100"
                          onClick={() => handleOpenEdit(review)}
                        >
                          수정
                        </button>
                        <button
                          className="w-14 p-2 text-center text-xs text-red-500 hover:bg-theme-100"
                          onClick={() => handleDelete(review.reviewId)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 제목 */}
              <p className="text-sm font-semibold text-theme-900">
                {review.title}
              </p>

              {/* 내용 + 이미지 */}
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <ExpandableText content={review.content} />
                </div>
                {review.imageUrl && (
                  <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded bg-theme-200">
                    <img
                      src={review.imageUrl}
                      alt="리뷰 이미지"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <p className="text-right text-xs text-theme-500">
                {formatDate(review.createdAt)}
              </p>
            </div>
          ))}

          <div ref={observerTargetRef} className="py-2 text-center">
            {isLoading && (
              <p className="text-sm text-theme-300">불러오는 중...</p>
            )}
            {!hasMore && reviews.length > 0 && (
              <p className="text-sm text-theme-300">마지막 리뷰입니다.</p>
            )}
            {!isLoading && reviews.length === 0 && (
              <p className="py-6 text-center text-xs text-theme-300">
                등록된 리뷰가 없습니다.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { MoreVertical, ImagePlus } from 'lucide-react';

import { Button } from '../../../shared/components/ui';

import { ExpandableText } from './expandable-text';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';

interface Review {
  reviewId: number;
  profileImageUrl: string | null;
  name: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

const fetchReviews = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const items: Review[] = Array.from({ length: 3 }, (_, i) => ({
    reviewId: (page - 1) * 3 + i + 1,
    profileImageUrl: null,
    name: `리뷰어 ${(page - 1) * 3 + i + 1}`,
    content:
      '소품샵에서 진행된 키링 만들기 원데이 클래스에 다녀왔어요 🥰\n정말 좋았습니다!',
    imageUrl: null,
    createdAt: '2025.09.16',
  }));

  return { items, hasMore: page < 3 };
};

export const ReviewTab = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { items, isLoading, hasMore, observerTargetRef } =
    useInfiniteScroll<Review>({
      fetchData: fetchReviews,
    });

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setReviewImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    setIsWriting(false);
    setReviewImage(null);
    setReviewTitle('');
    setReviewContent('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="flex flex-col">
      {/* 리뷰 작성하기 / 등록하기 버튼 */}
      <div className="border-b p-4">
        <Button
          label={isWriting ? '리뷰 등록하기' : '리뷰 작성하기'}
          variant="secondaryDark"
          size="medium"
          className="w-full"
          onClick={isWriting ? handleSubmit : () => setIsWriting(true)}
        />
      </div>

      {isWriting ? (
        <div className="flex flex-col gap-4 px-4 pb-4">
          {/* 이미지 업로드 */}
          <div
            onClick={handleImageClick}
            className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-theme-200"
          >
            {reviewImage ? (
              <img
                src={URL.createObjectURL(reviewImage)}
                alt="리뷰 이미지"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-theme-500">
                <ImagePlus className="h-8 w-8" />
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

          {/* 제목 */}
          <input
            type="text"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="리뷰 제목을 입력해주세요"
            className="rounded-lg border border-theme-200 px-3 py-2 text-sm text-theme-900 outline-none placeholder:text-theme-300 focus:border-theme-700"
          />

          {/* 내용 */}
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
          {items.map((review) => (
            <div
              key={review.reviewId}
              className="relative flex flex-col gap-3 p-4"
            >
              {/* 프로필 + 이름 + 메뉴 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-theme-200">
                    {review.profileImageUrl && (
                      <img
                        src={review.profileImageUrl}
                        alt={review.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-theme-900">
                    {review.name}
                  </p>
                </div>

                <div
                  ref={menuRef}
                  className="relative items-center text-center"
                >
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === review.reviewId ? null : review.reviewId
                      )
                    }
                    className="absolute -right-1 -top-4 text-center text-theme-500 hover:text-theme-900"
                  >
                    <MoreVertical className="h-8 w-4" />
                  </button>

                  {openMenuId === review.reviewId && (
                    <div className="absolute right-2 top-6 z-10 flex flex-col overflow-hidden rounded-lg border border-theme-200 bg-white shadow-md">
                      <button className="w-14 border-b p-2 text-center text-xs text-theme-900 hover:bg-theme-100">
                        수정
                      </button>
                      <button className="w-14 p-2 text-center text-xs text-red-500 hover:bg-theme-100">
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 내용 */}
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <ExpandableText content={review.content} />
                </div>

                {/* 이미지 */}
                <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded bg-theme-200">
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt="리뷰 이미지"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={observerTargetRef} className="py-2 text-center">
            {isLoading && (
              <p className="text-sm text-theme-300">불러오는 중...</p>
            )}
            {!hasMore && (
              <p className="text-sm text-theme-300">마지막 리뷰입니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

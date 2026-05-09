import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  useEffect,
} from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import XIcon from '../../../../assets/x-icon.svg';
import UploadFile from '../../../../assets/upload-file.svg';

import { Button } from '../../../../shared/components/ui';
import { Input } from '../../../../shared/components/ui';

import {
  useLazyGetStoriesQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} from '../api/story-api';
import type { StoryItem, StoryMode } from '../types/story-types.ts';
import { LIST_HEIGHT } from '../constants/story-constants.ts';

import { useInfiniteScroll } from '../../../map/hooks/use-infinite-scroll.ts';

const formatDate = (createdAt: string) =>
  createdAt.slice(0, 10).replace(/-/g, '.');

const StoryList = ({
  sortAsc,
  onToggleSort,
  onEdit,
  onDelete,
}: {
  sortAsc: boolean;
  onToggleSort: () => void;
  onEdit: (story: StoryItem) => void;
  onDelete: (story: StoryItem) => Promise<void>;
}) => {
  const [fetchStoriesQuery] = useLazyGetStoriesQuery();
  const loadCountRef = useRef(0);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const fetchData = useCallback(
    async (page: number) => {
      const result = await fetchStoriesQuery(page).unwrap();
      return {
        items: result.items,
        hasMore: page < result.totalPages,
      };
    },
    [fetchStoriesQuery]
  );

  const { items, isLoading, hasMore, observerTargetRef } =
    useInfiniteScroll<StoryItem>({ fetchData });

  const sortedItems = [...items].sort((a, b) => {
    const cmp = a.createdAt.localeCompare(b.createdAt);
    return sortAsc ? cmp : -cmp;
  });

  useEffect(() => {
    if (!isLoading && items.length > 0) {
      loadCountRef.current += 1;
      if (loadCountRef.current >= 2) {
        setHasLoadedMore(true);
      }
    }
  }, [isLoading, items.length]);

  return (
    <>
      <div className="flex items-center border-b py-3 pr-1.5 text-sm text-theme-900">
        <div className="w-14 shrink-0 text-center">썸네일</div>
        <div className="w-[10rem] shrink-0 text-center">제목</div>
        <div className="min-w-0 flex-1 text-center">내용</div>
        <div className="flex w-[5rem] shrink-0 justify-center">
          <button className="flex items-center gap-1" onClick={onToggleSort}>
            작성일
            {sortAsc ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </button>
        </div>
        <div className="w-[5.5rem] shrink-0 text-center">수정 / 삭제</div>
      </div>

      {/* 리스트 */}
      <ul
        className="overflow-y-auto [scrollbar-gutter:stable]"
        style={{ height: LIST_HEIGHT }}
      >
        {sortedItems.map((story) => (
          <li key={story.storyId} className="flex items-center py-3 text-sm">
            <div className="flex w-14 shrink-0 justify-center">
              <img
                src={story.thumbnailImageUrl}
                alt="thumbnail"
                className="h-10 w-10 rounded bg-gray-200 object-cover"
              />
            </div>
            <div className="w-[10rem] shrink-0 overflow-hidden px-3 text-center">
              <p className="truncate">{story.title}</p>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden px-3 text-center">
              <p className="truncate text-gray-500">{story.content}</p>
            </div>
            <div className="w-[5rem] shrink-0 text-center text-gray-500">
              {formatDate(story.createdAt)}
            </div>
            <div className="w-[5.5rem] shrink-0">
              <div className="flex justify-center gap-1">
                <button
                  className="flex items-center justify-center rounded bg-blue-400 px-1.5 py-1.5 text-xs text-white hover:bg-blue-300"
                  onClick={() => onEdit(story)}
                >
                  수정
                </button>
                <button
                  className="flex items-center justify-center rounded bg-black px-1.5 py-1.5 text-xs text-white hover:bg-gray-700"
                  onClick={() => onDelete(story)}
                >
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}

        <div ref={observerTargetRef} className="py-2 text-center">
          {isLoading && (
            <p className="text-sm text-theme-300">불러오는 중...</p>
          )}
          {!hasMore && items.length > 0 && hasLoadedMore && (
            <p className="text-sm text-theme-300">마지막 스토리입니다.</p>
          )}
          {!isLoading && items.length === 0 && (
            <p className="py-6 text-center text-xs text-gray-400">
              등록된 스토리가 없습니다.
            </p>
          )}
        </div>
      </ul>
    </>
  );
};

export const StoryManagement = () => {
  const [mode, setMode] = useState<StoryMode>('registering');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [listKey, setListKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createStory] = useCreateStoryMutation();
  const [updateStory] = useUpdateStoryMutation();
  const [deleteStory] = useDeleteStoryMutation();

  const isActionEnabled =
    image !== null && title.trim() !== '' && content.trim() !== '';

  const resetForm = () => {
    setImage(null);
    setImageFile(null);
    setTitle('');
    setContent('');
    setEditingId(null);
    setMode('registering');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleImageRemove = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!isActionEnabled || !imageFile) return;
    try {
      await createStory({ title, content, thumbnailImage: imageFile }).unwrap();
      setListKey((k) => k + 1);
      resetForm();
    } catch {
      alert('스토리 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleEditClick = (story: StoryItem) => {
    const confirmed = window.confirm('해당 스토리를 수정하시겠습니까?');
    if (!confirmed) return;
    setMode('editing');
    setEditingId(story.storyId);
    setImage(story.thumbnailImageUrl);
    setImageFile(null);
    setTitle(story.title);
    setContent(story.content);
  };

  const handleEditSave = async () => {
    if (!isActionEnabled || editingId === null) return;
    try {
      await updateStory({
        storyId: editingId,
        title,
        content,
        ...(imageFile ? { thumbnailImage: imageFile } : {}),
      }).unwrap();
      setListKey((k) => k + 1);
      resetForm();
    } catch {
      alert('스토리 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteClick = async (story: StoryItem) => {
    const confirmed = window.confirm(
      `제목: ${story.title}\n내용: ${story.content}\n\n위 스토리를 삭제하시겠습니까?`
    );
    if (!confirmed) return;
    try {
      await deleteStory(story.storyId).unwrap();
      setListKey((k) => k + 1);
    } catch {
      alert('스토리 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 스토리 등록/수정 */}
      <section className="flex flex-col rounded-xl bg-white px-[1.5rem] pb-[0.75rem] pt-[1.5rem]">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold">
            {mode === 'editing' ? '스토리 수정하기' : '스토리 등록하기'}
          </h3>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          <div className="relative h-[6rem] w-[6rem]">
            {image ? (
              <>
                <img
                  src={image}
                  alt="story-preview"
                  className="h-full w-full rounded-lg bg-gray-200 object-cover"
                />
                <Button
                  icon={<img src={XIcon} alt="" width={12} height={12} />}
                  variant="icon"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow"
                  onClick={handleImageRemove}
                  aria-label="닫기"
                />
              </>
            ) : (
              <label className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gray-200">
                <img src={UploadFile} alt="" aria-label="이미지 등록" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpg,image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageAdd}
                />
              </label>
            )}
          </div>

          <Input
            className="w-full"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="block h-[7.0625rem] w-full resize-none rounded-lg border border-gray-500 px-3 py-2 text-sm placeholder:text-gray-400"
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-center gap-1">
            {mode === 'editing' && (
              <Button
                variant="secondaryDark"
                className="flex items-center justify-center px-4 py-2 text-xs"
                label="취소"
                onClick={resetForm}
              />
            )}
            <Button
              variant="secondaryDark"
              className="flex items-center justify-center px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              label={mode === 'editing' ? '수정완료' : '업로드'}
              disabled={!isActionEnabled}
              onClick={mode === 'editing' ? handleEditSave : handleUpload}
            />
          </div>
        </div>
      </section>

      {/* 스토리 리스트 */}
      <section className="flex flex-col rounded-xl bg-white px-[1.5rem] py-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold">스토리 리스트</h3>
        </div>

        <StoryList
          key={listKey}
          sortAsc={sortAsc}
          onToggleSort={() => setSortAsc((prev) => !prev)}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </section>
    </div>
  );
};

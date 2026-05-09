import { useState, useRef, type ChangeEvent } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

import XIcon from '../../../../assets/x-icon.svg';
import UploadFile from '../../../../assets/upload-file.svg';

import { Button } from '../../../../shared/components/ui';
import { Input } from '../../../../shared/components/ui';

type StoryMode = 'registering' | 'editing';

type Story = {
  id: number;
  imageUrl: string;
  title: string;
  content: string;
  createdAt: string;
};

// TODO: API 연결 시 제거
let nextStoryId = 5;

// TODO: API 연결 시 제거
const DUMMY_STORIES: Story[] = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/40x40/c8d4e0/c8d4e0',
    title: '수원은 비가 온대요, 대구는 쨍쨍합니다',
    content:
      "오늘은 '수니작가'님 신상 굿즈 들어오는 날~ 비 오기 전에 얼른 도착해주세요",
    createdAt: '2025.09.13',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/40x40/d4c8e0/d4c8e0',
    title: '제목 어쩌구 저쩌구 말라말라 라',
    content: '내용 어쩌구 저쩌구 길고 긴 이야기가 계속됩니다 정말로요',
    createdAt: '2025.09.12',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/40x40/c8e0d4/c8e0d4',
    title: '제목 어쩌구 저쩌구 말라말라 라',
    content: '내용 어쩌구 저쩌구...',
    createdAt: '2025.09.11',
  },
  {
    id: 4,
    imageUrl: 'https://placehold.co/40x40/e0d4c8/e0d4c8',
    title: '제목 어쩌구 저쩌구 말라말라 라라',
    content: '내용 어쩌구 저쩌구 여기도 내용이 좀 길어요 한번 봐요',
    createdAt: '2025.09.10',
  },
  {
    id: 5,
    imageUrl: 'https://placehold.co/40x40/e0c8d4/e0c8d4',
    title: '더미 스토리 5번째 항목입니다',
    content: '스크롤 테스트용 항목이에요',
    createdAt: '2025.09.09',
  },
  {
    id: 6,
    imageUrl: 'https://placehold.co/40x40/d4e0c8/d4e0c8',
    title: '더미 스토리 6번째 항목입니다',
    content: '스크롤 테스트용 항목이에요',
    createdAt: '2025.09.08',
  },
];

const LIST_HEIGHT = '15rem';

export const StoryManage = () => {
  const [mode, setMode] = useState<StoryMode>('registering');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [stories, setStories] = useState<Story[]>(DUMMY_STORIES);
  const [sortAsc, setSortAsc] = useState(false);

  // TODO: API 연결 시 활용 (intersection observer 타깃)
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isActionEnabled =
    image !== null && title.trim() !== '' && content.trim() !== '';

  const resetForm = () => {
    setImage(null);
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
  };

  const handleImageRemove = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = () => {
    if (!isActionEnabled) return;
    const newStory: Story = {
      id: nextStoryId++,
      imageUrl: image!,
      title,
      content,
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    };
    setStories((prev) => [newStory, ...prev]);
    resetForm();
  };

  const handleEditClick = (story: Story) => {
    const confirmed = window.confirm('해당 스토리를 수정하시겠습니까?');
    if (!confirmed) return;
    setMode('editing');
    setEditingId(story.id);
    setImage(story.imageUrl);
    setTitle(story.title);
    setContent(story.content);
  };

  const handleEditSave = () => {
    if (!isActionEnabled || editingId === null) return;
    setStories((prev) =>
      prev.map((s) =>
        s.id === editingId ? { ...s, imageUrl: image!, title, content } : s
      )
    );
    resetForm();
  };

  const handleDeleteClick = (story: Story) => {
    const confirmed = window.confirm(
      `제목: ${story.title}\n내용: ${story.content}\n\n위 스토리를 삭제하시겠습니까?`
    );
    if (confirmed) {
      setStories((prev) => prev.filter((s) => s.id !== story.id));
    }
  };

  const sortedStories = [...stories].sort((a, b) => {
    const cmp = a.createdAt.localeCompare(b.createdAt);
    return sortAsc ? cmp : -cmp;
  });

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

        <div className="flex items-center border-b py-3 text-sm text-theme-900">
          <div className="w-14 shrink-0 text-center">썸네일</div>
          <div className="w-[10rem] shrink-0 text-center">제목</div>
          <div className="min-w-0 flex-1 text-center">내용</div>
          <div className="flex w-[5rem] shrink-0 justify-center">
            <button
              className="flex items-center gap-1"
              onClick={() => setSortAsc((prev) => !prev)}
            >
              작성일
              {sortAsc ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
            </button>
          </div>
          <div className="ml-2 w-[5.5rem] shrink-0 text-center">
            수정 / 삭제
          </div>
        </div>

        {sortedStories.length === 0 ? (
          <div
            className="overflow-y-auto bg-red-300"
            style={{ height: LIST_HEIGHT }}
          >
            <p className="py-6 text-center text-xs text-gray-400">
              등록된 스토리가 없습니다.
            </p>
          </div>
        ) : (
          <ul className="overflow-y-auto" style={{ height: LIST_HEIGHT }}>
            {sortedStories.map((story) => (
              <li key={story.id} className="flex items-center py-3 text-sm">
                <div className="flex w-14 shrink-0 justify-center">
                  <img
                    src={story.imageUrl}
                    alt="thumbnail"
                    className="h-10 w-10 rounded bg-gray-200 object-cover"
                  />
                </div>

                <div className="w-[10rem] shrink-0 overflow-hidden px-3 text-left">
                  <p className="truncate">{story.title}</p>
                </div>

                <div className="min-w-0 flex-1 overflow-hidden px-3 text-left">
                  <p className="truncate text-gray-500">{story.content}</p>
                </div>

                <div className="w-[5rem] shrink-0 text-center text-gray-500">
                  {story.createdAt}
                </div>

                <div className="ml-2 w-[5rem] shrink-0">
                  <div className="flex justify-center gap-1">
                    <button
                      className="flex items-center justify-center rounded bg-blue-400 px-1.5 py-1.5 text-xs text-white hover:bg-blue-300"
                      onClick={() => handleEditClick(story)}
                    >
                      수정
                    </button>
                    <button
                      className="flex items-center justify-center rounded bg-black px-1.5 py-1.5 text-xs text-white hover:bg-gray-700"
                      onClick={() => handleDeleteClick(story)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </li>
            ))}

            {/* TODO: API 연결 시 intersection observer 타깃으로 사용 */}
            <div ref={bottomRef} />
          </ul>
        )}
      </section>
    </div>
  );
};

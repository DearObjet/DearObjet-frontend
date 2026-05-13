import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { useAppSelector } from '../../../app/hooks';

import {
  useLazyGetAllPostsQuery,
  useLazyGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} from '../api/post-api';
import { PostGrid } from '../components/post-grid';
import { CreatePostModal } from '../components/create-post-modal';
import { PostViewModal } from '../components/post-view-modal';
import type { PostDetail, PostListItem } from '../types/post-type';
import { Button } from '../../../shared/components/ui';

export const Post = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);
  const [gridKey, setGridKey] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
  const [triggerGetPost] = useLazyGetPostQuery();
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const user = useAppSelector((state) => state.auth.user);

  const fetchPosts = useCallback(
    async (
      page: number
    ): Promise<{ items: PostListItem[]; hasMore: boolean }> => {
      const result = await triggerGetAllPosts(page).unwrap();
      return {
        items: result.items,
        hasMore: result.page < result.totalPages,
      };
    },
    [triggerGetAllPosts]
  );

  const handlePostClick = async (postId: number) => {
    try {
      const detail = await triggerGetPost(postId).unwrap();
      setSelectedPost(detail);
    } catch {
      alert('다시 시도해주세요.');
    }
  };

  const handleSubmitPost = async (image: File | null, content: string) => {
    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify({ content })], { type: 'application/json' })
    );
    if (image) {
      formData.append('images', image);
    }
    await createPost(formData).unwrap();
    setShowCreate(false);
    setGridKey((prev) => prev + 1);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId).unwrap();
      setSelectedPost(null);
    } catch {
      alert('다시 시도해주세요.');
    }
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    if (searchParams.has('id')) {
      searchParams.delete('id');
      setSearchParams(searchParams, { replace: true });
    }
  };

  useEffect(() => {
    const postId = searchParams.get('id');
    if (!postId) return;

    triggerGetPost(Number(postId))
      .unwrap()
      .then((detail) => setSelectedPost(detail))
      .catch(() => alert('포스트를 불러올 수 없습니다.'));
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      {user && (
        <div className="flex justify-end py-4">
          <Button
            label="새 게시글"
            onClick={() => setShowCreate(true)}
            variant="secondaryLight"
          />
        </div>
      )}

      <PostGrid
        key={gridKey}
        fetchData={fetchPosts}
        onPostClick={handlePostClick}
      />

      {showCreate && user && (
        <CreatePostModal
          user={user}
          onSubmit={handleSubmitPost}
          onClose={() => setShowCreate(false)}
        />
      )}

      {selectedPost && (
        <PostViewModal
          post={selectedPost}
          user={user}
          onClose={handleCloseModal}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

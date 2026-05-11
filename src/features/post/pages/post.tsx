import { useCallback, useState } from 'react';

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

export const Post = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);

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
    const detail = await triggerGetPost(postId).unwrap();
    setSelectedPost(detail);
  };

  const handleSubmitPost = async (image: File, content: string) => {
    const formData = new FormData();
    formData.append(
      'request',
      new Blob([JSON.stringify({ content })], { type: 'application/json' })
    );
    formData.append('images', image);

    await createPost(formData).unwrap();
    setShowCreate(false);
  };

  const handleDeletePost = async (postId: number) => {
    await deletePost(postId).unwrap();
    setSelectedPost(null);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {user && (
        <div className="flex justify-end px-5 py-3.5">
          <button onClick={() => setShowCreate(true)}>새 게시글</button>
        </div>
      )}

      <PostGrid fetchData={fetchPosts} onPostClick={handlePostClick} />

      {showCreate && user && (
        <CreatePostModal
          user={user}
          onSubmit={handleSubmitPost}
          onClose={() => setShowCreate(false)}
        />
      )}

      {selectedPost && user && (
        <PostViewModal
          post={selectedPost}
          user={user}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

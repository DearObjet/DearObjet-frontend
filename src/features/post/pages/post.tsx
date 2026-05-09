import { useState } from 'react';

import { Button } from '../../../shared/components/ui';

import { PostGrid } from '../components/post-grid';
import { CreatePostModal } from '../components/create-post-modal';
import { PostViewModal } from '../components/post-view-modal';
import type { PostData } from '../types/post-type';

const fetchPosts = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const items: PostData[] = Array.from({ length: 9 }, (_, i) => ({
    id: (page - 1) * 9 + i + 1,
    userId: 1,
    userName: '김명화',
    imageUrl: '',
    content: '테스트 포스트입니다.',
  }));

  return { items, hasMore: page < 3 };
};

const CURRENT_USER = { id: 1, name: '김명화' };

export const Post = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  const handleSubmitPost = (imageUrl: string, content: string) => {
    console.log('새 포스트:', { imageUrl, content });
    setShowCreate(false);
  };

  const handleDeletePost = (postId: number) => {
    console.log('삭제할 포스트 id:', postId);
    setSelectedPost(null);
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="flex justify-end py-4">
        <Button
          label="새 게시글"
          onClick={() => setShowCreate(true)}
          variant="secondaryLight"
        />
      </div>

      <PostGrid fetchData={fetchPosts} onPostClick={setSelectedPost} />

      {showCreate && (
        <CreatePostModal
          authorName={CURRENT_USER.name}
          onSubmit={handleSubmitPost}
          onClose={() => setShowCreate(false)}
        />
      )}

      {selectedPost && (
        <PostViewModal
          post={selectedPost}
          currentUserId={CURRENT_USER.id}
          onClose={() => setSelectedPost(null)}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
};

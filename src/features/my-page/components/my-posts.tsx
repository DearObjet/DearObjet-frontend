import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useAppSelector } from '../../../app/hooks';
import { ROUTES } from '../../../shared/constants';

import { useLazyGetUserPostsQuery } from '../../post/api/post-api';
import type { PostListItem } from '../../post/types/post-type';

import { MyPostsGrid } from './my-posts-grid';
import { MyPageLayout } from './my-page-layout';

export const MyPosts = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [triggerGetUserPosts] = useLazyGetUserPostsQuery();

  const fetchData = useCallback(
    async (
      page: number
    ): Promise<{ items: PostListItem[]; hasMore: boolean }> => {
      if (!user?.userId) return { items: [], hasMore: false };
      const result = await triggerGetUserPosts({
        userId: user.userId,
        page,
      }).unwrap();
      return {
        items: result.items,
        hasMore: result.page < result.totalPages,
      };
    },
    [triggerGetUserPosts, user?.userId]
  );

  const handlePostClick = (postId: number) => {
    navigate(`${ROUTES.POSTS}?id=${postId}`);
  };

  return (
    <MyPageLayout>
      <MyPostsGrid fetchData={fetchData} onPostClick={handlePostClick} />
    </MyPageLayout>
  );
};

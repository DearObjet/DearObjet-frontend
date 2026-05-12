import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';

import { USER_ROLE } from '../../constants';

import { Button } from '../ui';
import { UserProfile } from '../layout/aside/user-profile';

import { useGetUserPostsQuery } from '../../../features/post/api/post-api';

interface UserPostListProps {
  userName?: string;
  userImage?: string;
  userId?: number;
  showSuggest?: boolean;
  onSuggest?: () => void;
  onPostClick?: (postId: number) => void;
}

export const UserPostList = ({
  userName = '',
  userImage = '',
  userId,
  showSuggest = false,
  onSuggest,
  onPostClick,
}: UserPostListProps) => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isShop = userRole === USER_ROLE.SHOP;

  const { data, isLoading } = useGetUserPostsQuery(
    { userId: userId!, page: 1 },
    { skip: !userId }
  );

  const posts = data?.items ?? [];
  const hasPost = posts.length > 0;

  return (
    <div className="w-[33.75rem]">
      <div className="mb-3 flex items-center justify-between">
        <UserProfile
          variant="aside"
          userName={userName}
          userImage={userImage}
          className="text-black"
        />
        {showSuggest && isShop && (
          <Button
            variant="secondaryDark"
            label="입점 제안하기"
            onClick={onSuggest}
          />
        )}
      </div>

      {isLoading ? (
        <div className="flex h-[33.55rem] items-center justify-center">
          <p className="text-sm text-gray-400">불러오는 중...</p>
        </div>
      ) : hasPost ? (
        <div className="grid grid-cols-3">
          {posts.map((post) => (
            <button
              key={post.postId}
              onClick={() => onPostClick?.(post.postId)}
              className="focus:outline-none"
            >
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt={`${post.authorName}의 포스트`}
                  className="h-[11.18375rem] w-[11.18375rem] rounded-[10px] border border-white bg-gray-300 object-cover"
                />
              ) : (
                <div className="h-[11.18375rem] w-[11.18375rem] rounded-[10px] border border-white bg-gray-300" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex h-[33.55rem] items-center justify-center">
          <p className="text-sm text-gray-400">등록된 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

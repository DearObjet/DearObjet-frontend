import { Button } from '../ui';
import { UserProfile } from '../layout/aside/user-profile';

interface PostImage {
  src: string;
  alt: string;
}

interface PostProps {
  userName?: string;
  userImage?: string;
  userId?: string;
  images?: PostImage[];
  showSuggest?: boolean;
  onSuggest?: () => void;
  hasPost?: boolean;
}

export const Post = ({
  userName = '',
  userImage = '',
  images = Array.from({ length: 9 }, (_, i) => ({
    src: '',
    alt: `포스트 ${i + 1}`,
  })),
  showSuggest = false,
  onSuggest,
  hasPost = true,
}: PostProps) => {
  return (
    <div className="w-[33.75rem]">
      <div className="mb-3 flex items-center justify-between">
        <UserProfile
          variant="aside"
          userName={userName}
          userImage={userImage}
          className="text-black"
        />
        {showSuggest && (
          <Button
            variant="secondaryDark"
            label="입점 제안하기"
            onClick={onSuggest}
          />
        )}
      </div>

      {hasPost ? (
        <div className="grid grid-cols-3">
          {images.map((image, i) => (
            <img
              key={i}
              src={image.src}
              alt={image.alt}
              className="h-[11.18375rem] w-[11.18375rem] rounded-[10px] border border-white bg-gray-300 object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[33.55rem] items-center justify-center">
          <p className="text-sm text-gray-400">등록된 포스터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

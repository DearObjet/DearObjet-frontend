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
}

export const Post = ({
  userName = '',
  userImage = '',
  userId = '',
  images = Array.from({ length: 9 }, (_, i) => ({
    src: '',
    alt: `포스트 ${i + 1}`,
  })),
  showSuggest = false,
  onSuggest,
}: PostProps) => {
  return (
    <div className="w-[33.5625rem]">
      <div className="mb-3 flex items-center justify-between">
        <UserProfile
          variant="aside"
          userName={userName}
          userId={userId}
          userImage={userImage}
        />
        {showSuggest && (
          <Button
            variant="secondaryDark"
            label="입점 제안하기"
            onClick={onSuggest}
          />
        )}
      </div>

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
    </div>
  );
};

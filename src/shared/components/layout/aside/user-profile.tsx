import DearObjectWhiteLogo from '../../../../assets/dear-objet-white-logo.svg';

interface UserProfileProps {
  variant?: 'author' | 'aside';
  userName: string;
  userId?: string;
  userImage?: string;
  postTime?: string;
  className?: string;
  isSelected?: boolean;
  onAction?: () => void;
}

export const UserProfile = ({
  variant,
  userName,
  userId,
  userImage,
  className = '',
  isSelected = false,
  onAction,
}: UserProfileProps) => {
  if (variant === 'author') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative cursor-pointer" onClick={onAction}>
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className={`h-[6.9375rem] w-[7rem] rounded-full object-cover transition-all ${
                isSelected ? 'ring-2 ring-blue-100' : ''
              }`}
            />
          ) : (
            <div
              className={`flex h-[6.9375rem] w-[7rem] items-center justify-center rounded-full bg-black transition-all ${
                isSelected ? 'ring-blue ring-2' : ''
              }`}
            >
              <img
                src={DearObjectWhiteLogo}
                alt="기본 프로필"
                className="w-[60%]"
              />
            </div>
          )}
        </div>
        <span
          className={`mt-1 text-sm transition-colors ${
            isSelected ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {userName}
        </span>
      </div>
    );
  }

  if (variant === 'aside') {
    return (
      <div className={`flex items-center gap-[10px] ${className}`}>
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-[42px] w-[42px] rounded-full object-cover"
          />
        ) : (
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-black">
            <img
              src={DearObjectWhiteLogo}
              alt="기본 프로필"
              className="w-[60%]"
            />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-base font-normal text-gray-200">
            {userName}
          </span>
          <span className="text-xs text-gray-300">{userId}</span>
        </div>
      </div>
    );
  }

  return null;
};

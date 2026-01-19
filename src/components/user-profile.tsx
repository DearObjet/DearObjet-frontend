import React from 'react';

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

const UserProfile: React.FC<UserProfileProps> = ({
  variant,
  userName,
  userId,
  userImage,
  className = '',
  isSelected = false,
  onAction,
}) => {
  const defaultImage = '';

  if (variant === 'author') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative cursor-pointer" onClick={onAction}>
          <img
            src={userImage || defaultImage}
            alt={userName}
            className={`h-28 w-28 rounded-full object-cover transition-all ${
              isSelected ? 'ring-2 ring-blue-100' : ''
            }`}
          />
        </div>
        <span
          className={`mt-4 text-sm transition-colors ${
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
        <img
          src={userImage || defaultImage}
          alt={userName}
          className="h-[42px] w-[42px] rounded-full object-cover"
        />
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

export default UserProfile;

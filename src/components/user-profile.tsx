import React from 'react';

interface UserProfileProps {
  variant?: 'aside';
  userName: string;
  userId?: string;
  userImage?: string;
  postTime?: string;
  className?: string;
  onAction?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  variant,
  userName,
  userId,
  userImage,
  className = '',
}) => {
  const defaultImage = '';

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

  return;
};

export default UserProfile;

import type { AvatarProps } from '../types/post-type';

export const Avatar = ({ user, size = 'md' }: AvatarProps) => {
  const sizeClass = size === 'md' ? 'h-9 w-9 text-sm' : 'h-7 w-7 text-xs';

  if (user.profileUrl) {
    return (
      <div className={`shrink-0 overflow-hidden rounded-full ${sizeClass}`}>
        <img
          src={user.profileUrl}
          alt={user.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-medium ${sizeClass}`}
    >
      {user.name[0]}
    </div>
  );
};

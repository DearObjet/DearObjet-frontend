import type { AvatarProps } from '../types/post-type';

export const Avatar = ({ name, size = 'md' }: AvatarProps) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-medium ${size === 'md' ? 'h-9 w-9 text-sm' : 'h-7 w-7 text-xs'} `}
  >
    {name[0]}
  </div>
);

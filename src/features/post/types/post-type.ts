import type { AuthUser } from '../../auth/types/auth-types';

export interface PostDetail {
  postId: number;
  userId: number;
  userName: string;
  authorProfileUrl: string | null;
  content: string;
  imageUrls: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface PostListItem {
  postId: number;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface PostListResponse {
  items: PostListItem[];
  page: number;
  totalPages: number;
}

export type AvatarInformProps = {
  name: string;
  profileUrl: string | null;
};

export interface AvatarProps {
  user: AvatarInformProps;
  size?: 'sm' | 'md';
}

export interface ConfirmModalProps {
  message: string;
  onYes: () => void;
  onNo: () => void;
}

export interface CreatePostModalProps {
  user: AuthUser;
  onSubmit: (image: File, content: string) => void;
  onClose: () => void;
}

export interface PostViewModalProps {
  post: PostDetail;
  user: AuthUser;
  onClose: () => void;
  onDelete: (postId: number) => void;
}

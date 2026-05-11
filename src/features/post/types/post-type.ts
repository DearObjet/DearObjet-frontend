export interface PostData {
  id: number;
  userId: number;
  userName: string;
  imageUrl: string;
  content: string;
}

export interface PostGridProps {
  posts: PostData[];
  onPostClick: (post: PostData) => void;
}

export interface PostViewModalProps {
  post: PostData;
  currentUserId: number | null;
  onClose: () => void;
  onDelete: (postId: number) => void;
}

export interface ConfirmModalProps {
  message: string;
  onYes: () => void;
  onNo: () => void;
}

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

export interface CreatePostModalProps {
  authorName: string;
  onSubmit: (imageUrl: string, content: string) => void;
  onClose: () => void;
}

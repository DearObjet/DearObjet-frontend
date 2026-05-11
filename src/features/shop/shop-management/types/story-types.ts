export type StoryItem = {
  storyId: number;
  thumbnailImageUrl: string;
  title: string;
  content: string;
  createdAt: string;
};

export type StoryListResponse = {
  items: StoryItem[];
  page: number;
  totalPages: number;
};

export type StoryResponse = {
  storyId: number;
  thumbnailImageUrl: string;
  title: string;
  content: string;
  createdAt: string;
};

export type CreateStoryRequest = {
  title: string;
  content: string;
  thumbnailImage: File;
};

export type UpdateStoryRequest = {
  storyId: number;
  title: string;
  content: string;
  thumbnailImage?: File;
};

export type StoryMode = 'registering' | 'editing';

export interface MapStoryItem {
  storyId: number;
  thumbnailImageUrl: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface MapStoryListResponse {
  items: MapStoryItem[];
  page: number;
  totalPages: number;
}

export interface StoryTabProps {
  shopId: number;
}

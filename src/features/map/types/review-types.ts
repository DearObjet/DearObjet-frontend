export interface ShopReviewItem {
  reviewId: number;
  userId: number;
  authorName: string;
  authorProfileUrl: string | null;
  title: string;
  content: string;
  imageUrl: string | null;
  owner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopReviewListResponse {
  items: ShopReviewItem[];
  nextCursorId: number | null;
  hasNext: boolean;
}

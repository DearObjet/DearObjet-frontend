export interface NoticeItem {
  noticeId: number;
  type: string;
  title: string;
  date: string;
  content?: string;
}

export interface NoticeApiItem {
  noticeId: number;
  target: 'USER' | 'ARTIST_SHOP';
  category:
    | 'IMPORTANT'
    | 'GENERAL'
    | 'FESTIVAL'
    | 'CULTURE_PERFORMANCE'
    | 'EVENT';
  badge: string;
  title: string;
  body: string;
  createdAt: string;
  new: boolean;
}

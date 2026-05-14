import { useSearchParams } from 'react-router';
import { MyFavorites } from '../components/my-favorites';
import { MyProfile } from '../components/myprofile';
import { MyReservations } from '../components/myreservations';
import { MyPosts } from '../components/my-posts';
import { MyMessages } from '../components/my-messages';

const TAB_MAP = {
  bookmarks: <MyFavorites />,
  profile: <MyProfile />,
  reservations: <MyReservations />,
  posts: <MyPosts />,
  messages: <MyMessages />,
} as const;

type Tab = keyof typeof TAB_MAP;

export const MyPage = () => {
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'bookmarks') as Tab;

  return TAB_MAP[tab] ?? TAB_MAP['bookmarks'];
};

import { useSearchParams } from 'react-router';
import { MyBookMarks } from '../components/mybookmarks';
import { MyProfile } from '../components/myprofile';
import { MyReservations } from '../components/myreservations';
import { MyPosts } from '../components/myposts';
import { MyMessages } from '../components/mymessages';

const TAB_MAP = {
  bookmarks: <MyBookMarks />,
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

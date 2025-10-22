import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoticeList } from './notice-list';
import type { NoticeItem } from './notice-list';

const meta = {
  title: 'Components/NoticeList',
  component: NoticeList,
} satisfies Meta<typeof NoticeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    notices: [
      {
        id: 1,
        title: '주요공지',
        description: '주요공지주요공지주요공지',
        date: '2025.10.22',
      },
      {
        id: 2,
        title: '업데이트',
        description: '업데이트업데이트업데이트',
        date: '2025.10.21',
      },
      {
        id: 3,
        title: '점검 안내',
        description: '점검 안내점검 안내점검 안내점검 안내',
        date: '2025.10.20',
      },
    ] as NoticeItem[],
  },
};

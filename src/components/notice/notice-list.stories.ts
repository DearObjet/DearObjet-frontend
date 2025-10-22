import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoticeList } from './notice-list';
import type { NoticeItem } from './notice-list';

const meta = {
  title: 'Components/NoticeList',
  component: NoticeList,
  argTypes: {
    onSelectNotice: { action: 'notice selected' },
  },
} satisfies Meta<typeof NoticeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    notices: [
      {
        id: 1,
        type: '주요공지',
        title: '주요공지주요공지주요공지',
        date: '2025.10.22',
        content: '주요 공지사항의 상세 내용입니다.',
      },
      {
        id: 2,
        type: '업데이트',
        title: '업데이트업데이트업데이트',
        date: '2025.10.21',
        content: '업데이트 관련 상세 내용입니다.',
      },
      {
        id: 3,
        type: '점검 안내',
        title: '점검 안내점검 안내점검 안내점검 안내',
        date: '2025.10.20',
        content: '점검 안내 상세 내용입니다.',
      },
    ] as NoticeItem[],
    onSelectNotice: (notice) => console.log('Selected:', notice),
    selectedId: undefined,
  },
};

export const WithSelectedItem: Story = {
  args: {
    ...Default.args,
    selectedId: 1,
  },
};

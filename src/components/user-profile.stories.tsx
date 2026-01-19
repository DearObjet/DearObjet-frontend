import type { Meta, StoryObj } from '@storybook/react-vite';
import UserProfile from './user-profile';

const meta = {
  title: 'Components/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['author', 'aside'],
      description: '프로필 변형 타입',
    },
    userName: {
      control: 'text',
      description: '사용자 이름',
    },
    userId: {
      control: 'text',
      description: '사용자 ID',
    },
    userImage: {
      control: 'text',
      description: '사용자 이미지 URL',
    },
    isSelected: {
      control: 'boolean',
      description: '선택 상태',
    },
  },
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Author: Story = {
  args: {
    variant: 'author',
    userName: '김자까',
    userImage: '',
    isSelected: false,
  },
};

export const Aside: Story = {
  args: {
    variant: 'aside',
    userName: '김자까',
    userId: 'jakka@gmail.com',
    userImage: '',
  },
};

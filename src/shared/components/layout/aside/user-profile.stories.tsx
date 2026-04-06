import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserProfile } from './user-profile';

const meta = {
  title: 'Components/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['author', 'aside'],
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

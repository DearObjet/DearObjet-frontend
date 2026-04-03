import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageCircleMore } from 'lucide-react';

import { Asidetab } from './aside-tab-menu';

const meta = {
  title: 'Example/Asidetab',
  component: Asidetab,
  tags: ['autodocs'],
} satisfies Meta<typeof Asidetab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Message',
    icon: MessageCircleMore,
  },
};

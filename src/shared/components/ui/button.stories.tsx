import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown } from 'lucide-react';
import { fn } from 'storybook/test';

import { Button, type ButtonProps } from './button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondaryLight', 'secondaryDark', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Button',
  },
};

export const Icon: Story = {
  render: (args: ButtonProps) => {
    return <Button {...args} icon={<ChevronDown />} />;
  },
  args: {
    variant: 'icon',
  },
};

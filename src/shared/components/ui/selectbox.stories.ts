import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectBox } from './selectbox';

const meta = {
  title: 'Example/SelectBox',
  component: SelectBox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof SelectBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

export const Default: Story = {
  args: {
    options,
    placeholder: '과일을 선택하세요',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    options,
    placeholder: 'Small SelectBox',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    options,
    placeholder: 'Large SelectBox',
    size: 'large',
  },
};

export const WithBackgroundColor: Story = {
  args: {
    options,
    placeholder: 'Custom Background',
    size: 'medium',
    backgroundColor: '#fde68a',
  },
};

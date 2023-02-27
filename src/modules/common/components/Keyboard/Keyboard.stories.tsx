import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Keyboard } from './';

export default {
  title: 'Components/Common/Keyboard',
  component: Keyboard,
} as ComponentMeta<typeof Keyboard>;

const Template: ComponentStory<typeof Keyboard> = (args) => <Keyboard {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  macOs: ['⌘', 'Z'],
  shortcut: ['ctrl', 'Z'],
};

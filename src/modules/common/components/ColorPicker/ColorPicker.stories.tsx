import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ColorPicker } from './ColorPicker';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Color Picker',
  component: ColorPicker,
} as ComponentMeta<typeof ColorPicker>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof ColorPicker> = (args) => <ColorPicker {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  color: '#ddd',
  label: 'ColorPicker',
  colorSwatch: ['red', 'green', 'blue'],
};

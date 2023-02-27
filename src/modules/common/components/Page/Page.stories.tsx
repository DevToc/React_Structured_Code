import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Page } from './Page';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Page',
  component: Page,
  argTypes: {
    bg: { control: 'color' },
  },
} as ComponentMeta<typeof Page>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Page> = (args) => <Page {...args}>Test</Page>;

export const Primary = Template.bind({});

Primary.args = {
  bg: '#ddd',
  width: 500,
  height: 500,
  zoom: 1,
};

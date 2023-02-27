import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HelpLink } from './Helplink';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar/HelpLink',
  component: HelpLink,
} as ComponentMeta<typeof HelpLink>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof HelpLink> = (args) => <HelpLink />;

export const Primary = Template.bind({});

Primary.args = {};

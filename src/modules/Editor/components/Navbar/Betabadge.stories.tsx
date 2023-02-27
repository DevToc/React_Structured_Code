import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BetaBadge } from './Betabadge';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar/BetaBadge',
  component: BetaBadge,
} as ComponentMeta<typeof BetaBadge>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof BetaBadge> = (args) => <BetaBadge />;

export const Primary = Template.bind({});

Primary.args = {};

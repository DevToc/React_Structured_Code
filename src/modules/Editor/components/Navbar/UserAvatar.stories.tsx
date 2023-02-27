import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UserAvatar } from './UserAvatar';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar/User Avatar',
  component: UserAvatar,
} as ComponentMeta<typeof UserAvatar>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof UserAvatar> = (args) => <UserAvatar />;

export const Primary = Template.bind({});

Primary.args = {};

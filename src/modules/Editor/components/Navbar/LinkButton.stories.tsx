import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LinkButton } from './LinkButton';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar/Link button',
  component: LinkButton,
} as ComponentMeta<typeof LinkButton>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof LinkButton> = (args) => (
  <LinkButton {...args}>
    <span>Go to venngage</span>
  </LinkButton>
);

export const Primary = Template.bind({});

Primary.args = {
  href: 'https://venngage.com',
};

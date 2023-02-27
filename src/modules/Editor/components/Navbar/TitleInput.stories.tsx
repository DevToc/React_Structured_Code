import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TitleInput } from './TitleInput';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar/Title Input',
  component: TitleInput,
} as ComponentMeta<typeof TitleInput>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof TitleInput> = (args) => <TitleInput {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: 'My Document Title',
  onSubmit: () => {},
};

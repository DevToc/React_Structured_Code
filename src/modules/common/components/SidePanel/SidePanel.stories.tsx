import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SidePanel } from './SidePanel';
import { SidePanelHeader } from './SidePanelHeader';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/SidePanel',
  component: SidePanel,
} as ComponentMeta<typeof SidePanel>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SidePanel> = (args) => (
  <SidePanel {...args}>
    <SidePanelHeader title={args.title} />
  </SidePanel>
);

export const Primary = Template.bind({});

Primary.args = {
  isOpen: true,
  placement: 'left',
  title: 'My Side Panel Title',
};

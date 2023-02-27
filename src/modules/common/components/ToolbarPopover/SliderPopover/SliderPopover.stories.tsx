import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Flex } from '@chakra-ui/react';

import { SliderPopover } from './SliderPopover';
import { ReactComponent as BorderStyleIcon } from '../../../../../assets/icons/border_style.svg';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/ToolbarPopover/SliderPopover',
  component: SliderPopover,
} as ComponentMeta<typeof SliderPopover>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SliderPopover> = (args) => (
  <Flex ml='8px' gap='8px' align='center' mr='8px'>
    <SliderPopover {...args} />
  </Flex>
);

export const Primary = Template.bind({});

Primary.args = {
  value: 50,
  icon: <BorderStyleIcon />,
  label: 'Border Width',
  onChange: () => {},
  suffix: 'px',
  min: 0,
  max: 100,
  title: 'Width',
};

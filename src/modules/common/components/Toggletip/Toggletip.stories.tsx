import { Flex } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Toggletip } from './Toggletip';
import { ReactComponent as SolidInfoIcon } from '../../../../assets/icons/filled_info.svg';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Toggletip',
  component: Toggletip,
  argTypes: {
    placement: {
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Toggletip>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Toggletip> = (args) => (
  <Flex justifyContent={'center'} mt={50}>
    <Toggletip {...args} />
  </Flex>
);

export const Primary = Template.bind({});

Primary.args = {
  label: 'This is my toggletip.',
  icon: <SolidInfoIcon />,
  placement: 'bottom',
  buttonAriaLabel: 'My toggletip',
  hasArrow: true,
};

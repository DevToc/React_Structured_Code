import { Box } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CollapsibleBox } from './CollapsibleBox';
import { ReactComponent as SolidInfoIcon } from '../../../../assets/icons/filled_info.svg';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/CollapsibleBox',
  component: CollapsibleBox,
} as ComponentMeta<typeof CollapsibleBox>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof CollapsibleBox> = (args) => (
  <Box w={500}>
    <CollapsibleBox {...args} />
  </Box>
);

export const Primary = Template.bind({});

Primary.args = {
  title: 'I am a collapsible box.',
  collapseAriaLabel: 'Toggle collapsible box',
  children: <p>I am a child</p>,
  titleIcon: <SolidInfoIcon />,
};

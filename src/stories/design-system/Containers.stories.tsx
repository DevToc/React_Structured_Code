import { Box, Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const AllContainers = (args: any) => (
  <Box>
    <Text>All containers</Text>
  </Box>
);

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Color',
  component: AllContainers,
} as ComponentMeta<typeof AllContainers>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof AllContainers> = (args) => <AllContainers {...args} />;

export const Primary = Template.bind({});

Primary.args = {};

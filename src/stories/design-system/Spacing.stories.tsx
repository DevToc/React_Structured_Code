import { Box, Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const AllSpacings = (args: any) => (
  <Box>
    <Text>All spacings</Text>
  </Box>
);

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Spacing',
  component: AllSpacings,
} as ComponentMeta<typeof AllSpacings>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof AllSpacings> = (args) => <AllSpacings {...args} />;

export const Primary = Template.bind({});

Primary.args = {};

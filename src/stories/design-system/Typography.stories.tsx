import { Box, Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const AllTypography = (args: any) => (
  <Box>
    <Text>All fonts</Text>
  </Box>
);

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Typography',
  component: AllTypography,
} as ComponentMeta<typeof AllTypography>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof AllTypography> = (args) => <AllTypography {...args} />;

export const Primary = Template.bind({});

Primary.args = {};

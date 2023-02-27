import { Box, Text } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const AllEffects = (args: any) => (
  <Box>
    <Text>All effects</Text>
  </Box>
);

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Effects',
  component: AllEffects,
} as ComponentMeta<typeof AllEffects>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof AllEffects> = (args) => <AllEffects {...args} />;

export const Primary = Template.bind({});

Primary.args = {};

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AutosaveIndicator } from './AutosaveIndicator';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar/AutosaveIndicator',
  component: AutosaveIndicator,
} as ComponentMeta<typeof AutosaveIndicator>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof AutosaveIndicator> = (args) => <AutosaveIndicator />;

export const Primary = Template.bind({});

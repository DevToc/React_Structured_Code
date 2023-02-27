import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Provider } from 'react-redux';

import { Navbar } from './Navbar';

import { store } from '../../store';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Common/Navbar',
  component: Navbar,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} as ComponentMeta<typeof Navbar>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Navbar> = (args) => <Navbar />;

export const Primary = Template.bind({});

Primary.args = {};

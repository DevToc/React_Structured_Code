import { theme } from '../src/theme';
import i18n from '../src/i18n-test.ts';

export const parameters = {
  chakra: {
    theme,
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Introduction', 'Components', ['Common', ['Navbar', 'Page', 'Color Picker']]],
    },
  },
  // i18n
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
    es: 'Spanish',
    fr: 'Français',
  },
};

import { resources, defaultNS } from '../i18n';

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    // custom namespace type
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}

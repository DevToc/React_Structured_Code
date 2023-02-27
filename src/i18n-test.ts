/**
 * For testing, backend plugin is not working for test
 */

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import resources from './i18n-resources';

// Default nampespace
export const defaultNS = 'app';
export { resources };

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  // We don't load translations externally yet
  //.use(Backend)

  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)

  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    ns: [defaultNS],
    defaultNS,
    resources,

    // Language detection order
    detection: {
      order: ['queryString', 'cookie', 'navigator'],
    },
    lng: navigator.language || 'en', // Use navigator as default language for now
    fallbackLng: 'en',
    debug: false, // will turn off in production, process.env.NODE_ENV !== 'production'

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;

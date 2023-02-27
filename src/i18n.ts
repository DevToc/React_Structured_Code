import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
// import HttpBackend from 'i18next-http-backend'
import resourcesToBackend from 'i18next-resources-to-backend';
import resources from './i18n-resources';

// Default nampespace
export const defaultNS = 'app';
export { resources };

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  // We don't load translations externally yet
  .use(ChainedBackend)

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

    // Backend options
    backend: {
      backends: [
        // HttpBackend, // if a namespace can't be loaded via normal http-backend loadPath, then the inMemoryLocalBackend will try to return the correct resources
        resourcesToBackend(resources),
      ],
      backendOptions: [
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      ],
    },
  });

export default i18n;

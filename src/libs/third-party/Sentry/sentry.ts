import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { isProduction } from '../../../utils/environment';

export const initSentry = () => {
  if (!isProduction) return;

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    // TODO: connect with github
    release: '1',
  });
};

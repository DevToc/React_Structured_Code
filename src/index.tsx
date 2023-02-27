import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { initSentry } from './libs/third-party/Sentry';

initSentry();

const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

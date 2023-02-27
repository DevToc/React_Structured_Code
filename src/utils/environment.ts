export const isProduction = process.env.NODE_ENV === 'production' || process.env.REACT_APP_VERCEL_ENV === 'production';

export const isPreProduction = process.env.NODE_ENV === 'production' || process.env.REACT_APP_VERCEL_ENV === 'preview';

export const isPreview = process.env.REACT_APP_VERCEL_ENV === 'preview';

export const isTest = process.env.NODE_ENV === 'test';

export const isDevelopment = !isPreProduction && !isTest;

// Temporary solution to check for real prod environment
// TODO update environment constants since we're no longer using Vercel
export const isRealProduction = window.location.hostname === 'infograph.venngage.com';

export const INFOGRAPH_URL = 'https://infograph.venngage.com';

// [Local only] This is e2 api endpoint that only needs for frontend works in local env
export const API_DOMAIN = process.env.REACT_APP_INFOGRAPH_API_DOMAIN;

/*
  This is temporary variable to differentiate the call between e1 php backend and e2 api.
  Once all the settings for integration has finished, it will no longer be needed.
*/
export const PHP_PROXY_API_DOMAIN = process.env.REACT_APP_PHP_PROXY_API_DOMAIN;

export const isBrowser = {
  SAFARI: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  FIREFOX: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
};

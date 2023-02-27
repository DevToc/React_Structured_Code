const macOsNavigatorRegex = /(Mac|iPad)/i;
export const isMacOs = (): boolean => macOsNavigatorRegex.test(navigator.platform);

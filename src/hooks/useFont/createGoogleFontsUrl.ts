export const GOOGLE_API_ENDPOINT = 'https://fonts.googleapis.com/css2';

const createQueryString = (family: string) => {
  const normalizeFamily = family.replace(/ +/g, '+');
  // This can be pass as options later on
  const styles = ['0,400', '0,700', '1,400', '1,700'];
  return `family=${normalizeFamily}:ital,wght@${styles.join(';')}`;
};

export const createGoogleFontsUrl = (families: string[], display = 'swap') =>
  `${GOOGLE_API_ENDPOINT}?${families.map((family) => createQueryString(family)).join('&')}&display=${display}`;

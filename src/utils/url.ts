/**
 * Return true iff url is valid url with protocol
 *
 * @param url - A url
 * @returns
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // loosy url check
    new URL(url);
    return url.indexOf('.') > 0;
  } catch (_) {
    // safe to ignore
  }
  return false;
};

/**
 * Return a full url with protocol
 *
 * @param url - A url with or without protocol
 * @returns
 */
export const withProtocol = (url: string): string =>
  url.match(/^https?:\/\/|^mailto:|^tel:|^page:/) ? url : `http://${url}`;

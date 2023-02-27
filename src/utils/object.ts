/**
 * Check whether giving value is an object or not
 *
 * @param value - An unknown value
 * @returns true if value is an object
 */
export const isObject = (value: any): boolean => {
  return !!(value && typeof value === 'object' && !Array.isArray(value));
};

/**
 * Check whether giving value is an array or not
 *
 * @param value - An unknown value
 * @returns true if value is an array
 */
export const isArray = (value: any): boolean => Array.isArray(value);

/**
 * Check whether giving value is a primitive string or number
 *
 * @param value - An unknown value
 * @returns true if value is a string or number
 */
export const isPrimitive = (value: any) => ['string', 'number'].some((type) => type === typeof value);

import { isObject, isArray, isPrimitive } from './object';

/**
 * Find all property value recursively by giving property key
 *
 * @param object - A object literal
 * @param keys - A list of string keys to match
 * @param result - A result reference
 */
const findKeyValues = (object = {}, keys: string[] = [], result = new Set<string | number>()) => {
  switch (true) {
    case isObject(object):
      Object.entries(object).forEach(([k, v]) => {
        if (keys.includes(k) && isPrimitive(v)) {
          result.add(String(v));
        } else {
          findKeyValues(v as any, keys, result);
        }
      });
      break;
    case isArray(object):
      (object as Array<any>).forEach((value) => findKeyValues(value, keys, result));
      break;
    default:
      break;
  }
};

/**
 * Find all property values recursively by giving key
 *
 * @param object - A literal object
 * @param keys  - Object keys
 * @returns  An array of found values
 */
export const findAllPropertyValues = (object = {}, keys: string[] = []): Array<string | number> => {
  let values = new Set<string | number>();
  findKeyValues(object, keys, values);

  return Array.from(values);
};

/**
 * Utility functions related to number type.
 */

type NumberType = number | string;
type DefaultNumberType = number;

const isZero = (value: number): boolean => value === 0;

const isNegativeZero = (value: number): boolean => -1 / value === Infinity;

/**
 * This function parse the value to the number.
 * Typescript number allows to store the NaN, Infinity etc. so this function validates given value and returns the number.
 * When an error occurs, if defaultNumber exists, defaultNumber is returned, and vice versa, thorw the error.
 *
 * @param num
 * @param defaultNumber
 * @returns {number}
 */
const validateNumber = <T>(num: T, defaultNumber?: DefaultNumberType): number => {
  try {
    let parsedValue: number = Number(num);

    // [Empty string]
    if (typeof num === 'string' && !num.length) throw new Error(`Invalid number: value is the empty string`);

    // [String with the suffix]
    // If parsedValue is a string and Number.isNaN returns NaN, use the parseFloat.
    // e.g.) 10px => 10, 10deg => 10
    if (Number.isNaN(parsedValue) && typeof num === 'string') {
      parsedValue = parseFloat(num);
    }

    // [NaN]
    if (Number.isNaN(parsedValue)) throw new Error(`Invalid number: number is NaN`);

    // [Infinity, -Infinity]
    if (!Number.isFinite(parsedValue)) throw new Error(`Invalid number: number is Infinity`);

    // [Negative zero]
    // There is a problem where -0 is not same with the 0 in the test unit's expect().
    // So if the value is the NegativeZero, change to 0.
    if (isZero(parsedValue) && isNegativeZero(parsedValue)) {
      parsedValue = 0;
    }

    return parsedValue;
  } catch (error: unknown) {
    if (error instanceof Error && typeof defaultNumber === 'number' && !Number.isNaN(validateNumber(defaultNumber))) {
      console.warn(error.message, ` => replaced to the default number: ${defaultNumber}`);
      return defaultNumber;
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }

  throw new Error(`Invalid number: ${num}`);
};

/**
 * Parse the given value strictly as a number.
 * 'Strictly' means parsing values ​​or throwing errors without affecting data saving for the number type.
 * It solves the following problems that exist in JavaScript number and string types.
 *
 * 1) number and defaultNumber cannot be a null, NaN, Infinity, -Infinity or empty string.
 *    - Number(null) => 0
 *    - parseInt(null) => 0
 *    - typeof NaN === 'number'
 *    - typeof Infinity === 'number'
 *    - typeof -Infinity === 'number'
 * 2) Neagtive zero will be parsed to the 0.
 *    - expect(0).toBe(-1) // error
 *    - expect(0).toBe(0)  // passed
 *    - expect(0).toBe(+0) // passed
 * 3) Not allow to use the Array, object, etc. only string|number allowed.
 *    - Number([123]) => 123
 *    - parseFloat(['10incorrecttext'] + 1) => 10
 *    - parseFloat(['10', '50'] + 1) => 101
 *
 * @param number string | number | null
 * @returns {number}
 */
export const parseStrictNumber = (number: NumberType): number => validateNumber<NumberType>(number);

/**
 * A helper function to return a number between min and max
 * @param {number} min      The minimum number
 * @param {number} max      The maximum number
 * @param {number} value    The number needs to be adjust
 */
export const normalizeNumber = (min: number, max: number, value: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

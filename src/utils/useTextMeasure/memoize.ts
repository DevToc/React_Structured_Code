import { GenericFunction } from 'utils/useTextMeasure/types';

const MAX_CACHE_SIZE = 1000;
const GARBAGE_COLLECT_COUNT = 50;

const isFunction = (func?: Function) => typeof func === 'function';

/**
 * Memoizes the result of heavy computation `function`, cache result based on the
 * arguments provided to the key resolver function. If key resolver function not provide,
 * it will use first argument of memorize function as key
 *
 * @param {Function} func
 * @param {Function} keyResolver
 * @returns {Function}
 */
export default function memoize<T extends GenericFunction, S extends GenericFunction>(func: T, keyResolver: S) {
  if (!isFunction(func) || !isFunction(keyResolver)) {
    throw new TypeError('Expected function argument');
  }

  const cache = new Map();

  return function memoizeFunction(...args: Parameters<T>): ReturnType<T> {
    const key = keyResolver ? keyResolver.apply(undefined, args) : args[0];

    if (cache.has(key)) return cache.get(key);

    const result = func.apply(undefined, args);

    // Simple garbage collect in FIFO
    // Note: This does not take frequent hit into account
    if (cache.size > MAX_CACHE_SIZE) {
      Array.from(cache.keys()).slice(0, GARBAGE_COLLECT_COUNT).forEach(cache.delete);
    }

    // Cache result
    cache.set(key, result);

    return result;
  };
}

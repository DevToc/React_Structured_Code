import { useEffect, useRef } from 'react';

/**
 * Hook that stores the state previous value
 */
export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

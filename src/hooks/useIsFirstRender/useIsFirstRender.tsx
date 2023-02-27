import { useRef } from 'react';

/**
 * Simple hook that return a boolean:
 * True at the mount time -> Then always false
 * See: https://usehooks-ts.com/react-hook/use-is-first-render
 */
export const useIsFirstRender = (): boolean => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};

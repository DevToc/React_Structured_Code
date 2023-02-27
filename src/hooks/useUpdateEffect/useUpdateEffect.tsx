import { DependencyList, EffectCallback, useEffect } from 'react';
import { useIsFirstRender } from '../useIsFirstRender';

/**
 * Modified version of useEffect that skips the first render
 * and runs every time the dependency updates after that
 * see: https://usehooks-ts.com/react-hook/use-update-effect
 */
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isFirst = useIsFirstRender();

  useEffect(() => {
    if (!isFirst) return effect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

import { renderHook } from '@testing-library/react';
import { useIsFirstRender } from '../useIsFirstRender';

describe('hooks/useIsFirstRender', () => {
  it('should return false after first render', () => {
    const { result, rerender } = renderHook(() => useIsFirstRender());
    expect(result.current).toBe(true);

    rerender();

    expect(result.current).toBe(false);
  });
});

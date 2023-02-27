import { act } from 'react-dom/test-utils';
import { fireEvent, renderHook } from '@testing-library/react';
import { useWindowSize } from '../useWindowSize';

const windowResize = ({ width, height }: { width?: number; height?: number }): void => {
  window.innerWidth = width ?? window.innerWidth;
  window.innerHeight = height ?? window.innerHeight;
  fireEvent(window, new Event('resize'));
};

describe('hook/useWindowSize', () => {
  const DEFAULT_WIDTH = 200;
  const DEFAULT_HEIGHT = 300;

  beforeEach(() => {
    // Setup initial window size
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: DEFAULT_WIDTH });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: DEFAULT_HEIGHT });

    window.addEventListener('resize', jest.fn());
  });

  it('should return the default window dimension', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(DEFAULT_WIDTH);
    expect(result.current.height).toBe(DEFAULT_HEIGHT);
  });

  it('should return the corresponding dimension after resize', () => {
    const { result } = renderHook(() => useWindowSize());
    const newDimension = { width: DEFAULT_WIDTH + 100, height: DEFAULT_HEIGHT + 100 };

    act(() => {
      windowResize(newDimension);
    });

    expect(result.current.width).toBe(newDimension.width);
    expect(result.current.height).toBe(newDimension.height);
  });
});

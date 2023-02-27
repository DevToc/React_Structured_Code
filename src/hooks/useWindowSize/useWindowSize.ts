import { useState } from 'react';
import { useEventListener } from '../useEventListener';

interface WindowSize {
  width: number;
  height: number;
  deviceWidth: number;
  deviceHeight: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    deviceWidth: window.outerWidth,
    deviceHeight: window.outerHeight,
  });

  const handleResize = () =>
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      deviceWidth: window.outerWidth,
      deviceHeight: window.outerHeight,
    });

  useEventListener('resize', handleResize);
  return windowSize;
};

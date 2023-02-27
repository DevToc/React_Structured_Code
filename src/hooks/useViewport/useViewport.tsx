import { useContext } from 'react';
import { ViewportContext } from 'context';

export const useViewport = () => {
  const { isMobile, viewportHeight, tabContentHeight, isLandscape } = useContext(ViewportContext);

  return { isMobile, viewportHeight, tabContentHeight, isLandscape };
};

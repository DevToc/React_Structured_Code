import { createContext, useCallback, useEffect, useState } from 'react';
import { isMobile, useDevice } from 'use-ua-parser-js';
import { use100vh } from 'react-div-100vh';

import { useDebouncedCallback } from 'hooks/useDebounce';
import { useEventListener } from 'hooks/useEventListener';
import { useWindowSize } from 'hooks/useWindowSize';

import { NAVBAR_HEIGHT, NAVBAR_HEIGHT_MOBILE } from 'modules/Editor/components/Navbar';
import { TOOLBAR_HEIGHT } from 'modules/Editor/components/Toolbar';
import { TABLIST_HEADER_HEIGHT } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.config';
import { SIDEBAR_HEIGHT_MOBILE } from 'modules/Editor/components/WidgetMenu/WidgetMenu.config';

import { DEFAULT_RESIZE_EVENT_DEBOUNCE } from './ViewportProvider.constants';
import { IViewPortContextProps, TViewPortStates } from './ViewportProvider.types';

export const ViewportContext = createContext<TViewPortStates>({
  viewportHeight: '',
  tabContentHeight: '',
  isMobile: false,
  isLandscape: false,
});

export const ViewportProvider = ({ children }: IViewPortContextProps) => {
  const device = useDevice();
  const height = use100vh();
  const { deviceWidth, deviceHeight } = useWindowSize();
  const screenTabTopOffset = NAVBAR_HEIGHT + TOOLBAR_HEIGHT + TABLIST_HEADER_HEIGHT;
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [viewportHeight, setViewportHeight] = useState<string>(`calc(100vh - ${NAVBAR_HEIGHT}px)`);
  const [tabContentHeight, setTabContentHeight] = useState<string>(`calc(100vh - ${screenTabTopOffset}px)`);
  // Need to check if height is not null if we're doing SSR
  const screenHeight = height ? height + 'px' : '100vh';

  const handleResize = useCallback(() => {
    if (isMobile(device)) {
      if (deviceWidth <= deviceHeight) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    }
  }, [device, deviceWidth, deviceHeight]);

  const debouncedResize = useDebouncedCallback(handleResize, DEFAULT_RESIZE_EVENT_DEBOUNCE);
  useEventListener('resize', debouncedResize);

  useEffect(() => {
    if (isMobile(device)) {
      setViewportHeight(`calc(${screenHeight} - ${NAVBAR_HEIGHT_MOBILE}px - ${SIDEBAR_HEIGHT_MOBILE}px)`);
      setTabContentHeight(`calc(${screenHeight} - ${NAVBAR_HEIGHT_MOBILE}px - ${screenTabTopOffset}px - 8px)`);
    }
  }, [device, screenHeight, screenTabTopOffset, isLandscape]);

  return (
    <ViewportContext.Provider value={{ viewportHeight, tabContentHeight, isMobile: isMobile(device), isLandscape }}>
      {children}
    </ViewportContext.Provider>
  );
};

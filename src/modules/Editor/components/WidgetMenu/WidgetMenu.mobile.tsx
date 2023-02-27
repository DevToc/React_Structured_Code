import { ReactElement, useRef, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';

import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { usePrevious } from 'hooks/usePrevious';
import { SidebarMobile } from './Sidebar';
import { SideMenuMobile } from './SideMenu';

import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { SIDEBAR_HEIGHT_MOBILE } from './WidgetMenu.config';
import { useBoundingBox } from '../BoundingBox/useBoundingBox';
import { useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';

const focusSidebarItem = (menuItem: WIDGET_MENU_OPTIONS) => {
  const sidebarItemEl = document.getElementById(menuItem);
  if (sidebarItemEl) sidebarItemEl.focus();
};

export const WidgetMenuMobile = (): ReactElement => {
  const activeWidgetMenu = useAppSelector(selectActiveWidgetMenu);
  const previousActiveMenu = usePrevious(activeWidgetMenu);
  const widgetMenuRef = useRef<HTMLDivElement | null>(null);
  const { boundingBox } = useBoundingBox();

  // set focus back to previously active sidebar item when closed
  useUpdateEffect(() => {
    if (!activeWidgetMenu && previousActiveMenu) return focusSidebarItem(previousActiveMenu);
  }, [activeWidgetMenu]);

  /**
   * If menu was opened or closed, update the bounding box
   */
  useEffect(() => {
    if (
      (activeWidgetMenu === WIDGET_MENU_OPTIONS.NONE && previousActiveMenu !== WIDGET_MENU_OPTIONS.NONE) ||
      (activeWidgetMenu !== WIDGET_MENU_OPTIONS.NONE && previousActiveMenu === WIDGET_MENU_OPTIONS.NONE)
    ) {
      boundingBox.updateRect();
    }
  }, [previousActiveMenu, activeWidgetMenu, boundingBox]);

  return (
    <Flex
      ref={widgetMenuRef}
      backgroundColor='white'
      position='absolute'
      bottom={`-${SIDEBAR_HEIGHT_MOBILE}px`}
      height={`${SIDEBAR_HEIGHT_MOBILE}px`}
      width='100%'
    >
      <SidebarMobile />
      <SideMenuMobile />
    </Flex>
  );
};
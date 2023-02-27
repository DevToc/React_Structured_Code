import { ReactElement, useRef, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';

import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { usePrevious } from 'hooks/usePrevious';
import { useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';

import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { Sidebar } from './Sidebar';
import { SideMenu } from './SideMenu';
import { useBoundingBox } from '../BoundingBox/useBoundingBox';

const focusSidebarItem = (menuItem: WIDGET_MENU_OPTIONS) => {
  const sidebarItemEl = document.getElementById(menuItem);
  if (sidebarItemEl) sidebarItemEl.focus();
};

export const WidgetMenu = (): ReactElement => {
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
    <Flex ref={widgetMenuRef}>
      <Sidebar />
      <SideMenu />
    </Flex>
  );
};
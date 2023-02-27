import { ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { Flex, useBoolean } from '@chakra-ui/react';

import { useResizeObserver } from 'hooks/useResizeObserver';

import { useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgets, selectActiveWidgetType } from 'modules/Editor/store/widgetSelector';
import { EDITOR_TOOLBAR_ID } from 'modules/Editor/Editor.config';
import { selectIsAccessibilityView, selectIsWidgetSettingsView } from 'modules/Editor/store/selectEditorSettings';

import { useFocus } from '../Focus';
import { ACCESSIBILITY_MENU_WIDTH } from '../AccessibilityManager/AccessibilityManager.config';

import { SelectedWidgetToolbar } from './SelectedWidgetToolbar';
import PageMenu from './PageMenu';
import { TOOLBAR_HEIGHT, WIDGET_ACTION_MENU_WIDTH_THRESHOLD } from './Toolbar.config';
import { WidgetActionMenu } from './WidgetActionMenu/WidgetActionMenu';
import { selectIsWidgetMenuActive } from 'modules/Editor/store/editorSettingsSelector';
import { SIDEBAR_WIDTH, SIDEMENU_WIDTH } from '../WidgetMenu/WidgetMenu.config';
import { useWindowSize } from 'hooks/useWindowSize';

export const Toolbar = (): ReactElement => {
  const [isOverflow, setIsOverflow] = useBoolean(false);
  const windowSize = useWindowSize();
  const selectedWidgetToolbarRef = useRef<HTMLDivElement>(null);
  const generalWidgetToolbarRef = useRef<HTMLDivElement>(null);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const activeWidgetType = useAppSelector(selectActiveWidgetType);

  const isAccessibilityViewOpen = useAppSelector(selectIsAccessibilityView);
  const isWidgetSideMenuOpen = useAppSelector(selectIsWidgetSettingsView);
  const isLeftPanelOpen = useAppSelector(selectIsWidgetMenuActive);

  const { widgetToolbarRef } = useFocus();
  const hasActiveWidget = activeWidgets.length === 1;

  // Sum of the widths of the open side menus - used to calculate the allotted toolbar width
  const widgetSideMenuWidth = isWidgetSideMenuOpen ? ACCESSIBILITY_MENU_WIDTH : 0;
  const leftPanelWidth = isLeftPanelOpen ? SIDEMENU_WIDTH + SIDEBAR_WIDTH : SIDEBAR_WIDTH;
  const accessibilityMenuWidth = isAccessibilityViewOpen ? ACCESSIBILITY_MENU_WIDTH : 0;
  const sidemenuWidths = useMemo(
    () => widgetSideMenuWidth + leftPanelWidth + accessibilityMenuWidth,
    [accessibilityMenuWidth, leftPanelWidth, widgetSideMenuWidth],
  );

  /**
   * Method to determine if the toolbar will overflow the allotted width.
   * Sets `isOverflow` flag accordingly.
   */
  const detectToolbarOverflow = useCallback(() => {
    const totalToolbarWidth =
      (selectedWidgetToolbarRef?.current?.clientWidth || 0) + WIDGET_ACTION_MENU_WIDTH_THRESHOLD;
    const toolbarClientWidth = widgetToolbarRef?.current?.clientWidth || 0;

    // Toolbar overflows
    // - check if the total width with all items rendered is greater than the allotted width
    if (totalToolbarWidth > toolbarClientWidth) {
      setIsOverflow.on();
    } else {
      setIsOverflow.off();
    }
  }, [setIsOverflow, widgetToolbarRef]);

  // Triggered when the active widget toolbar changes width - recalculates toolbar overflow
  // (i.e. select a different widget, deselect a widget, etc.)
  const onResizeActiveWidgetToolbar = useCallback(() => {
    const isAlreadyOverflow = getComputedStyle(selectedWidgetToolbarRef.current!)?.overflowX === 'auto';

    // Prevent infinite overflow detection if it was already computed (i.e. overflow was already set to 'auto')
    if (!isAlreadyOverflow) {
      detectToolbarOverflow();
    }
  }, [detectToolbarOverflow]);

  // Trigger overflow detection when the open side menu width, window size, or widget selection type changes
  useEffect(() => {
    detectToolbarOverflow();
  }, [sidemenuWidths, setIsOverflow, windowSize, activeWidgetType, detectToolbarOverflow]);

  // Observe active widget toolbar width
  useResizeObserver({ ref: selectedWidgetToolbarRef, onResize: onResizeActiveWidgetToolbar });

  return (
    <Flex
      id={EDITOR_TOOLBAR_ID}
      data-testid={EDITOR_TOOLBAR_ID}
      ref={widgetToolbarRef}
      minH={`${TOOLBAR_HEIGHT}px`}
      overflow={'hidden'}
      h={'fit-content'}
      w={`calc(100vw - ${sidemenuWidths}px)`}
      pt={2}
      px={4}
      alignItems={'flex-start'}
      zIndex='toolbar'
      justifyContent={isOverflow ? 'flex-start' : 'space-between'}
    >
      <Flex
        overflowX={isOverflow ? 'auto' : 'visible'}
        w={'fit-content'}
        ref={selectedWidgetToolbarRef}
        alignItems='center'
      >
        {hasActiveWidget ? <SelectedWidgetToolbar /> : <DefaultToolbar />}
      </Flex>
      <WidgetActionMenu useDropdown={isOverflow} ref={generalWidgetToolbarRef} />
    </Flex>
  );
};

Toolbar.displayName = 'Toolbar';

const DefaultToolbar = (): ReactElement => {
  return (
    <Flex gap={2}>
      <PageMenu />
    </Flex>
  );
};

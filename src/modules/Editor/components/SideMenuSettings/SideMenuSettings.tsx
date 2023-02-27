import { ReactElement, useEffect } from 'react';

import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { SidePanel } from 'modules/common/components/SidePanel';
import { useAppDispatch, useAppSelector } from '../../store';
import { setChartSettingsTabIndex, setWidgetSettingsView } from '../../store/editorSettingsSlice';
import { selectIsWidgetSettingsView } from '../../store/selectEditorSettings';
import { selectActiveWidgets } from '../../store/widgetSelector';
import { useFocus } from '../Focus';
import { SIDE_MENU_WIDGET_TYPES } from './SideMenuSettings.config';

/**
 * SIDE MENU SETTINGS WRAPPER COMPONENT
 *
 * Renders wrapper for widget side menu and the div used
 * for Chakra portal.
 */
export const SideMenuSettings = (): ReactElement | null => {
  const { widgetSideMenuSettingsPortalRef } = useFocus();

  const isWidgetSettingsView = useAppSelector(selectIsWidgetSettingsView);
  const activeWidgets = useAppSelector(selectActiveWidgets);

  const hasActiveWidget = activeWidgets.length === 1;
  const activeWidgetType = hasActiveWidget && getWidgetTypeFromId(activeWidgets[0].id);
  const isOpen = isWidgetSettingsView && hasActiveWidget;

  const dispatch = useAppDispatch();

  // Close settings view if non-chart widget is selected
  useEffect(() => {
    if (!hasActiveWidget || (activeWidgetType && !SIDE_MENU_WIDGET_TYPES.includes(activeWidgetType))) {
      dispatch(setChartSettingsTabIndex({ tabIndex: 0 }));
      dispatch(setWidgetSettingsView(false));
    }
  }, [hasActiveWidget, activeWidgetType, dispatch]);

  return (
    <SidePanel isOpen={isOpen} placement={'right'} testId={'widget-sidemenu-settings'} w={'sm'}>
      <div ref={widgetSideMenuSettingsPortalRef} />
    </SidePanel>
  );
};

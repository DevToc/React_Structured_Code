import { Portal } from '@chakra-ui/react';
import { ReactElement } from 'react';

import { useFocus } from 'modules/Editor/components/Focus';
import { useAppSelector } from 'modules/Editor/store';
import { selectIsWidgetSettingsView } from 'modules/Editor/store/selectEditorSettings';
import { selectIsActiveWidget } from 'modules/Editor/store/widgetSelector';
import { SideMenuSettingProvider } from './SideMenuSettingContext';
import { useWidget } from './useWidget';

interface WidgetSideMenuSettingsProps {
  children: React.ReactNode;
}

/**
 * WIDGET SIDE MENU SETTINGS COMPONENT
 *
 * Wrapper for right side panel settings.
 * Uses a portal to render the the side menu
 *
 */
export const WidgetSideMenuSettings = ({ children }: WidgetSideMenuSettingsProps): ReactElement | null => {
  const { widgetSideMenuSettingsPortalRef } = useFocus();
  const { widgetId } = useWidget();
  const isWidgetSelected = useAppSelector(selectIsActiveWidget(widgetId));
  const isWidgetSettingsView = useAppSelector(selectIsWidgetSettingsView);

  if (!isWidgetSelected || !isWidgetSettingsView) return null;

  return (
    <Portal containerRef={widgetSideMenuSettingsPortalRef as React.RefObject<HTMLElement | null> | undefined}>
      <SideMenuSettingProvider>{children}</SideMenuSettingProvider>
    </Portal>
  );
};

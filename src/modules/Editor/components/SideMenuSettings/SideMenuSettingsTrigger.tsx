import { Button } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useAppDispatch } from '../../store';
import { setWidgetSettingsView } from '../../store/editorSettingsSlice';

/**
 * SIDE MENU SETTINGS TRIGGER COMPONENT
 *
 * Renders a button that will trigger the right side menu settings to open for the
 * current active widget.
 */
interface SideMenuSettingsTriggerProps {
  children: ReactNode;
}

export const SideMenuSettingsTrigger = ({ children }: SideMenuSettingsTriggerProps) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(setWidgetSettingsView(true));
  };

  return (
    <Button
      size='sm'
      onClick={onClick}
      fontWeight='semibold'
      variant='ghost'
      data-testid={'widget-sidemenu-settings-trigger'}
      zIndex='var(--vg-zIndices-sideMenuSettings)'
    >
      {children}
    </Button>
  );
};

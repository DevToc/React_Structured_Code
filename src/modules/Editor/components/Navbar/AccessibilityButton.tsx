import { ReactElement } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { useAppDispatch } from 'modules/Editor/store';
import { setAccessibilityViewIndex } from 'modules/Editor/store/editorSettingsSlice';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';
import { ACCESSIBILITY_CHECKER_OPENED, NAV_BAR } from 'constants/mixpanel';

export const AccessibilityButton = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common_navbar');

  const onClick = () => {
    dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.CHECK));

    Mixpanel.track(ACCESSIBILITY_CHECKER_OPENED, {
      from: NAV_BAR,
    });
  };

  return (
    <Box>
      <Button
        size='sm'
        variant='ghost'
        color='font.500'
        data-testid='navbar-accessibility-button'
        aria-label='Open Accessibility Menu'
        onClick={onClick}
      >
        {t('navbar.accessibility-button')}
      </Button>
    </Box>
  );
};

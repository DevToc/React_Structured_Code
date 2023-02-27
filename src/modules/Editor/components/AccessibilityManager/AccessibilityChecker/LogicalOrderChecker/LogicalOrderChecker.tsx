import { ReactElement } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  CheckContainer,
  CheckItemHeader,
  CheckItemHeaderLabel,
  CheckItemPanel,
  CheckDescriptionText,
  MarkResolved,
  StatusIconButton,
  HelpLink,
} from '../common';
import { READING_ORDER_HELP_LINK } from '../../../../../../constants/links';
import {
  AccessibilityCheckers,
  AccessibilityCheckerStatus,
  AccessibilityMenuTabIndex,
} from '../../AccessibilityManager.types';
import { markChecker } from '../checker.actions';
import { useAccessibilityChecker } from '../checker.hooks';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';
import { useMenuTabControl } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/common/hooks/useMenuTabControl';

const LogicalOrderChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.logicalReadingOrder',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { setTabIndex } = useMenuTabControl();
  const { isMarkAsResolved } = state.checkers[AccessibilityCheckers.logicalReadingOrder];
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.logicalReadingOrder));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.logicalReadingOrder],
      });
    }
  };
  const handleEditScreenOrder = () => setTabIndex(AccessibilityMenuTabIndex.readingOrder);

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.logicalReadingOrder],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document logical order button'
          status={isMarkAsResolved ? AccessibilityCheckerStatus.reviewed : AccessibilityCheckerStatus.warn}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='3'>
          <Flex direction='column' gap='2'>
            <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
            <CheckDescriptionText>{t('desc2')}</CheckDescriptionText>
            <HelpLink href={READING_ORDER_HELP_LINK} onClick={handleClickHelpLink}>
              {t('learnMore')}
            </HelpLink>
          </Flex>
          <Box>
            <Button
              border='1px solid var(--vg-colors-gray-200)'
              p='0.75rem 1rem'
              h='24px'
              lineHeight='none'
              color='font.500'
              fontSize='xs'
              fontWeight='medium'
              variant='ghost'
              onClick={handleEditScreenOrder}
            >
              {t('button')}
            </Button>
          </Box>
          <Box>
            <MarkResolved isChecked={isMarkAsResolved} onChange={handleMarkResolved}>
              {t('resolvedCheck')}
            </MarkResolved>
          </Box>
        </Flex>
      </CheckItemPanel>
    </CheckContainer>
  );
};

export { LogicalOrderChecker };

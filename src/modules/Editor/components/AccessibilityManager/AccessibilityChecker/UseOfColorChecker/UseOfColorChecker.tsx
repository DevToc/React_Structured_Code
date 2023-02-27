import { ReactElement, useMemo } from 'react';
import { Box, Flex, UnorderedList, ListItem } from '@chakra-ui/react';
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
import { USE_OF_COLOR_HELP_LINK } from '../../../../../../constants/links';
import { AccessibilityCheckers, AccessibilityCheckerStatus } from '../../AccessibilityManager.types';
import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker } from '../checker.actions';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';

const UseOfColorChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.useOfColor',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved } = state.checkers[AccessibilityCheckers.useOfColor];
  const tipList = useMemo(() => [t('tip1'), t('tip2'), t('tip3'), t('tip4')], [t]);
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.useOfColor));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.useOfColor],
      });
    }
  };

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.useOfColor],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document use of color button'
          status={isMarkAsResolved ? AccessibilityCheckerStatus.reviewed : AccessibilityCheckerStatus.warn}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <Flex direction='column' gap='2'>
            <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
            <CheckDescriptionText>{t('makeSure')}</CheckDescriptionText>
            <UnorderedList pl='6'>
              {tipList.map((tip, i) => (
                <ListItem key={i}>
                  <CheckDescriptionText>{tip}</CheckDescriptionText>
                </ListItem>
              ))}
            </UnorderedList>
            <CheckDescriptionText>{t('desc2')}</CheckDescriptionText>
            <HelpLink href={USE_OF_COLOR_HELP_LINK} onClick={handleClickHelpLink}>
              {t('learnMore')}
            </HelpLink>
          </Flex>
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

export { UseOfColorChecker };

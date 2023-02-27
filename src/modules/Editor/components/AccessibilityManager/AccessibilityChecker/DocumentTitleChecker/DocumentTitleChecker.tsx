import { ReactElement } from 'react';
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
import { DOCUMENT_TITLE_HELP_LINK } from '../../../../../../constants/links';
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

const DocumentTitleChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.documentTitle',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved } = state.checkers[AccessibilityCheckers.documentTitle];
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.documentTitle));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.documentTitle],
      });
    }
  };

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.documentTitle],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document title button'
          status={isMarkAsResolved ? AccessibilityCheckerStatus.reviewed : AccessibilityCheckerStatus.warn}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <Flex direction='column' gap='2'>
            <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
            <CheckDescriptionText>{t('desc2')}</CheckDescriptionText>
            <CheckDescriptionText>{t('makeSure')}</CheckDescriptionText>
            <UnorderedList pl='6'>
              <ListItem>
                <CheckDescriptionText>{t('tip1')}</CheckDescriptionText>
              </ListItem>
              <ListItem>
                <CheckDescriptionText>{t('tip2')}</CheckDescriptionText>
              </ListItem>
              <ListItem>
                <CheckDescriptionText>{t('tip3')}</CheckDescriptionText>
              </ListItem>
            </UnorderedList>
            <CheckDescriptionText>{t('desc3')}</CheckDescriptionText>
            <HelpLink href={DOCUMENT_TITLE_HELP_LINK} onClick={handleClickHelpLink}>
              {t('learnMore')}
            </HelpLink>
          </Flex>
          <Box>{/* TODO: Documentation issue */}</Box>
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

export { DocumentTitleChecker };

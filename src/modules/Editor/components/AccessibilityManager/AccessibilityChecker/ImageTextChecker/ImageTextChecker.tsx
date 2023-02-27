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
import { IMAGE_OF_TEXTS_HELP_LINK } from '../../../../../../constants/links';
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

const ImageTextChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.imageText',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved } = state.checkers[AccessibilityCheckers.imageTexts];
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.imageTexts));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.imageTexts],
      });
    }
  };

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.imageTexts],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document image text button'
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
            </UnorderedList>
            <HelpLink href={IMAGE_OF_TEXTS_HELP_LINK} onClick={handleClickHelpLink}>
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

export { ImageTextChecker };

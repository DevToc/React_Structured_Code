import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
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
  AutoCheckPanel,
} from '../common';
import { LINKS_HELP_LINK } from '../../../../../../constants/links';
import { AccessibilityCheckers, AccessibilityCheckerStatus } from '../../AccessibilityManager.types';
import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker } from '../checker.actions';
import { ReactComponent as OkIcon } from '../../../../../../assets/icons/a11ymenu_status_ok.svg';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_AUTO_CHECKED,
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';

const LinkChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.links',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved, invalidWidgets, requireManualCheck } = state.checkers[AccessibilityCheckers.links];
  const descList = useMemo(() => [t('desc1'), t('desc2'), t('desc3'), t('desc4')], [t]);
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.links));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.links],
      });
    }
  };

  const [isResolved, setIsResolved] = useState(!invalidWidgets || invalidWidgets.length === 0);

  // Track when link auto checker runs and isResolved status changes
  useEffect(() => {
    Mixpanel.track(ACCESSIBILITY_AUTO_CHECKED, {
      a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.links],
      a11y_checker_item_status: isResolved ? 'pass' : 'fail',
    });
  }, [isResolved]);

  // Update status to OK if there are no more invalid widgets
  useEffect(() => {
    setIsResolved(!invalidWidgets || invalidWidgets.length === 0);
  }, [invalidWidgets]);

  const placeholderFunc = () => {};

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.links],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document links button'
          status={
            isMarkAsResolved
              ? requireManualCheck
                ? AccessibilityCheckerStatus.reviewed
                : AccessibilityCheckerStatus.ok
              : AccessibilityCheckerStatus.warn
          }
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <Flex direction='column' gap='2'>
            {descList.map((desc, i) => (
              <CheckDescriptionText key={i}>{desc}</CheckDescriptionText>
            ))}
            <HelpLink href={LINKS_HELP_LINK} onClick={handleClickHelpLink}>
              {t('learnMore')}
            </HelpLink>
          </Flex>
          <Box>{/* TODO: Documentation issue */}</Box>
          <AutoCheckPanel
            invalidWidgets={invalidWidgets}
            removeInvalidWidgetFromList={placeholderFunc}
            dispatchSelectWidget={placeholderFunc}
            label={'expand/collapse links auto-check panel'}
            ResolvedIcon={OkIcon}
            translate={t}
            check={placeholderFunc}
          />
          {!isResolved && (
            <Box>
              <MarkResolved isChecked={isMarkAsResolved} onChange={handleMarkResolved}>
                {t('resolvedCheck')}
              </MarkResolved>
            </Box>
          )}
        </Flex>
      </CheckItemPanel>
    </CheckContainer>
  );
};

export { LinkChecker };

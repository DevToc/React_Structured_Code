import { ReactElement, useCallback, useEffect } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AccessibilityCheckers, AccessibilityCheckerStatus } from '../../AccessibilityManager.types';
import { WidgetId } from '../../../../../../types/idTypes';
import { ReactComponent as ManualCheckIcon } from '../../../../../../assets/icons/a11ymenu_manual_check.svg';
import { ReactComponent as OkIcon } from '../../../../../../assets/icons/a11ymenu_status_ok.svg';
import {
  CheckContainer,
  CheckItemHeader,
  CheckItemHeaderLabel,
  CheckItemPanel,
  CheckDescriptionText,
  MarkResolved,
  StatusIconButton,
  HelpLink,
  StyledDivider,
  AutoCheckPanel,
} from '../common';
import { TABLES_HELP_LINK } from '../../../../../../constants/links';
import { useSelectWidgetFromOtherPage } from '../common/hooks/useSelectWidgetFromOtherPage';

import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker, updateChecker } from '../checker.actions';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_AUTO_CHECKED,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';

const TableChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.tables',
    useSuspense: false,
  });

  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved, invalidWidgets } = state.checkers[AccessibilityCheckers.tables];
  const isResolved = !invalidWidgets || invalidWidgets.length === 0;
  const hasTablesInDesign = !!invalidWidgets?.length;
  const { dispatchSelectWidget } = useSelectWidgetFromOtherPage();

  useEffect(() => {
    Mixpanel.track(ACCESSIBILITY_AUTO_CHECKED, {
      a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.tables],
      a11y_checker_item_status: isResolved ? 'pass' : 'fail',
    });
  }, [isResolved]);

  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.tables));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.tables],
      });
    }
  };

  const removeInvalidWidgetFromList = useCallback(
    (widgetId: WidgetId) => {
      const newList = invalidWidgets?.filter((widget) => widget.widgetId !== widgetId);
      dispatch(updateChecker(AccessibilityCheckers.tables, { invalidWidgets: newList }));
    },
    [dispatch, invalidWidgets],
  );

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.tables],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document tables button'
          status={
            hasTablesInDesign
              ? isMarkAsResolved
                ? AccessibilityCheckerStatus.reviewed
                : AccessibilityCheckerStatus.warn
              : AccessibilityCheckerStatus.ok
          }
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <Flex direction='column' gap='2'>
            <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
            <CheckDescriptionText>{t('desc2')}</CheckDescriptionText>
            <HelpLink href={TABLES_HELP_LINK} onClick={handleClickHelpLink}>
              {t('learnMore')}
            </HelpLink>
          </Flex>
          <StyledDivider />
          {hasTablesInDesign && (
            <Box>
              <AutoCheckPanel
                invalidWidgets={invalidWidgets}
                removeInvalidWidgetFromList={removeInvalidWidgetFromList}
                dispatchSelectWidget={dispatchSelectWidget}
                label={'expand/collapse table header auto-check panel'}
                IssueIcon={ManualCheckIcon}
                ResolvedIcon={OkIcon}
                translate={t}
                check={() => {}}
              />
            </Box>
          )}
          {!hasTablesInDesign && (
            <Box>
              <Flex alignItems={'center'} mt={1}>
                <OkIcon width={16} height={16} fill={'var(--vg-colors-green-500)'} />
                <Text ml={2} fontSize={'xs'}>
                  {t('noTable')}
                </Text>
              </Flex>
            </Box>
          )}
          {hasTablesInDesign && (
            <Box>
              <MarkResolved isChecked={isMarkAsResolved} onChange={handleMarkResolved}>
                {t('manualCheckCheckboxLabel')}
              </MarkResolved>
            </Box>
          )}
        </Flex>
      </CheckItemPanel>
    </CheckContainer>
  );
};

export { TableChecker };

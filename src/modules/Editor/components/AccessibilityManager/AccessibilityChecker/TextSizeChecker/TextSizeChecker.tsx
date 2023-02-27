import { ReactElement, useEffect, useState, useCallback } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { JSONContent } from '@tiptap/core';

import {
  CheckContainer,
  CheckItemHeader,
  CheckItemHeaderLabel,
  CheckItemPanel,
  CheckDescriptionText,
  MarkResolved,
  StatusIconButton,
  StyledDivider,
  AutoCheckPanel,
} from '../common';

import { useSelectWidgetFromOtherPage } from '../common/hooks/useSelectWidgetFromOtherPage';
import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker, updateChecker } from '../checker.actions';

import { AccessibilityCheckers, AccessibilityCheckerStatus, AllCheckerState } from '../../AccessibilityManager.types';
import { TextWidgetData } from '../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { AllWidgetData } from '../../../../../../widgets/Widget.types';
import { WidgetId } from '../../../../../../types/idTypes';

import { ReactComponent as WarningIcon } from '../../../../../../assets/icons/a11ymenu_manual_check.svg';
import { ReactComponent as OkIcon } from '../../../../../../assets/icons/a11ymenu_status_ok.svg';

import { getMarksOfType } from './TextSizeChecker.helpers';
import { MIN_ACCESSIBLE_FONT_SIZE } from './TextSizeChecker.config';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_AUTO_CHECKED,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
} from '../../../../../../constants/mixpanel';

const TextSizeChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.textSize',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved, invalidWidgets } = state.checkers[AccessibilityCheckers.textSize];
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.textSize));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.textSize],
      });
    }
  };

  const { dispatchSelectWidget } = useSelectWidgetFromOtherPage();

  const [isResolved, setIsResolved] = useState(!invalidWidgets || invalidWidgets.length === 0);

  // Track when text size auto checker status gets updated
  useEffect(() => {
    Mixpanel.track(ACCESSIBILITY_AUTO_CHECKED, {
      a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.textSize],
      a11y_checker_item_status: isResolved ? 'pass' : 'fail',
    });
  }, [isResolved]);

  // Update status to OK if there are no more invalid widgets
  useEffect(() => {
    setIsResolved(!invalidWidgets || invalidWidgets.length === 0);
  }, [invalidWidgets]);

  const removeInvalidWidgetFromList = useCallback(
    (widgetId: WidgetId) => {
      const newList = invalidWidgets?.filter((widget) => widgetId !== widget.widgetId);
      dispatch(
        updateChecker<AllCheckerState>(AccessibilityCheckers.textSize, {
          isMarkAsResolved: isMarkAsResolved || !newList?.length,
          invalidWidgets: newList,
        }),
      );
    },
    [dispatch, invalidWidgets, isMarkAsResolved],
  );

  const checkTextSize = useCallback(
    (widgetId: WidgetId, widgetData: AllWidgetData) => {
      const { proseMirrorData } = (widgetData as TextWidgetData) || {};
      const marks = widgetData ? (getMarksOfType('textStyle', proseMirrorData) as Array<JSONContent>) : [];
      const fontSizes = marks.map((x) => (x.attrs ? parseInt(x.attrs.fontSize) : -1)).filter((x) => x !== -1);
      const minFontSize = Math.min(...fontSizes);

      if (minFontSize >= MIN_ACCESSIBLE_FONT_SIZE) {
        removeInvalidWidgetFromList(widgetId);
      }
    },
    [removeInvalidWidgetFromList],
  );

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document text size button'
          status={isResolved || isMarkAsResolved ? AccessibilityCheckerStatus.ok : AccessibilityCheckerStatus.fail}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
          {!isResolved && <StyledDivider />}
          <AutoCheckPanel
            invalidWidgets={invalidWidgets}
            removeInvalidWidgetFromList={removeInvalidWidgetFromList}
            dispatchSelectWidget={dispatchSelectWidget}
            label={'expand/collapse text size auto-check panel'}
            IssueIcon={WarningIcon}
            ResolvedIcon={OkIcon}
            translate={t}
            check={checkTextSize}
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

export { TextSizeChecker };

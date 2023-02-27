import { ReactElement, useCallback, useEffect } from 'react';
import { Flex, UnorderedList, ListItem, Divider, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

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
import { HEADINGS_HELP_LINK } from '../../../../../../constants/links';
import { AccessibilityCheckers, AccessibilityCheckerStatus } from '../../AccessibilityManager.types';
import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker, updateChecker } from '../checker.actions';
import { CollapsibleBox } from '../../../../../common/components/CollapsibleBox';
import { ReactComponent as ManualCheckIcon } from '../../../../../../assets/icons/a11ymenu_manual_check.svg';
import { HeadingAutoCheckPanel } from './AutoCheckPanel/HeadingAutoCheckPanel';
import { useSelectWidgetFromOtherPage } from '../common/hooks/useSelectWidgetFromOtherPage';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { TextWidgetTag } from '../../../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { ACCESSIBILITY_MENU_WIDTH } from '../../AccessibilityManager.config';
import { selectActiveWidgetToolbarState, selectTaggedWidgetType } from '../../../../store/widgetSelector';
import { WidgetId } from '../../../../../../types/idTypes';
import { setShowTagOverlay } from '../../../../store/pageControlSlice';
import { useScanDocument } from '../common/hooks/useScanDocument';
import { selectShowTagOverlay } from '../../../../store/pageSelector';
import { setTaggedWidgetTypes } from '../../../../store/widgetControlSlice';
import { isTaggedTypesChanged, WIDGET_TYPES_FOR_TAG } from '../../AccessibilityManager.helpers';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_AUTO_CHECKED,
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';

interface HeadingManualCheckPanelProps {
  isMarkAsResolved: boolean;
  handleMarkResolved: () => void;
}

const StyledDivider = styled(Divider)`
  width: ${ACCESSIBILITY_MENU_WIDTH}px;
  margin-left: -1rem;
  height: 1px;
  background-color: var(--vg-colors-divider-gray);
`;

const HeadingManualCheckPanel = ({
  isMarkAsResolved,
  handleMarkResolved,
}: HeadingManualCheckPanelProps): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.headings',
    useSuspense: false,
  });

  return (
    <CollapsibleBox
      p={0}
      titleIcon={<ManualCheckIcon />}
      isOpenOnMount={true}
      variant={'plain'}
      title={t('manualCheckLabel')}
      collapseAriaLabel={'expand/collapse manual check panel'}
    >
      <CheckDescriptionText ml={6} mt={3}>
        {t('bestPractices')}
      </CheckDescriptionText>
      <UnorderedList pl={6} mb={4}>
        {t('manualCheckTips', { returnObjects: true }).map((tip, i) => (
          <ListItem key={i}>
            <CheckDescriptionText key={i}>
              <strong>{tip.bold}</strong> {tip.body || ''}
            </CheckDescriptionText>
          </ListItem>
        ))}
        <ListItem>
          <CheckDescriptionText>
            {t('the')} <strong>{t('title')}</strong> {t('manualCheckTip4')}
          </CheckDescriptionText>
        </ListItem>
        <ListItem>
          <CheckDescriptionText>
            <strong>{t('manualCheckTip5')}</strong>
          </CheckDescriptionText>
        </ListItem>
      </UnorderedList>
      <MarkResolved data-testid='toggle-heading-check' isChecked={isMarkAsResolved} onChange={handleMarkResolved}>
        {t('manualCheckCheckboxLabel')}
      </MarkResolved>
    </CollapsibleBox>
  );
};

const HeadingChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu',
    useSuspense: false,
  });

  const { state, dispatch } = useAccessibilityChecker();
  const globalDispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isMarkAsResolved, invalidWidgets } = state.checkers[AccessibilityCheckers.headings];
  const { dispatchSelectWidget } = useSelectWidgetFromOtherPage();
  const { scanHeadingOrder } = useScanDocument();

  const textWidgetToolbarState = useAppSelector(selectActiveWidgetToolbarState);
  const showTagOverlay = useAppSelector(selectShowTagOverlay);
  const taggedWidgetTypes = WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.headings];
  const selectedTaggedWidgetTypes = useAppSelector(selectTaggedWidgetType);
  const autoCheckPassed = invalidWidgets?.length === 0;

  // Track when heading auto checker runs and autoCheckPassed status changes
  useEffect(() => {
    Mixpanel.track(ACCESSIBILITY_AUTO_CHECKED, {
      a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.headings],
      a11y_checker_item_status: autoCheckPassed ? 'pass' : 'fail',
    });
  }, [autoCheckPassed]);

  // Hide tag overlay on unmount
  useEffect(() => {
    return () => {
      globalDispatch(setShowTagOverlay(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manage isOpen state when panel is closed by accordion's default behaviour
  useEffect(() => {
    if (isOpen && (!showTagOverlay || isTaggedTypesChanged(taggedWidgetTypes, selectedTaggedWidgetTypes))) {
      onClose();
    }
  }, [isOpen, showTagOverlay, taggedWidgetTypes, selectedTaggedWidgetTypes, onClose]);

  /**
   * Update widget tag in store - must use toolbar state actions
   * to update prosemirror editor tags
   *
   * @param tag - new text tag
   */
  const updateWidgetTag = useCallback(
    (tag: TextWidgetTag) => {
      textWidgetToolbarState?.setTextTag?.(tag);
    },
    [textWidgetToolbarState],
  );

  /**
   * Triggered when checking manual check checkbox
   */
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.headings));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.headings],
      });
    }
  };

  const removeInvalidWidgetFromList = useCallback(
    (widgetId: WidgetId) => {
      const newList = invalidWidgets?.filter((widget) => widget.widgetId !== widgetId);
      dispatch(updateChecker(AccessibilityCheckers.headings, { invalidWidgets: newList }));
    },
    [dispatch, invalidWidgets],
  );

  const isCheckComplete = (!invalidWidgets || invalidWidgets.length === 0) && isMarkAsResolved;

  // Open panel and display tag overlay
  const handleOpenPanel = () => {
    globalDispatch(setTaggedWidgetTypes(taggedWidgetTypes));
    globalDispatch(setShowTagOverlay(true));
    onOpen();
  };

  // Close panel and display tag overlay
  const handleClosePanel = () => {
    globalDispatch(setShowTagOverlay(false));
    onClose();
  };

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: 'Text Tag',
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader data-testid='heading-checker' onClick={isOpen ? handleClosePanel : handleOpenPanel}>
        <CheckItemHeaderLabel>{t('headings.headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document headings button'
          status={isCheckComplete ? AccessibilityCheckerStatus.reviewed : AccessibilityCheckerStatus.warn}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <Flex direction='column' gap='2'>
            <CheckDescriptionText>{t('headings.desc1')}</CheckDescriptionText>
            <HelpLink href={HEADINGS_HELP_LINK} onClick={handleClickHelpLink}>
              {t('headings.learnMore')}
            </HelpLink>
          </Flex>
          <StyledDivider />
          <HeadingAutoCheckPanel
            invalidWidgets={invalidWidgets}
            dispatchSelectWidget={dispatchSelectWidget}
            dispatchUpdateWidgetTag={updateWidgetTag}
            rescanDocument={scanHeadingOrder}
            removeInvalidWidgetFromList={removeInvalidWidgetFromList}
          />
          <StyledDivider />
          <HeadingManualCheckPanel isMarkAsResolved={isMarkAsResolved} handleMarkResolved={handleMarkResolved} />
        </Flex>
      </CheckItemPanel>
    </CheckContainer>
  );
};

export { HeadingChecker };

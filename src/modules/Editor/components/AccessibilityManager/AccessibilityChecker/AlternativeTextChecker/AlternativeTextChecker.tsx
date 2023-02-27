import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Flex, UnorderedList, ListItem, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import {
  CheckContainer,
  CheckItemHeader,
  CheckItemHeaderLabel,
  CheckItemPanel,
  CheckDescriptionText,
  MarkResolved,
  StatusIconButton,
  StyledDivider,
  HelpLink,
} from '../common';
import { ALTERNATIVE_TEXT_HELP_LINK } from '../../../../../../constants/links';
import { AccessibilityCheckers, AccessibilityCheckerStatus, AllCheckerState } from '../../AccessibilityManager.types';
import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker, updateChecker } from '../checker.actions';
import { CollapsibleBox } from '../../../../../common/components/CollapsibleBox';
import { ReactComponent as ManualCheckIcon } from '../../../../../../assets/icons/a11ymenu_manual_check.svg';
import { AltTextAutoCheckPanel } from './AutoCheckPanel/AutoCheckPanel';
import { WidgetId } from '../../../../../../types/idTypes';
import { useSelectWidgetFromOtherPage } from '../common/hooks/useSelectWidgetFromOtherPage';
import { setShowTagOverlay } from '../../../../store/pageControlSlice';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setTaggedWidgetTypes } from '../../../../store/widgetControlSlice';
import { WidgetType } from '../../../../../../types/widget.types';
import { selectShowTagOverlay } from '../../../../store/pageSelector';
import { isTaggedTypesChanged, WIDGET_TYPES_FOR_TAG } from '../../AccessibilityManager.helpers';
import { selectTaggedWidgetType } from '../../../../store/widgetSelector';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_AUTO_CHECKED,
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';

const AltTextDescription = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.alternativeText',
    useSuspense: false,
  });

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: 'Alt Text',
    });
  };

  return (
    <Flex direction='column' gap='2'>
      <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
      <CheckDescriptionText>{t('makeSure')}</CheckDescriptionText>
      <UnorderedList pl='6'>
        {t('tips', { returnObjects: true }).map((tip, i) => (
          <ListItem key={i}>
            <CheckDescriptionText key={i}>{tip}</CheckDescriptionText>
          </ListItem>
        ))}
      </UnorderedList>
      <HelpLink href={ALTERNATIVE_TEXT_HELP_LINK} onClick={handleClickHelpLink}>
        {t('learnMore')}
      </HelpLink>
    </Flex>
  );
};

const AltTextManualCheckPanel = ({
  isMarkAsResolved,
  handleMarkResolved,
}: {
  isMarkAsResolved: boolean;
  handleMarkResolved: () => void;
}): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.alternativeText',
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
      <CheckDescriptionText pl={6} mt={3} mb={4}>
        {t('manualCheckDescription')}
      </CheckDescriptionText>
      <MarkResolved isChecked={isMarkAsResolved} onChange={handleMarkResolved}>
        {t('manualCheckCheckboxLabel')}
      </MarkResolved>
    </CollapsibleBox>
  );
};

const AlternativeTextChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.alternativeText',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const globalDispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isMarkAsResolved, invalidWidgets } = state.checkers[AccessibilityCheckers.alternativeText];
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.alternativeText));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.alternativeText],
      });
    }
  };
  const { dispatchSelectWidget } = useSelectWidgetFromOtherPage();

  const [isResolved, setIsResolved] = useState((!invalidWidgets || invalidWidgets.length === 0) && isMarkAsResolved);

  const showTagOverlay = useAppSelector(selectShowTagOverlay);
  const taggedWidgetTypes = WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.alternativeText] as WidgetType[];
  const selectedTaggedWidgetTypes = useAppSelector(selectTaggedWidgetType);

  const removeInvalidWidgetFromList = useCallback(
    (widgetId: WidgetId) => {
      const newList = invalidWidgets?.filter((widget) => widgetId !== widget.widgetId);
      dispatch(updateChecker<AllCheckerState>(AccessibilityCheckers.alternativeText, { invalidWidgets: newList }));
    },
    [dispatch, invalidWidgets],
  );

  const isResolvedStatus = !invalidWidgets || invalidWidgets.length === 0;

  // Track if alt text automatic check runs and isResolvedStatus updates
  useEffect(() => {
    Mixpanel.track(ACCESSIBILITY_AUTO_CHECKED, {
      a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.alternativeText],
      a11y_checker_item_status: isResolvedStatus ? 'pass' : 'fail',
    });
  }, [isResolvedStatus]);

  // Update status to OK if there are no more invalid widgets, and manual check is complete
  useEffect(() => {
    setIsResolved((!invalidWidgets || invalidWidgets.length === 0) && isMarkAsResolved);
  }, [invalidWidgets, isMarkAsResolved]);

  // Manage isOpen state when panel is closed by accordion's default behaviour
  useEffect(() => {
    if (isOpen && (!showTagOverlay || isTaggedTypesChanged(taggedWidgetTypes, selectedTaggedWidgetTypes))) {
      onClose();
    }
  }, [isOpen, showTagOverlay, taggedWidgetTypes, selectedTaggedWidgetTypes, onClose]);

  // Open panel and display tag overlay
  const handleOpenPanel = () => {
    globalDispatch(setShowTagOverlay(true));
    globalDispatch(setTaggedWidgetTypes(taggedWidgetTypes));
    onOpen();
  };

  // Close panel and display tag overlay
  const handleClosePanel = () => {
    globalDispatch(setShowTagOverlay(false));
    onClose();
  };

  const headerTestId = 'alternativeText-header';

  return (
    <CheckContainer>
      <CheckItemHeader onClick={isOpen ? handleClosePanel : handleOpenPanel} data-testid={headerTestId}>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check alternative text button'
          status={isResolved ? AccessibilityCheckerStatus.reviewed : AccessibilityCheckerStatus.warn}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <AltTextDescription />
          <StyledDivider />
          <AltTextAutoCheckPanel
            invalidWidgets={invalidWidgets}
            removeInvalidWidgetFromList={removeInvalidWidgetFromList}
            dispatchSelectWidget={dispatchSelectWidget}
          />
          <StyledDivider />
          <AltTextManualCheckPanel isMarkAsResolved={isMarkAsResolved} handleMarkResolved={handleMarkResolved} />
        </Flex>
      </CheckItemPanel>
    </CheckContainer>
  );
};

export { AlternativeTextChecker };

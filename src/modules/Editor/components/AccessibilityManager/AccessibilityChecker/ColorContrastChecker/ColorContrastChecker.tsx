import { ReactElement, useCallback, useEffect } from 'react';
import { Box, Flex, UnorderedList, ListItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { WidgetId } from 'types/idTypes';
import { ACCESSIBILITY_AUTO_CHECKED, ACCESSIBILITY_CHECKER, CHECKER_LABELS, HELP_OPENED } from 'constants/mixpanel';
import { COLOR_CONTRAST_HELP_LINK } from 'constants/links';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { useDebouncedCallback } from 'hooks/useDebounce';
import { ReactComponent as WarningIcon } from 'assets/icons/a11ymenu_manual_check.svg';
import { ReactComponent as OkIcon } from 'assets/icons/a11ymenu_status_ok.svg';
import {
  CheckContainer,
  CheckItemHeader,
  CheckItemHeaderLabel,
  CheckItemPanel,
  CheckDescriptionText,
  ReScan,
  StatusIconButton,
  StyledDivider,
  HelpLink,
} from '../common';
import { useSelectWidgetFromOtherPage } from '../common/hooks/useSelectWidgetFromOtherPage';
import { AccessibilityCheckers, AccessibilityCheckerStatus, AllCheckerState } from '../../AccessibilityManager.types';
import { useAccessibilityChecker } from '../checker.hooks';
import { updateChecker } from '../checker.actions';
import { AutoCheckPanel } from '../common/AutoCheckPanel';
import { useScanColorContrast } from '../common/hooks/useScanColorContrast';

interface ColorContrastCheckerProps {
  thumbnailsRefs?: Array<HTMLDivElement | null>;
}

const ColorContrastChecker = ({ thumbnailsRefs }: ColorContrastCheckerProps): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.colorContrast',
    useSuspense: false,
  });
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved, invalidWidgets } = state.checkers[AccessibilityCheckers.colorContrast];

  const { dispatchSelectWidget } = useSelectWidgetFromOtherPage();
  const { scanColorContrast } = useScanColorContrast(thumbnailsRefs);
  const debounceScanColorContrast = useDebouncedCallback(scanColorContrast, 200);

  const removeInvalidWidgetFromList = useCallback(
    (widgetId: WidgetId) => {
      const newList = invalidWidgets?.filter((widget) => widgetId !== widget.widgetId);

      dispatch(
        updateChecker<AllCheckerState>(AccessibilityCheckers.colorContrast, {
          invalidWidgets: newList,
          isMarkAsResolved: isMarkAsResolved || !newList?.length,
        }),
      );
    },
    [dispatch, invalidWidgets, isMarkAsResolved],
  );

  // Track only when color contrast auto checker runs and isResolved updates
  // invalidWidgets is initialized to be undefined and then an empty array, before the auto check is complete, setTimeout prevent mp event being fired when the check is not complete (when invalidWdigets is [])
  useEffect(() => {
    let timeoutId: null | ReturnType<typeof setTimeout>;
    if (invalidWidgets !== undefined) {
      const isResolvedStatus = invalidWidgets.length === 0;
      timeoutId = setTimeout(() => {
        Mixpanel.track(ACCESSIBILITY_AUTO_CHECKED, {
          a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.colorContrast],
          a11y_checker_item_status: isResolvedStatus ? 'pass' : 'fail',
        });
      }, 500);
    }
    return () => {
      if (!!timeoutId) clearTimeout(timeoutId);
    };
  }, [invalidWidgets]);

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.colorContrast],
    });
  };

  return (
    <CheckContainer>
      <CheckItemHeader>
        <CheckItemHeaderLabel>{t('headerLabel')}</CheckItemHeaderLabel>
        <StatusIconButton
          aria-label='check document color contrast button'
          status={isMarkAsResolved ? AccessibilityCheckerStatus.ok : AccessibilityCheckerStatus.fail}
        />
      </CheckItemHeader>
      <CheckItemPanel>
        <Flex direction='column' gap='2'>
          <Flex direction='column' gap='2'>
            <CheckDescriptionText>{t('desc1')}</CheckDescriptionText>
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
            <Box>
              <CheckDescriptionText>{t('desc2')}</CheckDescriptionText>
            </Box>
            <HelpLink href={COLOR_CONTRAST_HELP_LINK} onClick={handleClickHelpLink}>
              {t('learnMore')}
            </HelpLink>
          </Flex>
          <StyledDivider />
          <Box>
            <AutoCheckPanel
              invalidWidgets={invalidWidgets}
              removeInvalidWidgetFromList={removeInvalidWidgetFromList}
              dispatchSelectWidget={dispatchSelectWidget}
              label={'expand/collapse color contrast auto-check panel'}
              IssueIcon={WarningIcon}
              ResolvedIcon={OkIcon}
              translate={t}
              check={() => {}}
            />
          </Box>
          <Box>
            <ReScan onClick={debounceScanColorContrast} buttonAriaLabel={'refresh the color contrast checker'}>
              {t('rescan')}
            </ReScan>
          </Box>
        </Flex>
      </CheckItemPanel>
    </CheckContainer>
  );
};

export { ColorContrastChecker };

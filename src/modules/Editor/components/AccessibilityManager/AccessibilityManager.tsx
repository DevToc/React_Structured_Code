import { ReactElement, useMemo, lazy, Suspense } from 'react';
import { Box, ListItem, Link, Tabs, TabList, Tab, TabPanels, TabPanel, Text, UnorderedList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useViewport } from 'hooks/useViewport';
import { useUpdateEffect } from '../../../../hooks/useUpdateEffect';
import { CollapsibleBox } from '../../../common/components/CollapsibleBox';
import { useAppSelector, useAppDispatch } from '../../store';
import { setAccessibilityViewIndex } from '../../store/editorSettingsSlice';
import { selectIsAccessibilityView } from '../../store/selectEditorSettings';
import { ACCESSIBILITY_MENU_WIDTH, TABLIST_HEADER_HEIGHT } from './AccessibilityManager.config';
import { READING_ORDER_HELP_LINK } from '../../../../constants/links';
import { useFocus } from '../Focus';

import { ReactComponent as SolidInfoIcon } from '../../../../assets/icons/filled_info.svg';
import { AccessibilityViewIndex } from '../../../../types/accessibilityViewIndex';
import { useMenuTabControl } from './AccessibilityChecker/common/hooks/useMenuTabControl';
import { SidePanel } from '../../../common/components/SidePanel';
import { SidePanelHeader } from '../../../common/components/SidePanel';
import {
  CHECKER_LABELS,
  HELP_OPENED,
  READING_ORDER_MENU,
  READING_ORDER_TAB_OPENED,
} from '../../../../constants/mixpanel';
import { AccessibilityCheckers } from './AccessibilityManager.types';
import { ClickEventTracker } from '../../../common/components/ClickEventHandler/ClickEventWrapper';

const ReadingOrderTab = lazy(
  () =>
    import(
      /* webpackChunkName: "ReadingOrderTab" */
      /* webpackPrefetch: true */
      './ReadingOrderTab'
    ),
);

const CheckAccessibilityTab = lazy(
  () =>
    import(
      /* webpackChunkName: "CheckAccessibilityTab" */
      /* webpackPrefetch: true */
      './AccessibilityChecker/CheckAccessibilityTab'
    ),
);

const SimulatorTab = lazy(
  () =>
    import(
      /* webpackChunkName: "SimulatorTab" */
      /* webpackPrefetch: true */
      './SimulatorTab'
    ),
);

/**
 * TODO: Add a better loader UI
 * @returns
 */
const TabSkeleton = () => <></>;

const AccessibilityTabMenu = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu',
    useSuspense: false,
  });
  // Tips to render in collapsible box
  const tipList = useMemo(
    () => [<Text fontSize='xs'>{t('tips.tip1')}</Text>, <Text fontSize='xs'>{t('tips.tip2')}</Text>],
    [t],
  );
  const focusStyle = {
    boxShadow: 'inset var(--vg-shadows-outline)',
  };
  const { tabIndex, setTabIndex } = useMenuTabControl();

  const { tabContentHeight } = useViewport();

  return (
    <Box>
      <Tabs isLazy index={tabIndex} onChange={setTabIndex}>
        <TabList h={`${TABLIST_HEADER_HEIGHT}px`}>
          <Tab fontSize='sm' fontWeight='medium' _focus={focusStyle}>
            Accessibility
          </Tab>
          <ClickEventTracker
            eventProps={{
              name: READING_ORDER_TAB_OPENED,
              from: 'Accessibility Checker Tab',
            }}
          >
            <Tab fontSize='sm' fontWeight='medium' _focus={focusStyle} aria-label='Reading Order Tab'>
              Edit Reading Order
            </Tab>
          </ClickEventTracker>
          <Tab fontSize='sm' fontWeight='medium' _focus={focusStyle} aria-label='Visual Simulator'>
            Simulator
          </Tab>
        </TabList>
        <TabPanels overflowY='auto' maxH={tabContentHeight}>
          <TabPanel _focus={focusStyle} padding='0'>
            <Suspense fallback={<TabSkeleton />}>
              <CheckAccessibilityTab />
            </Suspense>
          </TabPanel>
          <TabPanel _focus={focusStyle}>
            <CollapsibleBox
              title={t('tips.title')}
              titleIcon={<SolidInfoIcon />}
              collapseAriaLabel='Toggle Alt Text Tips'
              isOpenOnMount={true}
            >
              <UnorderedList pl={6}>
                {tipList.map((tip, i) => (
                  <ListItem key={i}>{tip}</ListItem>
                ))}
              </UnorderedList>
              <Box mt='2' ml='6' lineHeight='var(--vg-lineHeights-none)'>
                <ClickEventTracker
                  eventProps={{
                    name: HELP_OPENED,
                    from: READING_ORDER_MENU,
                    help_type: CHECKER_LABELS[AccessibilityCheckers.logicalReadingOrder],
                  }}
                >
                  <Link fontSize='xs' variant='inline' href={READING_ORDER_HELP_LINK} isExternal>
                    {t('tips.learnMore')}
                  </Link>
                </ClickEventTracker>
              </Box>
            </CollapsibleBox>
            <Suspense fallback={<TabSkeleton />}>
              <ReadingOrderTab mt='2' />
            </Suspense>
          </TabPanel>
          <TabPanel _focus={focusStyle} padding='0'>
            <Suspense fallback={<TabSkeleton />}>
              <SimulatorTab />
            </Suspense>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export const AccessibilityMenuContainer = (): ReactElement | null => {
  const isAccessibilityView = useAppSelector(selectIsAccessibilityView);
  const { setCanvasFocus } = useFocus();

  useUpdateEffect(() => {
    if (!isAccessibilityView) return setCanvasFocus();
  }, [isAccessibilityView, setCanvasFocus]);

  if (!isAccessibilityView) return null;

  return <AccessibilityMenuLayout />;
};

const AccessibilityMenuLayout = (): ReactElement => {
  const { closeAccessibilityMenuRef } = useFocus();

  const { isMobile, viewportHeight } = useViewport();

  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.CLOSED));
  };

  return (
    <SidePanel
      isOpen={true}
      position='absolute'
      testId='accessibility-menu'
      maxH={isMobile ? viewportHeight : undefined}
      w={isMobile ? '100%' : `${ACCESSIBILITY_MENU_WIDTH}px`}
      right={0}
      zIndex='accessibilityMenu'
      placement='right'
      overflow='hidden'
    >
      <SidePanelHeader
        title='Accessibility'
        onClose={handleClose}
        ref={closeAccessibilityMenuRef}
        closeButtonAriaLabel='Close accessibility menu'
      />
      <Box overflow='hidden'>
        <AccessibilityTabMenu />
      </Box>
    </SidePanel>
  );
};

export const AccessibilityMenu = () => {
  return <AccessibilityMenuContainer />;
};

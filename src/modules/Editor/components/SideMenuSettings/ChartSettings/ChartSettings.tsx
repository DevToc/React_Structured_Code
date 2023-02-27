import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import { ChartSettingsTabProps } from './ChartSettings.types';
import { useSideMenuSetting } from 'widgets/sdk';
import { useEventListener } from 'hooks/useEventListener';

/**
 * The main chart settings container
 * with the data and setup tab
 */
export const ChartSettings = ({
  children,
  selectedTabIndex = 0,
  setSelectedTabIndex,
  isFitted,
}: {
  children: React.ReactNode;
  selectedTabIndex?: number;
  setSelectedTabIndex?: Function;
  isFitted?: boolean;
}) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const tabPanelsRef = useRef<HTMLDivElement>(null);
  const { allowScrolling } = useSideMenuSetting();

  const updateHeight = useCallback(() => {
    if (tabPanelsRef.current) {
      const top = tabPanelsRef.current.getBoundingClientRect().top;
      const height = (window.innerHeight || document.documentElement.clientHeight) - top;

      tabPanelsRef.current.style.height = `${height}px`;
    }
  }, []);

  // Update the height once the component is load
  useEffect(() => {
    updateHeight();
  }, [updateHeight]);

  // Add the update height event handler to the window resize event
  useEventListener('resize', updateHeight);

  const handleTabsChange = (index: number) => {
    typeof setSelectedTabIndex === 'function' && setSelectedTabIndex(index);
  };

  return (
    <Tabs index={selectedTabIndex} onChange={handleTabsChange} isFitted={isFitted}>
      <TabList h={12}>
        <Tab _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }} fontSize='sm' fontWeight='semibold'>
          {t('chartSettings.tabData')}
        </Tab>
        <Tab
          _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}
          data-testid='tab-setup'
          fontSize='sm'
          fontWeight='semibold'
        >
          {t('chartSettings.tabSetup')}
        </Tab>
      </TabList>
      <TabPanels ref={tabPanelsRef} overflow={allowScrolling ? 'auto' : 'hidden'}>
        {children}
      </TabPanels>
    </Tabs>
  );
};

export const DataTab = forwardRef<HTMLDivElement, ChartSettingsTabProps>(({ children, ...props }, ref) => (
  <TabPanel ref={ref} {...props}>
    <Flex direction='column' gap={4}>
      {children}
    </Flex>
  </TabPanel>
));

export const SetupTab = forwardRef<HTMLDivElement, ChartSettingsTabProps>(({ children, ...props }, ref) => (
  <TabPanel ref={ref} {...props}>
    <Flex direction='column' gap={4}>
      {children}
    </Flex>
  </TabPanel>
));

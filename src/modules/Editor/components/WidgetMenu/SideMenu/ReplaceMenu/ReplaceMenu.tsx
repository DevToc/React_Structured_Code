import { memo, ReactElement, useEffect } from 'react';
import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox';
import { useAppDispatch, useAppSelector, useAppStore, RootState } from 'modules/Editor/store';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';
import { setActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSlice';
import { selectWidgetProperty } from 'modules/Editor/store/infographSelector';
import { updateWidget } from 'modules/Editor/store/infographSlice';
import { selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { IconWidgetData, IconWidgetType } from 'widgets/IconWidget/IconWidget.types';
import { NewWidget } from 'widgets/Widget.types';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { IconColorOption } from 'types/icon.types';
import { useFocus } from 'modules/Editor/components/Focus/useFocus';
import { IconWidgetMenu } from '../IconWidgetMenu';
import { handleReplaceData, widgetHasReplace } from './ReplaceMenu.helper';

type ReplaceOptions = {
  [label: string]: ReactElement;
};

export const ReplaceMenu = memo(() => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { boundingBox } = useBoundingBox();
  const { setWidgetFocus } = useFocus();

  // menu properties
  const activeWidgetMenu = useAppSelector(selectActiveWidgetMenu);
  const isReplaceMenuActive = activeWidgetMenu === WIDGET_MENU_OPTIONS.REPLACE;

  // widget properties
  const activeWidgets = useAppSelector(selectActiveWidgets) || {};
  const widgetId = activeWidgets[0]?.id;
  const type = useAppSelector(selectWidgetProperty<IconWidgetData, 'type'>(widgetId, 'type'));
  const hasOneActiveWidget = activeWidgets?.length === 1;

  const handleReplaceWidget = (newWidget: NewWidget | NewWidget[], viewBox: string) => {
    const { widgetData: newWidgetData } = newWidget as NewWidget;

    // access the widget data when the function is called
    // we don't need to subscribe to the data - we just need it when this handleReplaceWidget is called
    const widgetData = (store.getState() as RootState).infograph.widgets[widgetId];
    const replaceData = handleReplaceData({ widgetId, newWidgetData, widgetData, viewBox });

    dispatch(updateWidget({ widgetId, widgetData: replaceData }));
    setWidgetFocus(widgetId);
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  const replaceOptions: ReplaceOptions = {
    Icons: (
      <IconWidgetMenu
        colorOptions={type === IconWidgetType.Grid ? [IconColorOption.Mono] : undefined}
        isIconWidgetMenuActive
        onClickIconWidget={handleReplaceWidget}
      />
    ),
  };

  const replaceTabs = Object.keys(replaceOptions);

  useEffect(() => {
    // for multiple select - close the replace menu if it's open
    if (!hasOneActiveWidget && isReplaceMenuActive) dispatch(setActiveWidgetMenu(WIDGET_MENU_OPTIONS.NONE));
    // close the menu if the widget doesn't have a replace option
    if (!widgetHasReplace(widgetId)) dispatch(setActiveWidgetMenu(WIDGET_MENU_OPTIONS.NONE));
  }, [hasOneActiveWidget, isReplaceMenuActive, dispatch, widgetId]);

  return (
    <Box h='full' data-testid='replace-menu'>
      <Flex direction='column' h='full'>
        <Tabs display='flex' flexDir='column' flex='1' overflow='hidden'>
          <TabList h={10}>
            {replaceTabs.map((tab) => (
              <Tab
                key={tab}
                fontSize='sm'
                fontWeight='semibold'
                textTransform='capitalize'
                _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels flex='1' overflow='auto'>
            {replaceTabs.map((tab) => (
              <TabPanel key={tab} p={0}>
                {replaceOptions[tab]}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
});

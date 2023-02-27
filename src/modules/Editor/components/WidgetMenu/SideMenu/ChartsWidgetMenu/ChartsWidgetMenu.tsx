import { ReactElement, useCallback } from 'react';
import { Text, Flex, Grid, GridItem } from '@chakra-ui/react';

import { addNewWidget, useAppSelector, useAppDispatch } from '../../../../store';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { CHART_MENU_DATA, CHART_TYPE_TO_DEFAULT_DATA_MAP, ChartType } from './ChartsWidgetMenu.config';
import { setWidgetSettingsView } from '../../../../store/editorSettingsSlice';
import { SIDE_MENU_WIDGET_TYPES } from '../../../SideMenuSettings/SideMenuSettings.config';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO_CHARTS } from 'utils/calculateInitialWidgetPos';

interface ChartsWidgetMenuProps {
  onComplete?: () => void;
  shouldOpenSideMenu?: boolean;
}

export const ChartsWidgetMenu = ({ onComplete, shouldOpenSideMenu = true }: ChartsWidgetMenuProps): ReactElement => {
  const dispatch = useAppDispatch();
  const zoom = useAppSelector(selectZoom);
  const infographWidthPx = useAppSelector(selectInfographWidthPx);

  const doAddWidget = (chartType: ChartType) => {
    const widgetData = CHART_TYPE_TO_DEFAULT_DATA_MAP[chartType];
    const initialTopPx = calculateInitialTopPx(zoom);
    const initialLeftPx = INITIAL_LEFTPX_RATIO_CHARTS * infographWidthPx;
    widgetData.widgetData = { ...widgetData.widgetData, topPx: initialTopPx, leftPx: initialLeftPx };

    dispatch(addNewWidget(widgetData));

    // Open side menu when chart is added
    if (SIDE_MENU_WIDGET_TYPES.includes(widgetData.widgetType) && shouldOpenSideMenu) {
      dispatch(setWidgetSettingsView(true));
    }

    if (typeof onComplete === 'function') onComplete();
  };

  return (
    <Flex p={4} direction={'column'} gap={4} data-testid={'widgetmenu-chart-panel'} h={'full'} overflow={'auto'}>
      {CHART_MENU_DATA.map((chartCategory) => {
        return (
          <ChartCategory
            key={chartCategory.category}
            title={chartCategory.category}
            widgets={chartCategory.chartWidgets}
            onClickWidget={doAddWidget}
          />
        );
      })}
    </Flex>
  );
};

interface ChartCategoryProps {
  title: string;
  widgets: {
    type: ChartType;
    icon: ReactElement;
    name: string;
  }[];
  onClickWidget: (chartType: ChartType) => void;
}

const ChartCategory = ({ title, widgets, onClickWidget }: ChartCategoryProps) => {
  return (
    <Flex direction={'column'}>
      <Text mb={4} color={'font.500'} fontWeight={'500'} fontSize={'sm'}>
        {title}
      </Text>
      <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4} rowGap={4}>
        {widgets.map((widget) => (
          <GridItem key={widget.name}>
            <ChartThumbnail title={widget.name} type={widget.type} icon={widget.icon} onClick={onClickWidget} />
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
};

interface ChartThumbnailProps {
  title: string;
  type: ChartType;
  icon: ReactElement;
  onClick: (chartType: ChartType) => void;
}
const ChartThumbnail = ({ title, type, icon, onClick }: ChartThumbnailProps) => {
  const handleClick = useCallback(() => {
    onClick(type);
  }, [onClick, type]);

  return (
    <Flex
      w={'full'}
      h={'full'}
      direction={'column'}
      gap={1}
      p={4}
      alignItems={'center'}
      justifyContent={'center'}
      as={'button'}
      border={'1px solid'}
      borderColor={'divider.gray'}
      borderRadius={'base'}
      onClick={handleClick}
      transitionDuration={'200ms'}
      _hover={{
        bg: 'hover.gray',
      }}
      data-testid={`chartsmenu-${type.toLowerCase()}-btn`}
    >
      <Flex align='center' h={41}>
        {icon}
      </Flex>
      <Text color={'font.500'} fontSize={'xs'}>
        {title}
      </Text>
    </Flex>
  );
};

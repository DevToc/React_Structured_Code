import { Flex, Text } from '@chakra-ui/react';
import { memo, ReactElement, useCallback, useEffect } from 'react';

import { useAppSelector } from 'modules/Editor/store';
import { selectIsActiveWidgetByGroup } from 'modules/Editor/store/widgetSelector';
import { selectWidget } from 'modules/Editor/store/infographSelector';

import { WidgetType, BasicWidgetTypes } from 'types/widget.types';
import { AllWidgetData } from 'widgets/Widget.types';
import { PageId, WidgetId } from 'types/idTypes';

import { ReactComponent as ImageIcon } from 'assets/icons/a11ymenu_image.svg';
import { ReactComponent as ShapeIcon } from 'assets/icons/a11ymenu_shape.svg';
import { ReactComponent as LineIcon } from 'assets/icons/a11ymenu_line.svg';
import { ReactComponent as IconIcon } from 'assets/icons/a11ymenu_icon.svg';
import { ReactComponent as TextIcon } from 'assets/icons/a11ymenu_text.svg';
import { ReactComponent as TableIcon } from 'assets/icons/a11ymenu_table.svg';
import { ReactComponent as AreaChartIcon } from 'assets/icons/a11ymenu_area_chart.svg';
import { ReactComponent as BarChartIcon } from 'assets/icons/a11ymenu_bar_chart.svg';
import { ReactComponent as ColumnChartIcon } from 'assets/icons/a11ymenu_column_chart.svg';
import { ReactComponent as LineChartIcon } from 'assets/icons/a11ymenu_line_chart.svg';
import { ReactComponent as StackedBarChartIcon } from 'assets/icons/a11ymenu_stackedbar_chart.svg';
import { ReactComponent as StackedColumnChartIcon } from 'assets/icons/a11ymenu_stackedcolumn_chart.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/a11ymenu_pie_chart.svg';

import { InvalidWidgetItemContainer } from '../InvalidWidgetItemContainer';

import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { getLabel } from '../../../AccessibilityManager.helpers';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

interface InvalidWidgetItemProps {
  widgetId: WidgetId;
  pageId: PageId;
  removeInvalidWidgetFromList: (widgetId: WidgetId) => void;
  dispatchSelectWidget: ({ widgetId, pageId }: SelectionTarget) => void;
  check: (widgetId: WidgetId, widgetData: AllWidgetData) => void;
}

const WIDGET_ICON_MAP = {
  [WidgetType.Icon]: IconIcon,
  [WidgetType.Image]: ImageIcon,
  [WidgetType.Line]: LineIcon,
  [WidgetType.BasicShape]: ShapeIcon,
  [WidgetType.Text]: TextIcon,
  [WidgetType.PieChart]: PieChartIcon,
  [WidgetType.Table]: TableIcon,
  [WidgetType.Table]: TextIcon,
  [WidgetType.LineChart]: LineChartIcon,
  [WidgetType.ColumnChart]: ColumnChartIcon,
  [WidgetType.BarChart]: BarChartIcon,
  [WidgetType.AreaChart]: AreaChartIcon,
  [WidgetType.StackedAreaChart]: AreaChartIcon,
  [WidgetType.StackedBarChart]: StackedBarChartIcon,
  [WidgetType.StackedColumnChart]: StackedColumnChartIcon,
};

export const InvalidWidgetItem = memo(
  ({
    widgetId,
    pageId,
    removeInvalidWidgetFromList,
    dispatchSelectWidget,
    check,
  }: InvalidWidgetItemProps): ReactElement => {
    const widget = useAppSelector(selectWidget(widgetId)) as AllWidgetData;

    // Widget is considered active if it is the only widget selected or if it belongs to a responsive group that is selected
    const isActive = useAppSelector(selectIsActiveWidgetByGroup(widgetId));

    const text = widget ? getLabel(widgetId, widget as AllWidgetData) : '';
    const widgetType = getWidgetTypeFromId(widgetId) as BasicWidgetTypes;
    const IconComponent = WIDGET_ICON_MAP[widgetType];

    useEffect(() => {
      if (!widget) {
        removeInvalidWidgetFromList(widgetId);
      }
    }, [widget, widgetId, removeInvalidWidgetFromList]);

    // Remove widget from invalid widget list if issue is fixed
    useEffect(() => {
      check(widgetId, widget);
    }, [widgetId, widget, check]);

    /**
     * Selects the given widget
     * Triggered when clicking on a widget item
     */
    const handleSelectWidget = useCallback(() => {
      dispatchSelectWidget({ widgetId, pageId });
    }, [dispatchSelectWidget, widgetId, pageId]);

    if (!widget) return <></>;

    return (
      <InvalidWidgetItemContainer isActive={isActive} onClick={handleSelectWidget} as={'button'} w={'100%'}>
        <Flex alignItems={'center'}>
          <IconComponent stroke={isActive ? 'var(--vg-colors-upgrade-blue-700)' : 'var(--vg-colors-gray-800)'} />
          <Text fontSize={'xs'} ml={2} fontWeight={'medium'} maxW='240' as={'span'} noOfLines={1}>
            {text}
          </Text>
        </Flex>
      </InvalidWidgetItemContainer>
    );
  },
);

import { Flex, Text, Button } from '@chakra-ui/react';
import { memo, ReactElement, useCallback, useEffect } from 'react';
import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { useAppSelector } from '../../../../../store';
import { selectWidget } from '../../../../../store/infographSelector';
import { selectIsActiveWidgetByGroup } from '../../../../../store/widgetSelector';

import { AccessibleElement, WidgetType } from '../../../../../../../types/widget.types';
import { AllWidgetData } from '../../../../../../../widgets/Widget.types';

import { getIconType, getLabel } from '../../../AccessibilityManager.helpers';
import { widgetHasAltText } from '../AlternativeTextChecker.helpers';

import { ReactComponent as ImageIcon } from 'assets/icons/a11ymenu_image.svg';
import { ReactComponent as ShapeIcon } from 'assets/icons/a11ymenu_shape.svg';
import { ReactComponent as LineIcon } from 'assets/icons/a11ymenu_line.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/a11ymenu_arrow.svg';
import { ReactComponent as IconIcon } from 'assets/icons/a11ymenu_icon.svg';
import { ReactComponent as ColumnChartIcon } from 'assets/icons/a11ymenu_column_chart.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/a11ymenu_pie_chart.svg';
import { ReactComponent as LineChartIcon } from 'assets/icons/a11ymenu_line_chart.svg';
import { ReactComponent as BarChartIcon } from 'assets/icons/a11ymenu_bar_chart.svg';
import { ReactComponent as AreaChartIcon } from 'assets/icons/a11ymenu_area_chart.svg';
import { ReactComponent as StackedBarChartIcon } from 'assets/icons/a11ymenu_stackedbar_chart.svg';
import { ReactComponent as StackedColumnChartIcon } from 'assets/icons/a11ymenu_stackedcolumn_chart.svg';
import { ReactComponent as StatDonutIcon } from 'assets/icons/a11ymenu_statdonut.svg';
import { ReactComponent as StatHalfDonutIcon } from 'assets/icons/a11ymenu_stathalfdonut.svg';
import { ReactComponent as StatProgressBarIcon } from 'assets/icons/a11ymenu_statbar.svg';
import { ReactComponent as StatIconIcon } from 'assets/icons/a11ymenu_staticon.svg';
import { AltTextModalTrigger } from '../../../../AltTextModal/AltTextModalTrigger';
import { InvalidWidgetItemContainer } from '../../common/InvalidWidgetItemContainer';
import { StatChartType } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.types';
import { LineWidgetArrowType } from '../../../AccessibilityManager.config';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

interface InvalidWidgetItemProps {
  widgetId: WidgetId;
  pageId: PageId;
  removeInvalidWidgetFromList: (widgetId: WidgetId) => void;
  dispatchSelectWidget: ({ widgetId, pageId }: SelectionTarget) => void;
}

type VisualWidgetType =
  | WidgetType.Icon
  | WidgetType.Image
  | WidgetType.Line
  | LineWidgetArrowType.arrow
  | WidgetType.BasicShape
  | WidgetType.LineChart
  | WidgetType.BarChart
  | WidgetType.PieChart
  | WidgetType.ColumnChart
  | WidgetType.AreaChart
  | WidgetType.StackedAreaChart
  | WidgetType.StackedBarChart
  | WidgetType.StackedColumnChart
  | StatChartType.Donut
  | StatChartType.HalfDonut
  | StatChartType.ProgressBar
  | StatChartType.Icon;

type WidgetIconMapType = Record<
  VisualWidgetType,
  React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined }>
>;

// TODO should use the same WIDGET_ICON_MAP from AccessibilityManager.config file
const WIDGET_ICON_MAP: WidgetIconMapType = {
  [WidgetType.Icon]: IconIcon,
  [WidgetType.Image]: ImageIcon,
  [WidgetType.Line]: LineIcon,
  [LineWidgetArrowType.arrow]: ArrowIcon,
  [WidgetType.BasicShape]: ShapeIcon,
  [WidgetType.LineChart]: LineChartIcon,
  [WidgetType.PieChart]: PieChartIcon,
  [WidgetType.ColumnChart]: ColumnChartIcon,
  [WidgetType.BarChart]: BarChartIcon,
  [WidgetType.AreaChart]: AreaChartIcon,
  [WidgetType.StackedAreaChart]: AreaChartIcon,
  [WidgetType.StackedBarChart]: StackedBarChartIcon,
  [WidgetType.StackedColumnChart]: StackedColumnChartIcon,
  [StatChartType.Donut]: StatDonutIcon,
  [StatChartType.HalfDonut]: StatHalfDonutIcon,
  [StatChartType.ProgressBar]: StatProgressBarIcon,
  [StatChartType.Icon]: StatIconIcon,
};

const ACTIVE_ICON_WITH_FILL: Array<VisualWidgetType> = [
  StatChartType.Donut,
  StatChartType.HalfDonut,
  StatChartType.ProgressBar,
  StatChartType.Icon,
];

interface ModalTriggerProps {
  isActive: boolean;
  onClick?: () => void;
}

const ModalTrigger = ({ isActive, onClick }: ModalTriggerProps) => (
  <Button
    size={'xs'}
    isActive={isActive}
    variant={'a11ymenu-outline'}
    onClick={onClick}
    _hover={{ backgroundColor: 'hover.blue' }}
  >
    Add alt text
  </Button>
);

export const InvalidWidgetItem = memo(
  ({ widgetId, pageId, removeInvalidWidgetFromList, dispatchSelectWidget }: InvalidWidgetItemProps): ReactElement => {
    const widget = useAppSelector(selectWidget(widgetId)) as AccessibleElement;

    const { altText, isDecorative } = widget || {};
    const isActive = useAppSelector(selectIsActiveWidgetByGroup(widgetId));
    const text = widget ? getLabel(widgetId, widget as AllWidgetData) : '';

    const type = widget && (getIconType(widgetId, widget as AllWidgetData) as VisualWidgetType);
    const IconComponent = WIDGET_ICON_MAP[type];

    /**
     * Remove widget from list if it was deleted
     */
    useEffect(() => {
      if (!widget) {
        removeInvalidWidgetFromList(widgetId);
      }
    }, [widget, widgetId, removeInvalidWidgetFromList]);

    // Remove widget from invalid widget list if alt text was set or marked as decorative
    useEffect(() => {
      if (widgetHasAltText(altText, isDecorative)) {
        removeInvalidWidgetFromList(widgetId);
      }
    }, [altText, isDecorative, removeInvalidWidgetFromList, widgetId]);

    /**
     * Selects the given widget
     * Triggered when clicking on a widget item or when opening the alt text modal
     */
    const handleSelectWidget = useCallback(() => {
      dispatchSelectWidget({ widgetId, pageId });
    }, [dispatchSelectWidget, widgetId, pageId]);

    if (!widget) {
      return <></>;
    }

    // TODO: It affect to the line thickness
    // Need to be refactored
    let iconStyle: { stroke?: string; fill?: string } = {
      // stroke: isActive ? 'var(--vg-colors-upgrade-blue-700)' : 'var(--vg-colors-gray-800)',
    };
    if (ACTIVE_ICON_WITH_FILL.includes(type)) {
      iconStyle = { fill: isActive ? 'var(--vg-colors-upgrade-blue-700)' : 'var(--vg-colors-gray-800)' };
    }

    return (
      <InvalidWidgetItemContainer isActive={isActive} onClick={handleSelectWidget}>
        <Flex alignItems={'center'}>
          {IconComponent && <IconComponent {...iconStyle} />}
          <Text fontSize={'xs'} ml={2} fontWeight={'medium'}>
            {text}
          </Text>
        </Flex>
        <AltTextModalTrigger
          trigger={<ModalTrigger isActive={isActive} />}
          widgetId={widgetId}
          onOpen={handleSelectWidget}
          isA11yChecker={true}
        />
      </InvalidWidgetItemContainer>
    );
  },
);

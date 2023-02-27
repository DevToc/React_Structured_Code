import { useAppSelector, RootState } from 'modules/Editor/store';
import { FlexLayout } from 'widgets/ResponsiveWidgets/LayoutComponents';
import { useWidget } from 'widgets/sdk';
import { LabelTextWidgetData } from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';
import { StatChartWidgetData, ComponentWidgetIdKeys } from '../StatChartWidget.types';
import { StatChartProps } from './StatCharts.types';

export const ProgressBarStatChart = ({ getWidgetMemberComponent, isReadOnly = false }: StatChartProps) => {
  const { componentWidgetIdMap, verticalSpacing } = useWidget<StatChartWidgetData>();

  const chartWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.Chart];
  const labelTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];

  const labelTextWidgetValue = useAppSelector(
    (state: RootState) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData)?.value,
  );
  const chartValue = parseFloat(labelTextWidgetValue) || 0;

  const ChartWidget = getWidgetMemberComponent();
  const LabelTextWidget = getWidgetMemberComponent();

  return (
    <FlexLayout direction={'column'} gap={`${verticalSpacing || 0}px`}>
      <LabelTextWidget widgetId={labelTextWidgetId} isReadOnly={isReadOnly} />
      <ChartWidget widgetId={chartWidgetId} customWidgetData={{ value: chartValue }} isReadOnly={isReadOnly} />
    </FlexLayout>
  );
};

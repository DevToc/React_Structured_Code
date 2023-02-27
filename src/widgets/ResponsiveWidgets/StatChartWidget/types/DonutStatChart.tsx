import { useMemo } from 'react';

import { RootState, useAppSelector } from 'modules/Editor/store';
import { selectWidget } from 'modules/Editor/store/infographSelector';
import { ProgressChartWidgetData } from 'widgets/ProgressChartWidget/ProgressChartWidget.types';
import { AbsoluteContainer, FlexLayout } from 'widgets/ResponsiveWidgets/LayoutComponents';
import { useWidget } from 'widgets/sdk';
import { ComponentWidgetIdKeys } from '../StatChartWidget.types';
import { StatChartProps } from './StatCharts.types';
import { StatChartWidgetData } from '../StatChartWidget.types';
import { LabelTextWidgetData } from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';
import { calculateFontSizeFromWidth } from '../StatChartWidget.helpers';
import { selectIsAllFontsLoaded } from 'modules/Editor/store/pageSelector';

const TEXT_WIDTH_CONSTANT = 0.85;
const TEXT_WIDTH_MARGIN = 1.2;

export const DonutStatChart = ({ getWidgetMemberComponent, isReadOnly = false }: StatChartProps) => {
  const { componentWidgetIdMap } = useWidget<StatChartWidgetData>();

  // Need to listen for when the fonts are loaded so that the correct font size is calculated
  const isAllFontsLoaded = useAppSelector(selectIsAllFontsLoaded);

  const chartWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.Chart];
  const labelTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];

  const chartWidgetData = useAppSelector(selectWidget(chartWidgetId)) as ProgressChartWidgetData;
  const chartHeight = Math.min(chartWidgetData.widthPx, chartWidgetData.heightPx);

  const labelTextWidgetStyle = useAppSelector(
    (state: RootState) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData)?.style,
  );
  const labelTextWidgetValue = useAppSelector(
    (state: RootState) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData)?.value,
  );
  const chartValue = parseFloat(labelTextWidgetValue) || 0;

  const ChartWidget = getWidgetMemberComponent();
  const LabelTextWidget = getWidgetMemberComponent();

  // Compute the inner width of the donut
  // width = 2 * sin(theta) * hypotenuse
  // theta = 45deg, hyp = donutSize * chartHeight
  const innerWidth = Math.floor(Math.sin((45 * Math.PI) / 180) * (chartWidgetData.donutSize * chartHeight));

  // Calculate font size to prevent text wrapping of metric text
  const calculatedFontSize = useMemo(
    () =>
      calculateFontSizeFromWidth(
        `${chartValue}%`,
        labelTextWidgetStyle,
        innerWidth / 2,
        innerWidth * TEXT_WIDTH_CONSTANT,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartValue, labelTextWidgetStyle, innerWidth, isAllFontsLoaded],
  );

  return (
    <FlexLayout direction={'column'} justifyContent={'center'} alignItems={'center'} position={'relative'} w={'full'}>
      <ChartWidget widgetId={chartWidgetId} customWidgetData={{ value: chartValue }} isReadOnly={isReadOnly} />
      <AbsoluteContainer top={0} left={0} pointerEvents={'none'}>
        <FlexLayout w={'full'} h={'full'} alignItems={'center'} justifyContent={'center'}>
          <LabelTextWidget
            widgetId={labelTextWidgetId}
            customWidgetData={{
              widthPx: innerWidth * TEXT_WIDTH_MARGIN,
              heightPx: calculatedFontSize,
              style: { ...labelTextWidgetStyle, fontSize: Math.floor(calculatedFontSize) },
            }}
            isReadOnly={isReadOnly}
          />
        </FlexLayout>
      </AbsoluteContainer>
    </FlexLayout>
  );
};

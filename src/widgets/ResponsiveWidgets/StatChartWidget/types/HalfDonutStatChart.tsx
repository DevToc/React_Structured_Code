import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';

import { RootState, useAppSelector } from 'modules/Editor/store';
import { selectWidget } from 'modules/Editor/store/infographSelector';
import { ProgressChartWidgetData } from 'widgets/ProgressChartWidget/ProgressChartWidget.types';
import { FlexLayout, AbsoluteContainer } from 'widgets/ResponsiveWidgets/LayoutComponents';
import { useWidget } from 'widgets/sdk';
import { LabelTextWidgetData } from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';
import { calculateFontSizeFromWidth } from '../StatChartWidget.helpers';
import { StatChartWidgetData, ComponentWidgetIdKeys } from '../StatChartWidget.types';
import { StatChartProps } from './StatCharts.types';
import { selectIsAllFontsLoaded } from 'modules/Editor/store/pageSelector';

const LABEL_TEXT_WIDTH_CONSTANT = 0.8;

export const HalfDonutStatChart = ({ getWidgetMemberComponent, isReadOnly = false }: StatChartProps) => {
  const { componentWidgetIdMap } = useWidget<StatChartWidgetData>();

  // Need to listen for when the fonts are loaded so that the correct font size is calculated
  const isAllFontsLoaded = useAppSelector(selectIsAllFontsLoaded);

  const chartWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.Chart];
  const labelTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];

  const chartWidgetData = useAppSelector(selectWidget(chartWidgetId)) as ProgressChartWidgetData;
  const chartHeight = Math.min(chartWidgetData.widthPx / 2, chartWidgetData.heightPx);

  const labelTextWidgetStyle = useAppSelector(
    (state: RootState) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData)?.style,
  );
  const labelTextWidgetValue = useAppSelector(
    (state: RootState) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData)?.value,
  );
  const chartValue = parseFloat(labelTextWidgetValue) || 0;

  const ChartWidget = getWidgetMemberComponent();
  const LabelTextWidget = getWidgetMemberComponent();

  // Compute inner width of the donut
  // width = 2 * sin(45deg = PI/4) * hypotenuse
  // hypotenuse = donutSize * chartHeight
  // Multiply by 2 because the donutSize refers to radius not diameter
  const innerWidth = 2 * Math.floor(Math.sin(0.25 * Math.PI) * (chartWidgetData.donutSize * chartHeight));

  // Calculate max font size that will prevent text wrapping of metric text widget
  const calculatedFontSize = useMemo(
    () =>
      calculateFontSizeFromWidth(
        `${chartValue}%`,
        labelTextWidgetStyle,
        innerWidth / 2,
        innerWidth * LABEL_TEXT_WIDTH_CONSTANT,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartValue, labelTextWidgetStyle, innerWidth, isAllFontsLoaded],
  );

  // Calculate percentage to translate label text so that it is centered in the donut
  // Use percentage instead of px value so that it scales correctly on resize
  const yTranslatePx = -(innerWidth / 2 - calculatedFontSize) / 2;
  const yTranslatePercent = yTranslatePx > 0 ? 0 : (yTranslatePx / calculatedFontSize) * 100;

  return (
    <FlexLayout direction={'column'} justifyContent={'center'} alignItems={'center'} position={'relative'} w={'full'}>
      <ChartWidget widgetId={chartWidgetId} customWidgetData={{ value: chartValue }} isReadOnly={isReadOnly} />
      <AbsoluteContainer top={0} left={0} pointerEvents={'none'}>
        <FlexLayout w={'full'} h={'full'} flexDirection={'column'} alignItems={'center'} justifyContent={'flex-end'}>
          <Box transform={`translate(0, ${yTranslatePercent}%)`}>
            <LabelTextWidget
              widgetId={labelTextWidgetId}
              customWidgetData={{
                widthPx: innerWidth,
                heightPx: calculatedFontSize,
                style: { ...labelTextWidgetStyle, fontSize: calculatedFontSize },
              }}
              isReadOnly={isReadOnly}
            />
          </Box>
        </FlexLayout>
      </AbsoluteContainer>
    </FlexLayout>
  );
};

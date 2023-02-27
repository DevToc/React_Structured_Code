import { useMemo } from 'react';
import { FlexLayout } from 'widgets/ResponsiveWidgets/LayoutComponents';
import { useAppSelector } from 'modules/Editor/store';
import { useWidget } from 'widgets/sdk';
import { LabelTextWidgetData } from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';
import { selectIsAllFontsLoaded } from 'modules/Editor/store/pageSelector';
import { StatChartWidgetData, ComponentWidgetIdKeys } from '../StatChartWidget.types';
import { calculateFontSizeFromWidth } from '../StatChartWidget.helpers';
import { StatChartProps } from './StatCharts.types';

const TEXT_WIDTH_CONSTANT = 0.85;

export const IconStatChart = ({ getWidgetMemberComponent, isReadOnly = false }: StatChartProps) => {
  const { componentWidgetIdMap } = useWidget<StatChartWidgetData>();

  // Need to listen for when the fonts are loaded so that the correct font size is calculated
  const isAllFontsLoaded = useAppSelector(selectIsAllFontsLoaded);

  const iconGridWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.IconGrid];
  const labelTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];
  const metricTextValue = useAppSelector(
    (state) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData).value,
  );
  const labelTextWidgetStyle = useAppSelector(
    (state) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData)?.style,
  );
  const metricTextValueWidth = useAppSelector((state) => state.infograph.widgets[labelTextWidgetId].widthPx);

  const IconGridWidget = getWidgetMemberComponent();
  const LabelTextWidget = getWidgetMemberComponent();
  const shapeFill = parseFloat(metricTextValue) || 0;

  // Calculate font size to prevent text wrapping of metric text
  const calculatedFontSize = useMemo(
    () =>
      calculateFontSizeFromWidth(
        `${metricTextValue}%`,
        labelTextWidgetStyle,
        metricTextValueWidth,
        metricTextValueWidth * TEXT_WIDTH_CONSTANT,
      ),
    // also run this when fonts are loaded so that the correct font size is calculated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricTextValue, labelTextWidgetStyle, metricTextValueWidth, isAllFontsLoaded],
  );

  return (
    <>
      <FlexLayout alignItems='center' gap={'16px'} h='fit-content' w='fit-content'>
        <LabelTextWidget
          widgetId={labelTextWidgetId}
          isReadOnly={isReadOnly}
          customWidgetData={{
            heightPx: calculatedFontSize,
            style: { ...labelTextWidgetStyle, fontSize: Math.floor(calculatedFontSize) },
          }}
        />
        <FlexLayout gap={'16px'} alignItems='center' w='fit-content'>
          <IconGridWidget customWidgetData={{ shapeFill }} widgetId={iconGridWidgetId} isReadOnly={isReadOnly} />
        </FlexLayout>
      </FlexLayout>
    </>
  );
};

import { WidgetType } from 'types/widget.types';
import { Subset } from 'types/object.types';
import { ProgressChartType, ProgressChartWidgetData } from 'widgets/ProgressChartWidget/ProgressChartWidget.types';
import { generateDefaultData as generateProgressChartData } from 'widgets/ProgressChartWidget/ProgressChartWidget.helpers';
import {
  DEFAULT_BAR_HEIGHT,
  DEFAULT_WIDTH as DEFAULT_DONUT_HEIGHT,
  DEFAULT_HEIGHT as DEFAULT_HALF_DONUT_HEIGHT,
} from 'widgets/ProgressChartWidget/ProgressChartWidget.config';
import { IconWidgetType, IconWidgetData } from 'widgets/IconWidget/IconWidget.types';
import { generateDefaultData as generateIconData } from 'widgets/IconWidget/IconWidget.helpers';
import { generateDefaultData as generateMetricTextData } from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.helpers';
import {
  FontWeightOption,
  LabelTextStyle,
  LabelTextWidgetData,
} from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';
import {
  StatChartType,
  ComponentWidgetIdKeys as StatChartComponentKey,
  StatChartWidgetData,
} from './StatChartWidget.types';
import { VERSION } from './StatChartWidget.upgrade';
import {
  CHART_TYPE_DEFAULT_DIMENSIONS_MAP,
  DEFAULT_VERTICAL_SPACING,
  DEFAULT_PRIMARY_CHART_COLOR,
  DEFAULT_SECONDARY_CHART_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WIDTH_PX,
  DEFAULT_ICON_WIDTH_PX,
  DEFAULT_ICON_HEIGHT_PX,
  DEFAULT_FILL_PERCENTAGE,
  DEFAULT_ICON_ID,
} from './StatChartWidget.config';

/**
 * Helper to calculate the maximum font size that will prevent the `text` from wrapping
 * in a div with the specified `width`
 * Uses canvas context.measureText method to measure width - doesn't actually render
 * the text.
 *
 * @param text text content
 * @param textStyle text style (bold, underline, italic, font-family)
 * @param proposedFontSize
 * @param width Width that text must fit into
 * @returns font size that will prevent the `text` from wrapping in the given `width`
 */
const calculateFontSizeFromWidth = (
  text: string,
  textStyle: LabelTextStyle,
  proposedFontSize: number,
  width: number,
) => {
  const FONT_SIZE_DECREMENT_STEP = 2;
  const { fontFamily, fontWeight, fontStyle } = textStyle;

  const element = document.createElement('canvas');
  const context = element.getContext('2d');
  if (!context) return proposedFontSize;

  context.font = `${fontStyle} normal ${fontWeight} ${proposedFontSize}px ${fontFamily}`;
  let textWidth = context.measureText(text).width;

  if (textWidth <= width) {
    return proposedFontSize;
  }

  let currFontSize = proposedFontSize;
  while (textWidth > width && currFontSize >= FONT_SIZE_DECREMENT_STEP + 1) {
    currFontSize -= FONT_SIZE_DECREMENT_STEP;
    context.font = `${fontStyle} normal ${fontWeight} ${currFontSize}px ${fontFamily}`;
    textWidth = context.measureText(text).width;
  }

  element.remove();

  return currFontSize || proposedFontSize;
};

/**
 * Helper to generate new ProgressChartWidget and MetricTextWidget
 * update data after swapping stat chart types.
 *
 * Returns update data to be passed to updateWidget() fn.
 *
 * @param oldType old chart type
 * @param newType new chart type to swap to
 * @param oldChartData progress chart widget data
 * @param oldIconData icon widget data
 * @returns update data for chart and metric text widgets
 */
const swapChartType = (
  oldType: StatChartType,
  newType: StatChartType,
  oldChartData: ProgressChartWidgetData,
  oldIconData: IconWidgetData,
) => {
  const { widthPx, heightPx } = oldChartData;

  let newChartWidgetData: Subset<ProgressChartWidgetData> = {};
  let newMetricTextWidgetData: Subset<LabelTextWidgetData> = {};
  let newIconWidgetData: Subset<IconWidgetData> = {};
  let newWidgetData: Subset<StatChartWidgetData> = { type: newType };

  // If swapping from icon statchart to another type,
  // reset the size for the new chart type to the default size
  if (oldType === StatChartType.Icon) {
    const statChart = generateDefaultData(newType);
    const [chart, metricText] = statChart.groupWidgets;

    newChartWidgetData = {
      // apply the icon colors as chart colors
      dataColor: oldIconData.shapeColorOne,
      nonDataColor: oldIconData.shapeColorTwo,
      // reset the chart widget size
      barHeight: chart.widgetData.barHeight,
      heightPx: chart.widgetData.heightPx,
      widthPx: chart.widgetData.widthPx,
      type: chart.widgetData.type,
      isHidden: false,
    };

    // reset the text label widget size
    newMetricTextWidgetData = {
      hasFontSizeOption: metricText.widgetData.hasFontSizeOption,
      widthPx: metricText.widgetData.widthPx,
      heightPx: metricText.widgetData.heightPx,
      style: { fontSize: metricText.widgetData.style.fontSize },
      isHidden: false,
    };

    newIconWidgetData = {
      isHidden: true,
    };

    // set size of statchart widget to the same as the default size
    newWidgetData.widthPx = statChart.widgetData.widthPx;
    newWidgetData.heightPx = statChart.widgetData.heightPx;

    return { newChartWidgetData, newMetricTextWidgetData, newIconWidgetData, newWidgetData };
  }

  switch (newType) {
    case StatChartType.Donut: {
      const newChartDimension = Math.max(widthPx, heightPx);
      newChartWidgetData = { widthPx: newChartDimension, heightPx: newChartDimension, type: ProgressChartType.Donut };
      newMetricTextWidgetData = { hasFontSizeOption: false };
      break;
    }
    case StatChartType.HalfDonut: {
      newChartWidgetData = { heightPx: widthPx / 2, type: ProgressChartType.HalfDonut };
      newMetricTextWidgetData = { hasFontSizeOption: false };
      break;
    }
    case StatChartType.ProgressBar: {
      // Reset bar height to default of bar height
      const ratio =
        oldType === StatChartType.Donut
          ? DEFAULT_BAR_HEIGHT / DEFAULT_DONUT_HEIGHT
          : DEFAULT_BAR_HEIGHT / DEFAULT_HALF_DONUT_HEIGHT;

      newChartWidgetData = {
        barHeight: DEFAULT_BAR_HEIGHT,
        heightPx: heightPx * ratio,
        type: ProgressChartType.Bar,
      };

      newMetricTextWidgetData = { widthPx, hasFontSizeOption: true };
      break;
    }
    case StatChartType.Icon: {
      const statChart = generateDefaultData(newType);
      const [, , gridIcon] = statChart.groupWidgets;

      // apply the chart colors as icon colors
      newIconWidgetData = {
        shapeColorOne: oldChartData.dataColor,
        shapeColorTwo: oldChartData.nonDataColor,
        // reset the rest of the icon to default
        widthPx: gridIcon.widgetData.widthPx,
        heightPx: gridIcon.widgetData.heightPx,
        numberOfIcons: gridIcon.widgetData.numberOfIcons,
        iconId: gridIcon.widgetData.iconId,
        gridItemWidthPx: gridIcon.widgetData.gridItemWidthPx,
        gridItemHeightPx: gridIcon.widgetData.gridItemHeightPx,
        gridGapPx: gridIcon.widgetData.gridGapPx,
        isHidden: false,
      };

      // update to default size for text
      newMetricTextWidgetData = {
        hasFontSizeOption: false,
        widthPx: DEFAULT_FONT_WIDTH_PX,
        heightPx: DEFAULT_FONT_SIZE,
        style: { fontSize: DEFAULT_FONT_SIZE },
        isHidden: false,
      };

      newChartWidgetData = {
        isHidden: true,
      };

      // set size of statchart widget to the same as the default size
      const { widthPx: newWidthPx, heightPx: newHeightPx } = CHART_TYPE_DEFAULT_DIMENSIONS_MAP[newType].widgetDimension;
      newWidgetData.widthPx = newWidthPx;
      newWidgetData.heightPx = newHeightPx;
    }
  }

  return { newChartWidgetData, newMetricTextWidgetData, newIconWidgetData, newWidgetData };
};

const generateDefaultData = (type: StatChartType) => {
  let progressChartWidgetType = ProgressChartType.Donut;
  switch (type) {
    case StatChartType.HalfDonut:
      progressChartWidgetType = ProgressChartType.HalfDonut;
      break;
    case StatChartType.ProgressBar:
      progressChartWidgetType = ProgressChartType.Bar;
      break;
    default:
      break;
  }

  const { widthPx, heightPx } = CHART_TYPE_DEFAULT_DIMENSIONS_MAP[type].widgetDimension;
  const isProgressBar = type === StatChartType.ProgressBar;

  return {
    version: VERSION,
    widgetType: WidgetType.StatChart,
    widgetData: {
      widthPx,
      heightPx,
      topPx: 200,
      leftPx: 200,
      rotateDeg: 0,
      version: VERSION,

      memberWidgetIds: [],
      componentWidgetIdMap: {},

      altText: '',
      isDecorative: false,
      // stat chart data
      type,
      verticalSpacing: DEFAULT_VERTICAL_SPACING,
    },
    groupWidgets: [
      {
        // Progress chart
        ...generateProgressChartData(progressChartWidgetType, { isHidden: type === StatChartType.Icon }),
        componentKey: StatChartComponentKey.Chart,
      },
      {
        // Metric Text Widget
        ...generateMetricTextData({
          styleOptions: {
            fontFamily: 'Inter',
            fontSize: DEFAULT_FONT_SIZE,
            color: DEFAULT_PRIMARY_CHART_COLOR,
            fontWeight: FontWeightOption.Bold,
          },
          metricOptions: {
            value: `${DEFAULT_FILL_PERCENTAGE}`,
            suffix: '%',
            isNumeric: true,
            hasFontSizeOption: isProgressBar,
            widthPx: DEFAULT_FONT_WIDTH_PX,
            heightPx: DEFAULT_FONT_SIZE,
          },
        }),
        componentKey: StatChartComponentKey.MetricText,
      },
      {
        // Grid Icon widget
        ...generateIconData(DEFAULT_ICON_ID, '', undefined, undefined, {
          widthPx: DEFAULT_ICON_WIDTH_PX,
          heightPx: DEFAULT_ICON_HEIGHT_PX,
          shapeFill: DEFAULT_FILL_PERCENTAGE,
          shapeColorOne: DEFAULT_PRIMARY_CHART_COLOR,
          shapeColorTwo: DEFAULT_SECONDARY_CHART_COLOR,
          type: IconWidgetType.Grid,
          isHidden: type !== StatChartType.Icon,
        }),
        componentKey: StatChartComponentKey.IconGrid,
      },
    ],
    isResponsiveGroup: true,
  };
};

export { calculateFontSizeFromWidth, swapChartType, generateDefaultData };

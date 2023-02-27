import { generateDefaultData as generateProgressChartData } from 'widgets/ProgressChartWidget/ProgressChartWidget.helpers';
import { ProgressChartType } from 'widgets/ProgressChartWidget/ProgressChartWidget.types';
import { generateDefaultData as generateIconData } from 'widgets/IconWidget/IconWidget.helpers';
import { IconWidgetType } from 'widgets/IconWidget/IconWidget.types';
import { swapChartType } from '../StatChartWidget.helpers';
import { StatChartType } from '../StatChartWidget.types';
import {
  DEFAULT_ICON_WIDTH_PX,
  DEFAULT_ICON_HEIGHT_PX,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WIDTH_PX,
  DEFAULT_ICON_GAP,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_ID,
  DEFAULT_ICON_NUMBER,
} from '../StatChartWidget.config';

const DEFAULT_WIDTH = DEFAULT_FONT_WIDTH_PX;
const DEFAULT_TEXT_LABEL_DATA = {
  hasFontSizeOption: false,
  widthPx: DEFAULT_WIDTH,
  heightPx: DEFAULT_FONT_SIZE,
  style: { fontSize: DEFAULT_FONT_SIZE },
  isHidden: false,
};

const DEFAULT_PROGRESS_BAR_DATA = {
  ...generateProgressChartData(ProgressChartType.Bar).widgetData,
  widthPx: DEFAULT_WIDTH,
  heightPx: 12,
  barHeight: 12,
};
const DEFAULT_DONUT_DATA = {
  ...generateProgressChartData(ProgressChartType.Donut).widgetData,
  widthPx: DEFAULT_WIDTH,
  heightPx: DEFAULT_WIDTH,
  donutSize: 0.85,
};
const DEFAULT_HALF_DONUT_DATA = {
  ...generateProgressChartData(ProgressChartType.HalfDonut).widgetData,
  widthPx: DEFAULT_WIDTH,
  heightPx: DEFAULT_WIDTH / 2,
  donutSize: 0.85,
};
const DEFAULT_GRID_ICON_DATA = {
  ...generateIconData(DEFAULT_ICON_ID, '', undefined, undefined, {
    widthPx: 550,
    heightPx: 42,
    shapeFill: 67,
    shapeColorOne: 'blue',
    shapeColorTwo: 'red',
    type: IconWidgetType.Grid,
  }).widgetData,
};

describe('ResponsiveWidgets/StatChartWidget/StatChartWidget.helpers', () => {
  describe('swapChartData', () => {
    test('should swap to donut correctly', () => {
      // Chart width + height should be updated to have 1:1 scale
      // Metric text - should have font size option disabled
      const expectedNewChartData = {
        widthPx: DEFAULT_WIDTH,
        heightPx: DEFAULT_WIDTH,
        type: ProgressChartType.Donut,
      };
      const expectedNewMetricTextData = { hasFontSizeOption: false };

      // Swap half-donut > donut
      const halfDonutResult = swapChartType(
        StatChartType.HalfDonut,
        StatChartType.Donut,
        DEFAULT_HALF_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(halfDonutResult.newChartWidgetData).toEqual(expectedNewChartData);
      expect(halfDonutResult.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // Swap progress bar > donut
      const progressBarResult = swapChartType(
        StatChartType.ProgressBar,
        StatChartType.Donut,
        DEFAULT_PROGRESS_BAR_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(progressBarResult.newChartWidgetData).toEqual(expectedNewChartData);
      expect(progressBarResult.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // Swap icon > donut
      const expectedIconTextData = DEFAULT_TEXT_LABEL_DATA;
      const iconResult = swapChartType(
        StatChartType.Icon,
        StatChartType.Donut,
        DEFAULT_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );

      expect(iconResult.newChartWidgetData).toEqual({
        widthPx: DEFAULT_DONUT_DATA.widthPx,
        heightPx: DEFAULT_DONUT_DATA.heightPx,
        barHeight: DEFAULT_DONUT_DATA.barHeight,
        type: DEFAULT_DONUT_DATA.type,
        dataColor: DEFAULT_GRID_ICON_DATA.shapeColorOne,
        nonDataColor: DEFAULT_GRID_ICON_DATA.shapeColorTwo,
        isHidden: false,
      });
      expect(iconResult.newMetricTextWidgetData).toEqual(expectedIconTextData);
      expect(iconResult.newIconWidgetData).toEqual({ isHidden: true });
    });

    test('should swap to half-donut correctly', () => {
      // Chart height should be half of width
      // Metric text - should have font size option disabled
      const expectedNewChartData = {
        heightPx: DEFAULT_WIDTH / 2,
        type: ProgressChartType.HalfDonut,
      };
      const expectedNewMetricTextData = { hasFontSizeOption: false };

      // swap donut > half-donut
      const donutResult = swapChartType(
        StatChartType.Donut,
        StatChartType.HalfDonut,
        DEFAULT_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(donutResult.newChartWidgetData).toEqual(expectedNewChartData);
      expect(donutResult.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // swap progress bar > half-donut
      const progressBarResult = swapChartType(
        StatChartType.ProgressBar,
        StatChartType.HalfDonut,
        DEFAULT_PROGRESS_BAR_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(progressBarResult.newChartWidgetData).toEqual(expectedNewChartData);
      expect(progressBarResult.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // Swap icon > half-donut
      const expectedIconTextData = DEFAULT_TEXT_LABEL_DATA;
      const iconResult = swapChartType(
        StatChartType.Icon,
        StatChartType.HalfDonut,
        DEFAULT_HALF_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );

      expect(iconResult.newChartWidgetData).toEqual({
        widthPx: DEFAULT_HALF_DONUT_DATA.widthPx,
        heightPx: DEFAULT_HALF_DONUT_DATA.heightPx,
        barHeight: DEFAULT_HALF_DONUT_DATA.barHeight,
        type: DEFAULT_HALF_DONUT_DATA.type,
        dataColor: DEFAULT_GRID_ICON_DATA.shapeColorOne,
        nonDataColor: DEFAULT_GRID_ICON_DATA.shapeColorTwo,
        isHidden: false,
      });
      expect(iconResult.newMetricTextWidgetData).toEqual(expectedIconTextData);
    });

    test('should swap to progress bar correctly', () => {
      // Chart height should be half of width
      // Metric text - should have font size option enabled and should take up width
      const expectedNewChartData = {
        heightPx: 12,
        barHeight: 12,
        type: ProgressChartType.Bar,
      };
      const expectedNewMetricTextData = { hasFontSizeOption: true, widthPx: DEFAULT_WIDTH };

      // swap donut > half-donut
      const donutResult = swapChartType(
        StatChartType.Donut,
        StatChartType.ProgressBar,
        DEFAULT_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(donutResult.newChartWidgetData).toEqual(expectedNewChartData);
      expect(donutResult.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // swap progress bar > half-donut
      const halfDonutResult = swapChartType(
        StatChartType.HalfDonut,
        StatChartType.ProgressBar,
        DEFAULT_HALF_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(halfDonutResult.newChartWidgetData).toEqual(expectedNewChartData);
      expect(halfDonutResult.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // Swap icon > progress
      const expectedIconTextData = { ...DEFAULT_TEXT_LABEL_DATA, hasFontSizeOption: true };
      const iconResult = swapChartType(
        StatChartType.Icon,
        StatChartType.ProgressBar,
        DEFAULT_PROGRESS_BAR_DATA,
        DEFAULT_GRID_ICON_DATA,
      );

      expect(iconResult.newChartWidgetData).toEqual({
        widthPx: DEFAULT_PROGRESS_BAR_DATA.widthPx,
        heightPx: DEFAULT_PROGRESS_BAR_DATA.heightPx,
        barHeight: DEFAULT_PROGRESS_BAR_DATA.barHeight,
        type: DEFAULT_PROGRESS_BAR_DATA.type,
        dataColor: DEFAULT_GRID_ICON_DATA.shapeColorOne,
        nonDataColor: DEFAULT_GRID_ICON_DATA.shapeColorTwo,
        isHidden: false,
      });
      expect(iconResult.newMetricTextWidgetData).toEqual(expectedIconTextData);
    });

    test('should swap to icon correctly', () => {
      // should reset to default icon data dimensions
      // should set icon colors from chart colors
      const expectedNewMetricTextData = DEFAULT_TEXT_LABEL_DATA;

      // swap donut > icon
      const iconResultDonut = swapChartType(
        StatChartType.Donut,
        StatChartType.Icon,
        DEFAULT_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(iconResultDonut.newIconWidgetData).toEqual({
        shapeColorOne: DEFAULT_DONUT_DATA.dataColor,
        shapeColorTwo: DEFAULT_DONUT_DATA.nonDataColor,
        widthPx: DEFAULT_ICON_WIDTH_PX,
        heightPx: DEFAULT_ICON_HEIGHT_PX,
        gridGapPx: DEFAULT_ICON_GAP,
        gridItemHeightPx: DEFAULT_ICON_SIZE,
        gridItemWidthPx: DEFAULT_ICON_SIZE,
        numberOfIcons: DEFAULT_ICON_NUMBER,
        iconId: DEFAULT_ICON_ID,
        isHidden: false,
      });
      expect(iconResultDonut.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);
      expect(iconResultDonut.newChartWidgetData).toEqual({ isHidden: true });

      // swap progress bar > icon
      const iconResultProgressBar = swapChartType(
        StatChartType.ProgressBar,
        StatChartType.Icon,
        DEFAULT_PROGRESS_BAR_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(iconResultProgressBar.newIconWidgetData).toEqual({
        shapeColorOne: DEFAULT_PROGRESS_BAR_DATA.dataColor,
        shapeColorTwo: DEFAULT_PROGRESS_BAR_DATA.nonDataColor,
        widthPx: DEFAULT_ICON_WIDTH_PX,
        heightPx: DEFAULT_ICON_HEIGHT_PX,
        gridGapPx: DEFAULT_ICON_GAP,
        gridItemHeightPx: DEFAULT_ICON_SIZE,
        gridItemWidthPx: DEFAULT_ICON_SIZE,
        numberOfIcons: DEFAULT_ICON_NUMBER,
        iconId: DEFAULT_ICON_ID,
        isHidden: false,
      });
      expect(iconResultProgressBar.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);

      // swap progress half donut > icon
      const iconResultHalfDonut = swapChartType(
        StatChartType.HalfDonut,
        StatChartType.Icon,
        DEFAULT_HALF_DONUT_DATA,
        DEFAULT_GRID_ICON_DATA,
      );
      expect(iconResultHalfDonut.newIconWidgetData).toEqual({
        shapeColorOne: DEFAULT_HALF_DONUT_DATA.dataColor,
        shapeColorTwo: DEFAULT_HALF_DONUT_DATA.nonDataColor,
        widthPx: DEFAULT_ICON_WIDTH_PX,
        heightPx: DEFAULT_ICON_HEIGHT_PX,
        gridGapPx: DEFAULT_ICON_GAP,
        gridItemHeightPx: DEFAULT_ICON_SIZE,
        gridItemWidthPx: DEFAULT_ICON_SIZE,
        numberOfIcons: DEFAULT_ICON_NUMBER,
        iconId: DEFAULT_ICON_ID,
        isHidden: false,
      });
      expect(iconResultHalfDonut.newMetricTextWidgetData).toEqual(expectedNewMetricTextData);
    });
  });
});

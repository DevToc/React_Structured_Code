import { PageId } from '../../../../../../../types/idTypes';
import { WidgetType } from '../../../../../../../types/widget.types';

import { generateDefaultData as generateImgWidgetData } from '../../../../../../../widgets/ImageWidget/ImageWidget.helpers';
import { generateDefaultData as generateIconWidgetData } from '../../../../../../../widgets/IconWidget/IconWidget.helpers';
import { generateDefaultData as generateLineWidgetData } from '../../../../../../../widgets/LineWidget/LineWidget.helpers';
import { generateDefaultData as generateShapeWidgetData } from '../../../../../../../widgets/BasicShapeWidget/BasicShapeWidget.helpers';
import { generateDefaultData as generateLineChartWidgetData } from '../../../../../../../widgets/ChartWidgets/LineChartWidget/LineChartWidget.helpers';
import { generateDefaultData as generatePieWidgetData } from '../../../../../../../widgets/ChartWidgets/PieChartWidget/PieChartWidget.helpers';
import { generateDefaultData as generateColumnChartWidgetData } from '../../../../../../../widgets/ChartWidgets/ColumnChartWidget/ColumnChartWidget.helpers';
import { generateDefaultData as generateBarChartWidgetData } from '../../../../../../../widgets/ChartWidgets/BarChartWidget/BarChartWidget.helpers';

import { generateWidgetId } from '../../../../../../../widgets/Widget.helpers';
import { BasicShapeType } from '../../../../../../../widgets/BasicShapeWidget/BasicShapeWidget.types';
import { PageToWidgetsMap } from '../../../../../../../types/infographTypes';

import { checkAltText } from '../AlternativeTextChecker.helpers';

type GeneratePageToWidgetMapParams = {
  altText?: string;
  isDecorative?: boolean;
};
const DEFAULT_PAGE_ID = 'PAGE_ID' as PageId;

/**
 * Generate a page to widget map containing only visual widgets that can have alt text.
 * Adds altText and isDecorative properties to the widget data based on the options param.
 *
 * @param options
 * @returns PageToWidgetsMap
 */
const generatePageToWidgetMap = (options?: GeneratePageToWidgetMapParams): PageToWidgetsMap => {
  const DEFAULT_DIMENSION = { width: 10, height: 10 };
  return {
    [DEFAULT_PAGE_ID]: [
      {
        widgetId: generateWidgetId(WidgetType.Image),
        widgetData: {
          ...generateImgWidgetData('src', DEFAULT_DIMENSION, DEFAULT_DIMENSION).widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.Icon),
        widgetData: {
          ...generateIconWidgetData('ICON_ID').widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.Line),
        widgetData: {
          ...generateLineWidgetData('straight').widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.BasicShape),
        widgetData: {
          ...generateShapeWidgetData(BasicShapeType.Rectangle).widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.LineChart),
        widgetData: {
          ...generateLineChartWidgetData().widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.PieChart),
        widgetData: {
          ...generatePieWidgetData().widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.ColumnChart),
        widgetData: {
          ...generateColumnChartWidgetData().widgetData,
          ...options,
        },
      },
      {
        widgetId: generateWidgetId(WidgetType.BarChart),
        widgetData: {
          ...generateBarChartWidgetData().widgetData,
          ...options,
        },
      },
    ],
  };
};

describe('AccessibilityManager/AlternativeTextChecker/AlternativeTextChecker.helpers', () => {
  it('should pass for widgets with alt text', () => {
    const pageToWidgetMap = generatePageToWidgetMap({ altText: 'Alt Text' });

    const result = checkAltText(pageToWidgetMap);
    expect(result).toHaveLength(0);
  });

  it('should pass for decorative widgets', () => {
    const pageToWidgetMap = generatePageToWidgetMap({ isDecorative: true });

    const result = checkAltText(pageToWidgetMap);
    expect(result).toHaveLength(0);
  });

  it('should fail for non-decorative widgets without alt text', () => {
    const pageToWidgetMap = generatePageToWidgetMap({ altText: '', isDecorative: false });
    const invalidWidgets = pageToWidgetMap[DEFAULT_PAGE_ID].map(({ widgetId }) => widgetId);

    const result = checkAltText(pageToWidgetMap);

    // Expect all widgets in pageToWidgetMap to be invalid
    expect(result).toEqual(
      expect.arrayContaining(invalidWidgets.map((widgetId) => expect.objectContaining({ widgetId }))),
    );
  });
});

import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { PageToWidgetsMap } from '../../../../../../../types/infographTypes';
import { WidgetType } from '../../../../../../../types/widget.types';
import { generateDefaultData } from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { TextWidgetData } from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { generateWidgetId } from '../../../../../../../widgets/Widget.helpers';
import { generatePageId } from '../../../../../store/pageControlSlice';
import { InvalidWidgetList } from '../../../AccessibilityManager.types';
import { checkLinks } from '../LinkChecker.helper';

describe('AccessibilityManager/LinkChecker/LinkChecker.helpers', () => {
  const widgetId = generateWidgetId(WidgetType.Text) as WidgetId;
  const pageId = generatePageId() as PageId;

  it('should return an empty array if no widget has link', () => {
    const testData = { widgetId, ...generateDefaultData('paragraph', 'text without link') }
      .widgetData as TextWidgetData;
    const pageToWidgetsMap = { [pageId as PageId]: [{ widgetId, widgetData: testData }] } as PageToWidgetsMap;
    const expectedData: InvalidWidgetList = [];

    const result = checkLinks(pageToWidgetsMap);
    expect(result).toEqual(expectedData);
  });

  it('should return an array with 1 widget if widget has link', () => {
    const testData = { widgetId, ...generateDefaultData('paragraph', 'text with link', true) }
      .widgetData as TextWidgetData;
    const pageToWidgetsMap = { [pageId as PageId]: [{ widgetId, widgetData: testData }] } as PageToWidgetsMap;
    const expectedData: InvalidWidgetList = [{ widgetId, pageId }];

    const result = checkLinks(pageToWidgetsMap);
    expect(result).toEqual(expectedData);
  });
});

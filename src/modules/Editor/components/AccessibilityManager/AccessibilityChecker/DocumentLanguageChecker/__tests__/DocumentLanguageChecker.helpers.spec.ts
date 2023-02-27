import { PageId, WidgetId } from 'types/idTypes';
import { PageToWidgetsMap } from 'types/infographTypes';
import { WidgetType } from 'types/widget.types';
import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { generateDefaultData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { generateWidgetId } from 'widgets/Widget.helpers';
import { generatePageId } from 'modules/Editor/store/pageControlSlice';
import { getDocumentTextContent } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/DocumentLanguageChecker/DocumentLanguageChecker.helpers';

describe('AccessibilityManager/DocumentLanguageChecker/DocumentLanguageChecker.helpers', () => {
  const widgetId = generateWidgetId(WidgetType.Text) as WidgetId;
  const pageId = generatePageId() as PageId;
  const text = 'Sample text in a text widget';
  const testData = { widgetId, ...generateDefaultData('paragraph', text) }.widgetData as TextWidgetData;
  const pageToWidgetsMap = { [pageId as PageId]: [{ widgetId, widgetData: testData }] } as PageToWidgetsMap;

  it('should return text content from giving document', () => {
    expect(getDocumentTextContent(pageToWidgetsMap)).toHaveLength(text.length);
  });

  it('should return text content with limit text length', () => {
    const limit = 10;
    expect(getDocumentTextContent(pageToWidgetsMap, limit)).toHaveLength(limit);
  });
});

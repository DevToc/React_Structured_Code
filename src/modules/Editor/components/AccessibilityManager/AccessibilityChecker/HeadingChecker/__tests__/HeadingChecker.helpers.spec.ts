import { AllWidgetData } from '../../../../../../../widgets/Widget.types';
import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { WidgetType } from '../../../../../../../types/widget.types';

import { checkWidgets } from '../HeadingChecker.helpers';
import { HEADING_TEXT_WIDGET_DATA } from './mockData';
import { generateWidgetId } from '../../../../../../../widgets/Widget.helpers';

type WidgetData = {
  widgetId: WidgetId;
  widgetData: AllWidgetData;
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

describe('AccessibilityManager/HeadingChecker/HeadingChecker.helpers', () => {
  it('should pass for valid order', () => {
    const widgets: WidgetData[] = [];
    const pageId = 'PAGE_ID' as PageId;

    /**
     * Create a list of text widgets with heading levels H1 -> H6,
     * incrementing by 1 level each time.
     */
    for (let i = 1 as HeadingLevel; i <= 6; i++) {
      const widget = {
        widgetId: generateWidgetId(WidgetType.Text),
        widgetData: HEADING_TEXT_WIDGET_DATA[i],
      };

      // Test 2 of the same level shouldn't fail
      widgets.push(widget, widget);
    }

    const { invalidWidgets: result } = checkWidgets(pageId, widgets);
    expect(result).toHaveLength(0);
  });

  it('should fail when skipping heading levels', () => {
    const widgets: WidgetData[] = [];
    const invalidWidgets: WidgetId[] = [];
    const pageId = 'PAGE_ID' as PageId;

    /**
     * Starting from H2 -> H6, skip one level
     * Push 2 of the same level at once - second widget should be valid.
     */
    for (let i = 2 as HeadingLevel; i <= 6; i += 2) {
      const widgetId = generateWidgetId(WidgetType.Text);
      const widget = {
        widgetId,
        widgetData: HEADING_TEXT_WIDGET_DATA[i],
      };

      widgets.push(widget, { ...widget, widgetId: `${widgetId}-V2` });
      invalidWidgets.push(widgetId);
    }

    const { invalidWidgets: result } = checkWidgets(pageId, widgets);

    // Check result - all entries in invalidWidgets should be in result
    expect(result).toEqual(
      expect.arrayContaining(invalidWidgets.map((widgetId) => expect.objectContaining({ widgetId }))),
    );
  });
});

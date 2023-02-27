import { WidgetType } from 'types/widget.types';
import { AddWidget } from '../infographSlice';
import { parseWidgetData } from '../store.helpers';

describe('store/store.helpers.ts', () => {
  describe('parseWidgetData', () => {
    test('should parse widget correctly', () => {
      const newWidgetData = {
        widgetType: '001',
        widgetData: {
          topPx: 248.33333333333337,
          leftPx: 265,
          widthPx: 350,
          heightPx: 331,
          rotateDeg: 0,
        },
      };
      const pageId = 'page-1';

      const [newWidgetIds, addWidgets] = parseWidgetData(newWidgetData, pageId);

      expect(newWidgetIds.length).toEqual(1);
      expect(addWidgets.pageId).toEqual(pageId);
      expect(!!addWidgets.widgetId).toEqual(true);
    });
    test('should parse array of widgets correctly', () => {
      const newWidgetData = [
        {
          widgetType: '001',
          widgetData: {
            topPx: 248.33333333333337,
            leftPx: 265,
            widthPx: 350,
            heightPx: 331,
            rotateDeg: 0,
          },
        },
        {
          widgetType: '001',
          widgetData: {
            topPx: 248.33333333333337,
            leftPx: 265,
            widthPx: 350,
            heightPx: 331,
            rotateDeg: 0,
          },
        },
        {
          widgetType: '001',
          widgetData: {
            topPx: 248.33333333333337,
            leftPx: 265,
            widthPx: 350,
            heightPx: 331,
            rotateDeg: 0,
          },
        },
      ];
      const pageId = 'page-1';

      const [newWidgetIds, addWidgets] = parseWidgetData(newWidgetData, pageId);

      expect(newWidgetIds.length).toEqual(newWidgetData.length);
      expect(addWidgets.length).toEqual(newWidgetData.length);
      expect(addWidgets[0].pageId).toEqual(pageId);
      expect(!!addWidgets[0].widgetId).toEqual(true);
    });
  });
  test('should parse group widget correctly', () => {
    const newWidgetData = {
      widgetType: WidgetType.Group,
      widgetData: {
        topPx: 0,
        leftPx: 0,
        widthPx: 300,
        heightPx: 300,
        rotateDeg: 0,
      },
      groupWidgets: [
        {
          widgetType: '001',
          widgetData: {
            topPx: 248.33333333333337,
            leftPx: 265,
            widthPx: 350,
            heightPx: 331,
            rotateDeg: 0,
          },
        },
      ],
    };
    const pageId = 'page-1';
    const [newWidgetIds, addWidgets] = parseWidgetData(newWidgetData, pageId);

    expect(newWidgetIds.length).toEqual(1);
    expect(addWidgets.pageId).toEqual(pageId);
    expect(!!addWidgets.widgetId).toEqual(true);

    expect(Array.isArray(addWidgets.widgetData.memberWidgetIds)).toEqual(true);
    expect(addWidgets.widgetData.memberWidgetIds.length).toEqual(1);

    expect(Array.isArray(addWidgets.groupWidgets)).toEqual(true);
    expect(addWidgets.groupWidgets.length).toEqual(1);

    expect(addWidgets.isResponsiveGroup).toBeFalsy();
  });
  test('should parse responsive widget correctly', () => {
    const newWidgetData = {
      widgetType: WidgetType.StatChart,
      widgetData: {
        topPx: 0,
        leftPx: 0,
        widthPx: 300,
        heightPx: 300,
        rotateDeg: 0,
      },
      groupWidgets: [
        {
          widgetType: '001',
          widgetData: {
            topPx: 248.33333333333337,
            leftPx: 265,
            widthPx: 350,
            heightPx: 331,
            rotateDeg: 0,
          },
        },
      ],
      isResponsiveGroup: true,
    };
    const pageId = 'page-1';
    const [newWidgetIds, addWidgets] = parseWidgetData(newWidgetData, pageId);

    expect(newWidgetIds.length).toEqual(1);
    expect(addWidgets.pageId).toEqual(pageId);
    expect(!!addWidgets.widgetId).toEqual(true);

    expect(!!addWidgets.widgetData.memberWidgetIds).toEqual(true);
    expect(addWidgets.widgetData.memberWidgetIds.length).toEqual(1);

    expect(!!addWidgets.widgetData.componentWidgetIdMap).toEqual(true);

    expect(!!addWidgets.groupWidgets).toEqual(true);
    expect(addWidgets.groupWidgets.length).toEqual(1);

    expect(addWidgets.isResponsiveGroup).toEqual(true);
  });
  test('should parse group widget with responsive widget correctly', () => {
    const newWidgetData = {
      widgetType: WidgetType.Group,
      widgetData: {
        topPx: 0,
        leftPx: 0,
        widthPx: 300,
        heightPx: 300,
        rotateDeg: 0,
      },
      groupWidgets: [
        {
          widgetType: WidgetType.StatChart,
          widgetData: {
            topPx: 248.33333333333337,
            leftPx: 265,
            widthPx: 350,
            heightPx: 331,
            rotateDeg: 0,
          },
          groupWidgets: [
            {
              widgetType: WidgetType.StatChart,
              widgetData: {
                topPx: 0,
                leftPx: 0,
                widthPx: 300,
                heightPx: 300,
                rotateDeg: 0,
              },
            },
          ],
          isResponsiveGroup: true,
        },
      ],
    };
    const pageId = 'page-1';
    const [newWidgetIds, addWidgets] = parseWidgetData(newWidgetData, pageId);

    const { widgetData } = addWidgets as AddWidget;

    expect(newWidgetIds.length).toEqual(1);
    expect(addWidgets.pageId).toEqual(pageId);
    expect(!!addWidgets.widgetId).toEqual(true);

    expect(!!widgetData.memberWidgetIds).toEqual(true);
    expect(widgetData.memberWidgetIds.length).toEqual(1);

    expect(!!addWidgets.groupWidgets).toEqual(true);
    expect(addWidgets.groupWidgets.length).toEqual(1);

    // Responsive widget should have memberWidgetIds and componentWidgetIdMap set
    const responsiveWidgetData = addWidgets.groupWidgets[0].widgetData;
    expect(!!responsiveWidgetData.memberWidgetIds).toEqual(true);
    expect(!!responsiveWidgetData.componentWidgetIdMap).toEqual(true);

    // Verify responsive widget members are present
    const responsiveWidgetMembers = addWidgets.groupWidgets[0].groupWidgets;
    expect(!!responsiveWidgetMembers).toEqual(true);
    expect(responsiveWidgetMembers.length).toEqual(1);
    expect(!!responsiveWidgetMembers[0].widgetData).toEqual(true);
  });
});

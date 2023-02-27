import { WidgetType } from '../../types/widget.types';
import {
  getAllPageWidgetIds,
  removeDeletedWidgets,
  isAutoHeightWidget,
  getPageWidgetIdsToRender,
} from '../Widget.helpers';

describe('Widget.helpers', () => {
  it('getAllPageWidgetIds should return all widget id', () => {
    const mockInfograph = {
      pages: {
        page1: { widgetLayerOrder: ['widget1', 'widget2'] },
        page2: { widgetLayerOrder: ['widget3'] },
      },
      widgets: {
        widget1: {},
        widget2: {},
        widget3: {},
      },
    };

    expect(getAllPageWidgetIds(mockInfograph)).toEqual(['widget1', 'widget2', 'widget3']);
  });

  it('getAllPageWidgetIds should not return widgets that are not used on any page', () => {
    const mockInfograph = {
      pages: {
        page1: { widgetLayerOrder: [] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {
        widget1: {},
        widget2: {},
        widget3: {},
      },
    };

    expect(getAllPageWidgetIds(mockInfograph)).toEqual([]);
  });

  it('getAllPageWidgetIds should return group widgets as well', () => {
    const mockGroupId = `${WidgetType.Group}-1`;
    const mockResponsiveGroupId = `${WidgetType.StatChart}-1`;
    const mockInfograph = {
      pages: {
        page1: { widgetLayerOrder: [mockGroupId, mockResponsiveGroupId, 'widget3'] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {
        [mockGroupId]: { memberWidgetIds: ['widget1', 'widget2'] },
        [mockResponsiveGroupId]: { memberWidgetIds: ['widget4'] },
        widget1: {},
        widget2: {},
        widget3: {},
        widget4: {},
      },
    };

    expect(getAllPageWidgetIds(mockInfograph)).toEqual([
      'widget1',
      'widget2',
      mockGroupId,
      'widget4',
      mockResponsiveGroupId,
      'widget3',
    ]);
  });

  it('getPageWidgetIdsToRender should return all widgets', () => {
    const mockPage = {
      widgetLayerOrder: ['widget1', 'widget2'],
      background: '',
      widgetStructureTree: ['div', {}, ['widget1', 'widget2']],
    };
    const mockWidgets = {
      widget1: {},
      widget2: {},
      widget3: {},
    };

    expect(getPageWidgetIdsToRender(mockPage, mockWidgets)).toEqual(['widget1', 'widget2']);
  });

  it('getPageWidgetIdsToRender should only include group widget members', () => {
    const mockGroupId = `${WidgetType.Group}-1`;
    const mockPage = {
      widgetLayerOrder: [mockGroupId, 'widget1', 'widget2'],
      background: '',
      widgetStructureTree: ['div', {}, ['widget1', 'widget2']],
    };
    const mockWidgets = {
      [mockGroupId]: { memberWidgetIds: ['widget3'] },
      widget1: {},
      widget2: {},
      widget3: {},
    };

    expect(getPageWidgetIdsToRender(mockPage, mockWidgets)).toEqual(['widget3', 'widget1', 'widget2']);
  });

  it('getPageWidgetIdsToRender should only include responsive widget, not its members', () => {
    const mockResponsiveGroupId = `${WidgetType.StatChart}-1`;
    const mockPage = {
      widgetLayerOrder: [mockResponsiveGroupId, 'widget1', 'widget2'],
      background: '',
      widgetStructureTree: ['div', {}, ['widget1', 'widget2']],
    };
    const mockWidgets = {
      [mockResponsiveGroupId]: { memberWidgetIds: ['widget3'] },
      widget1: {},
      widget2: {},
      widget3: {},
    };

    expect(getPageWidgetIdsToRender(mockPage, mockWidgets)).toEqual([mockResponsiveGroupId, 'widget1', 'widget2']);
  });

  it('removeDeletedWidgets should remove unused widgets from the infograph', () => {
    const mockInfograph = {
      pages: {
        page1: { widgetLayerOrder: ['widget1', 'widget2'] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {
        widget1: {},
        widget2: {},
        widget3: {},
        widget4: {},
        widget5: {},
      },
    };

    expect(removeDeletedWidgets(mockInfograph)).toEqual({
      pages: {
        page1: { widgetLayerOrder: ['widget1', 'widget2'] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {
        widget1: {},
        widget2: {},
      },
    });
  });

  it('removeDeletedWidgets should not remove widgets used in a group from the infograph', () => {
    const mockGroupId = `${WidgetType.Group}-1`;
    const mockInfograph = {
      pages: {
        page1: { widgetLayerOrder: [mockGroupId] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {
        widget1: {},
        widget2: {},
        widget3: {},
        widget4: {},
        [mockGroupId]: { memberWidgetIds: ['widget3', 'widget4'] },
      },
    };

    expect(removeDeletedWidgets(mockInfograph)).toEqual({
      pages: {
        page1: { widgetLayerOrder: [mockGroupId] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {
        widget3: {},
        widget4: {},
        [mockGroupId]: { memberWidgetIds: ['widget3', 'widget4'] },
      },
    });
  });

  it('removeDeletedWidgets should work with no widgets', () => {
    const mockInfograph = {
      pages: {
        page1: { widgetLayerOrder: [] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {},
    };

    expect(removeDeletedWidgets(mockInfograph)).toEqual({
      pages: {
        page1: { widgetLayerOrder: [] },
        page2: { widgetLayerOrder: [] },
      },
      widgets: {},
    });
  });

  it('isAutoHeightWidget should return the boolean using the widgetId or widgetType', () => {
    // Table and Text widget set the height as fit-height
    expect(isAutoHeightWidget(WidgetType.Text)).toBe(true);
    expect(isAutoHeightWidget(WidgetType.Table)).toBe(true);
    expect(isAutoHeightWidget('003.testwidgetid')).toBe(true); // Text
    expect(isAutoHeightWidget('008.testwidgetid')).toBe(true); // Table

    expect(isAutoHeightWidget(WidgetType.Icon)).toBe(false);
    expect(isAutoHeightWidget(WidgetType.Group)).toBe(false);
    expect(isAutoHeightWidget('002.testwidgetid')).toBe(false); // Icon
    expect(isAutoHeightWidget('004.testwidgetid')).toBe(false); // Group
  });
});

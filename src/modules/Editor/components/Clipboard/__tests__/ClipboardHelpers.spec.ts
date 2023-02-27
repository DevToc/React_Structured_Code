import { shiftWidgetPosition, createCopyWidgets, parseCopyWidgets, createCopyPage } from '../Clipboard.helpers';
import { COPY_OFFSET_POSITION } from '../Clipboard.config';

describe('Clipboard/Clipboard.helpers.ts', () => {
  describe('shiftWidgetPosition', () => {
    test('should shift widget position', () => {
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };
      const shiftedWidget = shiftWidgetPosition(mockWidgetData);

      expect(shiftedWidget.topPx).toEqual(mockWidgetData.topPx + COPY_OFFSET_POSITION);
      expect(shiftedWidget.leftPx).toEqual(mockWidgetData.leftPx + COPY_OFFSET_POSITION);
    });
  });
  describe('createCopyWidgets', () => {
    test('should not copy if no activeIds', () => {
      const copiedWidgets = createCopyWidgets([], {}, 'page-1');
      expect(copiedWidgets.length).toEqual(0);
    });
    test('should create copy widgets for clipboard', () => {
      const activeWidgets = [{ id: '001.widget-1', groupId: '', groupMembers: [] }];
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };

      const widgets = {
        '001.widget-1': mockWidgetData,
      };

      const copiedWidgets = createCopyWidgets(activeWidgets, widgets, 'page-1');
      expect(copiedWidgets.length).toEqual(1);
      expect(copiedWidgets[0].widgetType).toEqual('001');
      expect(copiedWidgets[0].fromPageId).toEqual('page-1');
      expect(copiedWidgets[0].widgetData).toMatchObject(mockWidgetData);
    });
    test('should copy group widgets for clipboard', () => {
      const activeWidgets = [{ id: '004', groupId: '004', groupMembers: ['001.a', '001.b'] }];
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };

      const widgets = {
        '004': mockWidgetData,
        '001.a': mockWidgetData,
        '001.b': mockWidgetData,
      };
      const copiedWidgets = createCopyWidgets(activeWidgets, widgets, 'page-1');
      expect(copiedWidgets.length).toEqual(1);
      expect(copiedWidgets[0].widgetType).toEqual('004');
      expect(copiedWidgets[0].groupWidgets.length).toEqual(2);
    });
  });
  describe('parseCopyWidgets', () => {
    test('should create addable widgets from widgets in clipboard', () => {
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };
      const widgetClipboard = [
        {
          widgetType: '001',
          widgetData: mockWidgetData,
          fromPageId: 'page-1',
        },
      ];

      const widgets = parseCopyWidgets(widgetClipboard, 'page-1');
      expect(widgets.length).toEqual(1);
      expect(widgets[0].widgetType).toEqual('001');
      expect(widgets[0].widgetData.topPx).toEqual(mockWidgetData.topPx + COPY_OFFSET_POSITION);
      expect(widgets[0].widgetData.leftPx).toEqual(mockWidgetData.leftPx + COPY_OFFSET_POSITION);
    });
    test('should not add offset if widgets are copied to another page', () => {
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };
      const widgetClipboard = [
        {
          widgetType: '001',
          widgetData: mockWidgetData,
          fromPageId: 'page-5',
        },
      ];

      const widgets = parseCopyWidgets(widgetClipboard, 'page-1');
      expect(widgets.length).toEqual(1);
      expect(widgets[0].widgetType).toEqual('001');
      expect(widgets[0].widgetData.topPx).toEqual(mockWidgetData.topPx);
      expect(widgets[0].widgetData.leftPx).toEqual(mockWidgetData.leftPx);
    });
    test('should parse groups from clipboard', () => {
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };
      const widgetClipboard = [
        {
          widgetType: '004',
          widgetData: mockWidgetData,
          fromPageId: 'page-5',
          groupWidgets: [
            {
              widgetType: '001',
              widgetData: {
                topPx: 100,
                leftPx: 55,
                widthPx: 300,
                heightPx: 400,
                rotateDeg: 0,
              },
            },
            {
              widgetType: '001',
              widgetData: {
                topPx: 100,
                leftPx: 55,
                widthPx: 300,
                heightPx: 400,
                rotateDeg: 0,
              },
            },
          ],
        },
      ];

      const widgets = parseCopyWidgets(widgetClipboard, 'page-1');
      expect(widgets.length).toEqual(1);
      expect(widgets[0].widgetType).toEqual('004');
      expect(widgets[0].groupWidgets.length).toEqual(2);
      expect(widgets[0].widgetData.topPx).toEqual(mockWidgetData.topPx);
      expect(widgets[0].widgetData.topPx).toEqual(mockWidgetData.topPx);
      expect(widgets[0].widgetData.leftPx).toEqual(mockWidgetData.leftPx);
    });
  });
  describe('createCopyPage', () => {
    test('should create copy of page', () => {
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };
      const activePage = {
        background: 'rgb(246, 186, 42)',
        widgetLayerOrder: ['001.widget-4'],
        widgetStructureTree: ['h1', {}, '001.widget-4'],
      };
      const widgets = {
        '001.widget-4': mockWidgetData,
        '001.widget-5': mockWidgetData,
      };

      const copyPage = createCopyPage(activePage, widgets);

      expect(copyPage.length).toEqual(1);
      expect(copyPage[0].page.widgetLayerOrder.length).toEqual(activePage.widgetLayerOrder.length);
      expect(copyPage[0].page.widgetStructureTree.length).toEqual(activePage.widgetStructureTree.length);
      expect(copyPage[0].page.background).toEqual(activePage.background);
      expect(copyPage[0].widgets).toMatchObject({ '001.widget-4': mockWidgetData });
    });

    test('should create copy of page without widgets', () => {
      const mockWidgetData = { topPx: 100, leftPx: 55, widthPx: 300, heightPx: 400, rotateDeg: 0 };
      const activePage = {
        background: '#fff',
        widgetLayerOrder: [],
        widgetStructureTree: [],
      };
      const widgets = {
        '001.widget-4': mockWidgetData,
        '001.widget-5': mockWidgetData,
      };

      const copyPage = createCopyPage(activePage, widgets);

      expect(copyPage.length).toEqual(1);
      expect(copyPage[0].page.widgetLayerOrder.length).toEqual(activePage.widgetLayerOrder.length);
      expect(copyPage[0].page.widgetStructureTree.length).toEqual(activePage.widgetStructureTree.length);
      expect(copyPage[0].page.background).toEqual(activePage.background);
      expect(copyPage[0].widgets).toMatchObject({});
    });
  });
});

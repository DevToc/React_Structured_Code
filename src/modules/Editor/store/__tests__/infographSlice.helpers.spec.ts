import { addWidgetToState, findFontsInPage, mergeWidgetData } from '../infographSlice.helpers';
import { SAMPLE_INFOGRAPH } from 'utils/loadSampleInfograph';
import clonedeep from 'lodash.clonedeep';
import { CHART_TYPE_TO_DEFAULT_DATA_MAP } from 'modules/Editor/components/WidgetMenu/SideMenu/ChartsWidgetMenu/ChartsWidgetMenu.config';
import { parseWidgetData } from 'modules/Editor/store/store.helpers';
import { AddWidget } from 'modules/Editor/store/infographSlice.types';
import { initialState } from 'modules/Editor/store/infographSlice';
import { getLeafNodes } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.helpers';

const pageId = 'page1';

describe('infographSlice.helpers', () => {
  describe('findFontsInPage', () => {
    it('should find all fonts from giving page data', async () => {
      const fonts = findFontsInPage(SAMPLE_INFOGRAPH, SAMPLE_INFOGRAPH.pageOrder[0]);
      expect(fonts).toEqual(['Inter']);
    });
  });

  describe('addWidgetToState', () => {
    it('Should add widget in reading order', async () => {
      const infographState = clonedeep(initialState);
      infographState.pages[pageId] = {
        background: '',
        widgetLayerOrder: [],
        widgetStructureTree: ['something', {}, []],
      };

      const newWidgetData1 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Pie']) as any;
      const newWidgetData2 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Bar']) as any;
      const newWidgetData3 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Line']) as any;

      const [newWidgetIds, newWidgets] = parseWidgetData([newWidgetData1, newWidgetData2, newWidgetData3], pageId);

      (newWidgets as AddWidget[]).map((widget) => addWidgetToState(infographState, widget));

      const leaftNodes = getLeafNodes(infographState.pages[pageId].widgetStructureTree[2]);
      expect(leaftNodes).toEqual(newWidgetIds);
    });

    it('Should add widget in layer order', async () => {
      const infographState = clonedeep(initialState);
      infographState.pages[pageId] = {
        background: '',
        widgetLayerOrder: [],
        widgetStructureTree: ['something', {}, []],
      };

      const newWidgetData1 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Pie']) as any;
      const newWidgetData2 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Bar']) as any;
      const newWidgetData3 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Line']) as any;

      const [newWidgetIds, newWidgets] = parseWidgetData([newWidgetData1, newWidgetData2, newWidgetData3], pageId);

      (newWidgets as AddWidget[]).map((widget) => addWidgetToState(infographState, widget));

      expect(infographState.pages[pageId].widgetLayerOrder).toEqual(newWidgetIds);
    });

    it('Should add widget in layer order next to widget', async () => {
      const infographState = clonedeep(initialState);
      infographState.pages[pageId] = {
        background: '',
        widgetLayerOrder: [],
        widgetStructureTree: ['something', {}, []],
      };

      const newWidgetData1 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Pie']) as any;
      const newWidgetData2 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Bar']) as any;
      const newWidgetData3 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Line']) as any;
      const [existingWidgetIds, existingWidgets] = parseWidgetData(
        [newWidgetData1, newWidgetData2, newWidgetData3],
        pageId,
      );
      (existingWidgets as AddWidget[]).map((widget) => addWidgetToState(infographState, widget));

      const newWidgetData = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Area']) as any;
      const [newWidgetIds, newWidget] = parseWidgetData(newWidgetData, pageId);
      const middleWidgetId = existingWidgetIds[1];
      addWidgetToState(infographState, newWidget as AddWidget, middleWidgetId);

      expect(infographState.pages[pageId].widgetLayerOrder).toEqual([
        existingWidgetIds[0],
        existingWidgetIds[1],
        newWidgetIds[0],
        existingWidgetIds[2],
      ]);
    });

    it('Should add widget in reading order next to widget', async () => {
      const infographState = clonedeep(initialState);
      infographState.pages[pageId] = {
        background: '',
        widgetLayerOrder: [],
        widgetStructureTree: ['something', {}, []],
      };

      const newWidgetData1 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Pie']) as any;
      const newWidgetData2 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Bar']) as any;
      const newWidgetData3 = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Line']) as any;
      const [existingWidgetIds, existingWidgets] = parseWidgetData(
        [newWidgetData1, newWidgetData2, newWidgetData3],
        pageId,
      );
      (existingWidgets as AddWidget[]).map((widget) => addWidgetToState(infographState, widget));

      const newWidgetData = clonedeep(CHART_TYPE_TO_DEFAULT_DATA_MAP['Area']) as any;
      const [newWidgetIds, newWidget] = parseWidgetData(newWidgetData, pageId);
      const middleWidgetId = existingWidgetIds[1];
      addWidgetToState(infographState, newWidget as AddWidget, middleWidgetId);

      const leaftNodes = getLeafNodes(infographState.pages[pageId].widgetStructureTree[2]);
      expect(leaftNodes).toEqual([existingWidgetIds[0], existingWidgetIds[1], newWidgetIds[0], existingWidgetIds[2]]);
    });
  });

  describe('mergeWidgetData', () => {
    it('should update non-nested widget data', async () => {
      const widget = { topPx: 0, leftPx: 0, widthPx: 0, heightPx: 0, rotateDeg: 0 };
      const newWidgetData = { topPx: 1, leftPx: 1, widthPx: 1 };

      const result = mergeWidgetData(widget, newWidgetData);
      expect(result).toEqual({ topPx: 1, leftPx: 1, widthPx: 1, heightPx: 0, rotateDeg: 0 });
    });

    it('should update merge nested widget data', async () => {
      const widget = { topPx: 0, leftPx: 0, rotateDeg: 0, border: { color: 'blue', weight: 10 } };
      const newWidgetData = { topPx: 1, leftPx: 1, border: { color: 'red' } };

      const result = mergeWidgetData(widget, newWidgetData);
      expect(result).toEqual({ topPx: 1, leftPx: 1, rotateDeg: 0, border: { color: 'red', weight: 10 } });
    });

    it('should replace array values', async () => {
      const widget = {
        topPx: 0,
        leftPx: 0,
        rotateDeg: 0,
        chart: {
          type: 'donut',
          style: {
            colors: ['red', 'blue'],
            border: 'solid',
          },
        },
      };
      const newWidgetData = { topPx: 1, leftPx: 1, chart: { style: { colors: ['green'] } } };

      const result = mergeWidgetData(widget, newWidgetData);
      expect(result).toEqual({
        topPx: 1,
        leftPx: 1,
        rotateDeg: 0,
        chart: {
          type: 'donut',
          style: {
            colors: ['green'],
            border: 'solid',
          },
        },
      });
    });
  });
});

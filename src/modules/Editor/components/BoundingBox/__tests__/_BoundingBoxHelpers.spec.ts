import {
  extendWidgetCreator,
  getWidgetTargetIds,
  getWidgetElements,
  checkActiveWidgetIdByTarget,
  getWidgetHandles,
  getKeepAspectRatioHandles,
  getWidgetRotatable,
} from '../BoundingBox.helpers';
import { WIDGETBASE_CLASS, HANDLE } from '../../../../../constants/bounding-box';
import { WidgetType } from '../../../../../types/widget.types';
import { DEFAULT_WIDGET_BOUNDING_BOX_CONFIG, WIDGET_BOUNDING_BOX_CONFIG } from '../BoundingBox.config';

const mockSmartGuide = {
  smartGuide: { compute: () => {}, hide: () => {}, match: () => {} },
};

describe('BoundingBox/BoundingBox.helpers.ts', () => {
  describe('extendWidgetCreator', () => {
    test('should call base bounding box function by default', () => {
      const extendWidget = extendWidgetCreator({
        activeWidgetIds: [],
        widgetRefs: {},
        ...mockSmartGuide.smartGuide,
      });
      const onDrag = jest.fn();
      const mockEvent = 'onDragEvent';

      const boundingBoxOnDragEvent = extendWidget(onDrag, mockEvent);
      boundingBoxOnDragEvent(mockEvent);

      expect(onDrag).toHaveBeenCalled();
      expect(onDrag).toHaveBeenCalledWith(mockEvent);
    });

    test('should call correct base bounding box function', () => {
      const activeWidgetId = '123';
      const widgetRefs = { [activeWidgetId]: { onDragEnd: () => {} } };
      const extendWidget = extendWidgetCreator({
        activeWidgetIds: [activeWidgetId],
        widgetRefs,
        ...mockSmartGuide.smartGuide,
      });
      const onDrag = jest.fn();
      const mockEvent = 'onDrag';

      const boundingBoxOnDragEvent = extendWidget(onDrag, mockEvent);
      boundingBoxOnDragEvent(mockEvent);

      expect(onDrag).toHaveBeenCalled();
      expect(onDrag).toHaveBeenCalledWith(mockEvent);
    });

    test('should call custom widget bounding box function if provided', () => {
      const onDragEnd = () => {};
      const customOnDragEnd = jest.fn();
      const activeWidgetId = '123';
      const widgetRefs = { [activeWidgetId]: { onDragEnd: customOnDragEnd } };
      const extendWidget = extendWidgetCreator({
        activeWidgetIds: [activeWidgetId],
        widgetRefs,
        ...mockSmartGuide.smartGuide,
      });
      const mockEvent = 'onDragEnd';

      const boundingBoxOnDragEndEvent = extendWidget(onDragEnd, mockEvent);
      boundingBoxOnDragEndEvent(mockEvent);

      expect(customOnDragEnd).toHaveBeenCalled();
      expect(customOnDragEnd).toHaveBeenCalledWith({
        event: mockEvent,
        onDragEnd,
        smartGuide: mockSmartGuide.smartGuide,
      });
    });
  });
  describe('getWidgetTargetIds', () => {
    const widgetOneEl = document.createElement('div');
    widgetOneEl.className = WIDGETBASE_CLASS;
    widgetOneEl.id = '123';

    const widgetTwoEl = document.createElement('div');
    widgetTwoEl.className = WIDGETBASE_CLASS;
    widgetTwoEl.id = '123';

    test('Multiple widgets', () => {
      const ids = getWidgetTargetIds([widgetOneEl, widgetTwoEl]);
      expect(ids.length).toEqual(2);
    });

    test('No widgets', () => {
      const ids = getWidgetTargetIds([]);
      expect(ids.length).toEqual(0);
    });
  });
  describe('getWidgetElements', () => {
    test('Returns widget element', () => {
      const widgetEl = document.createElement('div');
      widgetEl.className = WIDGETBASE_CLASS;
      widgetEl.id = '123';
      const activeWidgetId = '123';
      const activeWidgetIds = [activeWidgetId];
      const widgetRef = { [activeWidgetId]: { element: widgetEl } };

      global.document.getElementById = jest.fn(() => widgetEl);
      const elements = getWidgetElements(activeWidgetIds, widgetRef);
      expect(elements.length).toEqual(1);
    });
    test('Without refs or active ids', () => {
      const elements = getWidgetElements([], {});
      expect(elements.length).toEqual(0);
    });
  });
  describe('checkActiveWidgetIdByTarget', () => {
    test('checks target active widget id', () => {
      const target = document.createElement('div');
      const widgetId = '123';
      target.className = WIDGETBASE_CLASS;
      target.id = widgetId;

      const hasWidgetId = checkActiveWidgetIdByTarget([widgetId], target);
      const hasWrongWidgetId = checkActiveWidgetIdByTarget(['324'], target);
      const hasNoWidgetId = checkActiveWidgetIdByTarget([], null);

      expect(hasWidgetId).toEqual(true);
      expect(hasWrongWidgetId).toEqual(false);
      expect(hasNoWidgetId).toEqual(false);
    });
  });
  describe('getWidgetHandles', () => {
    test('Should return widget handles for multiple', () => {
      const multiple = getWidgetHandles(['123', '456']);
      expect(multiple).toEqual(HANDLE.CORNERS);
    });
    test('Should not return handles if no ids passed', () => {
      const noIds = getWidgetHandles([]);
      expect(noIds).toEqual([]);
    });
    test('Works with widget config', () => {
      const iconWidgetId = `${WidgetType.Icon}-123`;
      const activeWidgets = [{ id: iconWidgetId, groupId: '', responsiveGroupId: '', groupMembers: [] }];
      const single = getWidgetHandles(activeWidgets);
      expect(single).toEqual(WIDGET_BOUNDING_BOX_CONFIG[WidgetType.Icon].customHandle);

      const imageWidgetId = `${WidgetType.Image}-456`;
      const activeImageWidgets = [{ id: imageWidgetId, groupId: '', responsiveGroupId: '', groupMembers: [] }];
      const imageHandleCorner = getWidgetHandles(activeImageWidgets, { frame: 'Square' });
      const imageHandleAll = getWidgetHandles(activeImageWidgets, { frame: 'Rectangle' });

      expect(imageHandleCorner).toEqual(HANDLE.CORNERS);
      expect(imageHandleAll).toEqual(HANDLE.ALL);
    });
  });
  describe('getKeepAspectRatioHandles', () => {
    test('Should return corner handles if not specified in config', () => {
      const iconWidgetId = `${WidgetType.Icon}-123`;
      const handles = getKeepAspectRatioHandles([iconWidgetId]);
      expect(handles).toEqual(DEFAULT_WIDGET_BOUNDING_BOX_CONFIG.keepAspectRatioHandles);
    });
    test('Should return null if no widget selected', () => {
      const handles = getKeepAspectRatioHandles([]);
      expect(handles).toBeNull();
    });
    test('Should return null if multiple widgets selected', () => {
      const handles = getKeepAspectRatioHandles(['123', '456']);
      expect(handles).toBeNull();
    });
  });
  describe('getWidgetRotatable', () => {
    test('should return true as default for single widgets', () => {
      const rotatable = getWidgetRotatable(['012']);
      expect(rotatable).toEqual(true);
    });
    test('should return true for multiple select', () => {
      const rotatable = getWidgetRotatable(['001', '002']);
      expect(rotatable).toEqual(true);
    });
    test('should return false for multiple select with non rotatable widget', () => {
      const rotatable = getWidgetRotatable(['001', '002', '008']);
      expect(rotatable).toEqual(false);
    });
    test('should return false for non rotatable widget', () => {
      const rotatable = getWidgetRotatable(['008']);
      expect(rotatable).toEqual(false);
    });
  });
});

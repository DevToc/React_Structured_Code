import { Alignment, Side } from 'widgets/LineWidget/LineWidget.types';
import { generatePortState, generateWrapperStyle, getConnectedLineDatas } from '../FlowCore.helpers';
import { connectedLineWidgets, nonConnectedLineWidgets } from './mockData';

describe('FlowCore/FlowCore.helpers', () => {
  let normalElement: HTMLElement | undefined;
  let pureElement: HTMLElement | undefined;

  beforeEach(() => {
    normalElement = document.createElement('div');
    normalElement.style.height = '200px';
    normalElement.style.width = '100px';
    normalElement.style.top = '20px';
    normalElement.style.left = '40px';
    normalElement.style.display = 'block';
    pureElement = document.createElement('div');

    document.body.appendChild(normalElement);
    document.body.appendChild(pureElement);
  });

  describe('generateWrapperStyle', () => {
    it('should return wrapper style for port rendering', () => {
      const mockWrapperPosition = {
        leftPx: 60,
        topPx: 40,
        widthPx: 200,
        heightPx: 100,
      };

      expect(generateWrapperStyle(mockWrapperPosition, Side.EAST)).toEqual({ left: '260px', top: '90px' });
      expect(generateWrapperStyle(mockWrapperPosition, Side.WEST)).toEqual({ left: '60px', top: '90px' });
      expect(generateWrapperStyle(mockWrapperPosition, Side.NORTH)).toEqual({ left: '160px', top: '40px' });
      expect(generateWrapperStyle(mockWrapperPosition, Side.SOUTH)).toEqual({ left: '160px', top: '140px' });
    });
  });

  describe('generatePortState', () => {
    it('should returns PortState data using Side value', () => {
      const mockWidgetId = 'test-widget-id';
      expect(generatePortState(Side.EAST, 'test-widget-id')).toEqual({
        alignment: Alignment.CENTER,
        side: Side.EAST,
        widgetId: mockWidgetId,
      });
      expect(generatePortState(Side.WEST, 'test-widget-id')).toEqual({
        alignment: Alignment.CENTER,
        side: Side.WEST,
        widgetId: mockWidgetId,
      });
      expect(generatePortState(Side.NORTH, 'test-widget-id')).toEqual({
        alignment: Alignment.CENTER,
        side: Side.NORTH,
        widgetId: mockWidgetId,
      });
      expect(generatePortState(Side.SOUTH, 'test-widget-id')).toEqual({
        alignment: Alignment.CENTER,
        side: Side.SOUTH,
        widgetId: mockWidgetId,
      });
    });
  });

  describe('getConnectedLineDatas', () => {
    it('should returns connected line datas as key:value', () => {
      const mockWidgets = connectedLineWidgets;
      const mockNonConnectedWidgets = nonConnectedLineWidgets;

      expect(getConnectedLineDatas(mockWidgets)).toEqual({
        '006.g2a8vXBLDf7bSTMD7YBNLD84': ['005.bcACqKEGrHV380TCfzC06zg3'],
        '006.jlz1bzD5UmLDu8pCMz5Lonsc': ['005.bcACqKEGrHV380TCfzC06zg3'],
      });

      expect(getConnectedLineDatas(mockNonConnectedWidgets)).toEqual({});
    });
  });
});

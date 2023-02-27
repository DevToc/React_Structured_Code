import { generateDefaultData } from 'widgets/IconWidget/IconWidget.helpers';
import { IconWidgetType } from 'widgets/IconWidget/IconWidget.types';
import { handleReplaceData } from '../ReplaceMenu.helper';

describe('ReplaceMenu helpers', () => {
  it('should return the correct data for single type Icon widgets', () => {
    const currentWidget = generateDefaultData('ui_banners_people_business_woman', undefined, undefined, undefined, {
      heightPx: 162,
      widthPx: 100,
    });
    const { widgetData } = generateDefaultData('ui_banners_people_burglar');

    const replaceData = handleReplaceData({
      widgetId: '002-abc',
      widgetData: currentWidget.widgetData,
      newWidgetData: widgetData,
      viewBox: '70.97 32.6246 358.1091 434.7354',
    });

    expect(replaceData.iconId).toEqual('ui_banners_people_burglar');
    expect(replaceData.heightPx).toBeLessThan(widgetData.heightPx);
    expect(replaceData.widthPx).toBeLessThan(widgetData.widthPx);
  });

  it('should return the correct data for grid type Icon widgets', () => {
    const currentWidget = generateDefaultData('icons8-6110', '', undefined, undefined, {
      type: IconWidgetType.Grid,
    });
    const { widgetData } = generateDefaultData('canada_moose');

    const mockWidgetEl = document.createElement('div');
    mockWidgetEl.appendChild(document.createElement('div'));
    global.document.getElementById = jest.fn(() => mockWidgetEl);

    const replaceData = handleReplaceData({
      widgetId: '002-abc',
      widgetData: currentWidget.widgetData,
      newWidgetData: widgetData,
      viewBox: '0 0 128 92.4',
    });

    expect(replaceData.iconId).toEqual('canada_moose');
    expect(replaceData.gridItemWidthPx).toEqual(42);
    expect(replaceData.gridItemHeightPx).toEqual(30.31875);
    expect(replaceData.heightPx).toBeGreaterThan(-1);
    expect(replaceData.widthPx).toBeGreaterThan(-1);
  });
});

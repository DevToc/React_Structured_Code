import { renderWidget } from 'utils/test-utils.test';
import { BasicShapeWidget } from '../BasicShapeWidget';
import { generateDefaultData } from '../BasicShapeWidget.helpers';
import { BasicShapeType } from '../BasicShapeWidget.types';

describe('widgets/BasicShapeWidget', () => {
  it('should render correctly with fill', () => {
    const widgetId = '006.widget-1';
    const widget = { widgetId, ...generateDefaultData(BasicShapeType.Rectangle, false) };

    const { asFragment } = renderWidget(<BasicShapeWidget />, { widget });
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correctly with border', () => {
    const widgetId = '006.widget-1';
    const widget = { widgetId, ...generateDefaultData(BasicShapeType.Rectangle, true) };
    const { asFragment } = renderWidget(<BasicShapeWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render rounded rectangle', () => {
    const widgetId = '006-widget-1';
    const widget = { widgetId, ...generateDefaultData(BasicShapeType.Rectangle, false, { cornerRadius: 10 }) };
    const { asFragment } = renderWidget(<BasicShapeWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });
});

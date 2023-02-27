import { renderWidget } from 'utils/test-utils.test';
import { IconWidget } from '../IconWidget';
import { IconWidgetType } from '../IconWidget.types';
import { generateDefaultData } from '../IconWidget.helpers';

describe('widgets/IconWidget', () => {
  it('should render correctly', () => {
    const widgetId = '002.widget-1';
    const widget = { widgetId, ...generateDefaultData('icon-1') };
    const { asFragment } = renderWidget(<IconWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the icon type correctly', () => {
    const widgetId = '002.widget-1';
    const widget = {
      widgetId,
      ...generateDefaultData('icons8-6110', '', undefined, undefined, {
        widthPx: 550,
        heightPx: 42,
        shapeFill: 67,
        shapeColorOne: '#0052A3',
        shapeColorTwo: '#8ABFF4',
        type: IconWidgetType.Grid,
      }),
    };
    const { asFragment } = renderWidget(<IconWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should mark icon as decorative by default', () => {
    const widgetId = '002.widget-1';
    const props = { widgetId, ...generateDefaultData('icon-1') };

    expect(props.widgetData.isDecorative).toBeTruthy();
  });
});

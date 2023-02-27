import { renderWidget } from 'utils/test-utils.test';
import { LabelTextWidget } from '../LabelTextWidget';
import { generateDefaultData } from '../LabelTextWidget.helpers';

describe('widgets/TextBasedWidgets/LabelTextWidget', () => {
  it('should render correctly', () => {
    const widgetId = '020.widget-1';
    const widget = { widgetId, ...generateDefaultData() };

    const { asFragment } = renderWidget(<LabelTextWidget />, { widget });
    expect(asFragment()).toMatchSnapshot();
  });
});

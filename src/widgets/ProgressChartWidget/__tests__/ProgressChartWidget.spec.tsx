import { ProgressChartWidget } from '../ProgressChartWidget';
import { renderWidget } from 'utils/test-utils.test';
import { generateDefaultData } from '../ProgressChartWidget.helpers';
import { ProgressChartType } from '../ProgressChartWidget.types';
import { WidgetType } from 'types/widget.types';

const mockWidgetId = `${WidgetType.ProgressChart}-test-widget-id`;

describe('widgets/ProgressChartWidget', () => {
  it('should render donut correctly', () => {
    const widget = { widgetId: mockWidgetId, ...generateDefaultData(ProgressChartType.Donut) };
    const { asFragment } = renderWidget(<ProgressChartWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render half-donut correctly', () => {
    const widget = { widgetId: mockWidgetId, ...generateDefaultData(ProgressChartType.HalfDonut) };
    const { asFragment } = renderWidget(<ProgressChartWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render bar correctly', () => {
    const widget = { widgetId: mockWidgetId, ...generateDefaultData(ProgressChartType.Bar) };
    const { asFragment } = renderWidget(<ProgressChartWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });
});

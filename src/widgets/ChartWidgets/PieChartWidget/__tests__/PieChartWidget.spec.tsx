// used for checking existence of highcharts classnames
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { screen } from '@testing-library/react';
import { renderWidget } from 'utils/test-utils.test';
import { ReadOnlyPieChartWidget } from '../PieChartWidget';
import { generateDefaultData } from '../PieChartWidget.helpers';
import merge from 'lodash.merge';

const PIE_PATH_SELECTOR = '.highcharts-series .highcharts-point';
const LEGEND_CLASSNAME = 'highcharts-legend';

const DATA_LABEL_SELECTOR = '.highcharts-label.highcharts-data-label';

const mockWidget = generateDefaultData();
const mockWidgetId = mockWidget.widgetType + '123';

describe('widgets/PieChartWidget.tsx', () => {
  it('should render the chart', () => {
    renderWidget(<ReadOnlyPieChartWidget />, { widget: { ...mockWidget, widgetId: mockWidgetId } });

    const widget = screen.queryByTestId(/widgetbase-/);
    expect(widget).toBeInTheDocument();
  });

  it('should update border colour and width', () => {
    const newWidth = 5;
    const newColor = '#000';

    const updatedWidgetData = {
      ...mockWidget.widgetData,
      generalOptions: {
        borderWidth: newWidth,
        borderColor: newColor,
      },
    };
    const widget = { widgetId: mockWidgetId, widgetData: updatedWidgetData };

    const { container } = renderWidget(<ReadOnlyPieChartWidget />, { widget });
    expect(container.querySelectorAll(PIE_PATH_SELECTOR)[0].getAttribute('stroke')).toBe(newColor);
    expect(container.querySelectorAll(PIE_PATH_SELECTOR)[0].getAttribute('stroke-width')).toBe(`${newWidth}`);
  });

  /**
   * SVG changes its path drawing when applying innerSize (i.e. donut hole) property.
   */
  it('should update donut size', () => {
    const donutSize = 50;

    const { container } = renderWidget(<ReadOnlyPieChartWidget />, {
      widget: { ...mockWidget, widgetId: mockWidgetId },
    });

    const pathD = container.querySelectorAll(PIE_PATH_SELECTOR)[0].getAttribute('d');
    const updatedWidgetData = {
      ...mockWidget.widgetData,
      generalOptions: {
        ...mockWidget.widgetData.generalOptions,
        innerSize: donutSize,
      },
    };
    const widget = { widgetId: mockWidgetId, widgetData: updatedWidgetData };
    const { container: afterChangeContainer } = renderWidget(<ReadOnlyPieChartWidget />, { widget });
    const newPathD = afterChangeContainer.querySelectorAll(PIE_PATH_SELECTOR)[0].getAttribute('d');

    expect(pathD === newPathD).toBeFalsy();
  });

  it('should show legend if enabled', () => {
    const withLegendData = {
      ...mockWidget.widgetData,
      legend: {
        enabled: true,
        labelStyle: { color: '#000' },
      },
    };
    const widget = { widgetId: mockWidgetId, widgetData: withLegendData };
    const { container } = renderWidget(<ReadOnlyPieChartWidget />, { widget });
    expect(container.getElementsByClassName(LEGEND_CLASSNAME).length).toBe(1);
  });

  it('should hide legend if disabled', () => {
    const noLegendData = {
      ...mockWidget.widgetData,
      legend: {
        enabled: false,
        labelStyle: { color: '#000' },
      },
    };
    const widget = { widgetId: mockWidgetId, widgetData: noLegendData };
    const { container } = renderWidget(<ReadOnlyPieChartWidget />, { widget });
    expect(container.getElementsByClassName(LEGEND_CLASSNAME).length).toBe(0);
  });

  it('should update label color', () => {
    const newDataLabelColor = '#fff';
    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      dataLabels: { style: { color: newDataLabelColor } },
    });

    const widget = { widgetId: mockWidgetId, widgetData: updatedWidgetData };
    const { container } = renderWidget(<ReadOnlyPieChartWidget />, { widget });
    expect(container.querySelector(DATA_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`color: ${newDataLabelColor}`);
  });
});

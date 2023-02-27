// used for checking existence of highcharts classnames
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { screen } from '@testing-library/react';
import { renderWidget } from 'utils/test-utils.test';
import { generateDefaultData } from '../LineChartWidget.helpers';
import { ReadOnlyLineChartWidget } from '../LineChartWidget';
import merge from 'lodash.merge';

const GRID_LINE_SELECTOR = '.highcharts-yaxis-grid .highcharts-grid-line';
const LEGEND_CLASSNAME = 'highcharts-legend';

const YAXIS_LINE_SELECTOR = '.highcharts-axis.highcharts-yaxis .highcharts-axis-line';
const XAXIS_LINE_SELECTOR = '.highcharts-axis.highcharts-xaxis .highcharts-axis-line';

const X_AXIS_LABEL_SELECTOR = '.highcharts-axis-labels.highcharts-xaxis-labels';
const Y_AXIS_LABEL_SELECTOR = '.highcharts-axis-labels.highcharts-yaxis-labels';

const Y_AXIS_TITLE_SELECTOR = '.highcharts-axis.highcharts-yaxis .highcharts-axis-title';
const X_AXIS_TITLE_SELECTOR = '.highcharts-axis.highcharts-xaxis .highcharts-axis-title';

const mockWidget = generateDefaultData();
const mockId = mockWidget.widgetType + '123';

describe('widgets/LineChartWidget.tsx', () => {
  it('should render the widget', () => {
    renderWidget(<ReadOnlyLineChartWidget />, { widget: { ...mockWidget, widgetId: mockId } });

    const widget = screen.queryByTestId(/widgetbase-/);
    expect(widget).toBeInTheDocument();
  });

  it('axis titles should be bold by default', () => {
    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget: { ...mockWidget, widgetId: mockId } });

    expect(container.querySelectorAll(Y_AXIS_TITLE_SELECTOR)[0]).toHaveStyle('font-weight: bold');
    expect(container.querySelectorAll(X_AXIS_TITLE_SELECTOR)[0]).toHaveStyle('font-weight: bold');
  });

  it('should update x and y axis line colour', () => {
    const newXAxisColor = '#fff';
    const newYAxisColor = '#ded';
    const updatedWidgetData = {
      ...mockWidget.widgetData,
      xAxis: {
        ...mockWidget.widgetData.xAxis,
        style: {
          lineColor: newXAxisColor,
          lineWidth: 1,
        },
      },
      yAxis: {
        ...mockWidget.widgetData.yAxis,
        style: {
          lineColor: newYAxisColor,
          lineWidth: 1,
        },
      },
    };
    const widget = { widgetId: mockId, widgetData: updatedWidgetData };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.querySelectorAll(XAXIS_LINE_SELECTOR)[0].getAttribute('stroke')).toBe(newXAxisColor);
  });

  it('should update grid line colour', () => {
    const newGridColor = '#000';
    const updatedWidgetData = {
      ...mockWidget.widgetData,
      grid: {
        style: { lineColor: newGridColor },
      },
    };
    const widget = { widgetId: mockId, widgetData: updatedWidgetData };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.querySelectorAll(GRID_LINE_SELECTOR)[0].getAttribute('stroke')).toBe(newGridColor);
  });

  it('should not display legend if disabled', () => {
    const noLegendData = {
      ...mockWidget.widgetData,
      legend: {
        enabled: false,
        labelStyle: { color: '#000' },
      },
    };
    const widget = { widgetId: mockId, widgetData: noLegendData };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.getElementsByClassName(LEGEND_CLASSNAME).length).toBe(0);
  });

  it('should display legend if enabled', () => {
    const withLegendData = {
      ...mockWidget.widgetData,
      legend: {
        enabled: true,
        labelStyle: { color: '#000' },
      },
    };
    const widget = { widgetId: mockId, widgetData: withLegendData };
    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.getElementsByClassName(LEGEND_CLASSNAME).length).toBe(1);
  });

  it('should update label color', async () => {
    const newAxisLabelColor = '#ded';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      xAxis: { labelStyle: { color: newAxisLabelColor } },
      yAxis: { labelStyle: { color: newAxisLabelColor } },
    });
    const widget = { widgetId: mockId, widgetData: updatedWidgetData };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });

    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(
      `color: ${newAxisLabelColor}`,
    );
    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(
      `color: ${newAxisLabelColor}`,
    );
  });

  it('should update label font weight', () => {
    const newValue = 'bold';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      xAxis: { labelStyle: { fontWeight: newValue } },
      yAxis: { labelStyle: { fontWeight: newValue } },
    });
    const widget = { widgetData: updatedWidgetData, widgetId: mockId };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-weight: ${newValue}`);
    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-weight: ${newValue}`);
  });

  it('should update label font style', () => {
    const newValue = 'italic';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      xAxis: { labelStyle: { fontStyle: newValue } },
      yAxis: { labelStyle: { fontStyle: newValue } },
    });
    const widget = { widgetData: updatedWidgetData, widgetId: mockId };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-style: ${newValue}`);
    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-style: ${newValue}`);
  });

  it('should update label text decoration', () => {
    const newValue = 'underline';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      xAxis: { labelStyle: { textDecoration: newValue } },
      yAxis: { labelStyle: { textDecoration: newValue } },
    });
    const widget = { widgetData: updatedWidgetData, widgetId: mockId };

    const { container } = renderWidget(<ReadOnlyLineChartWidget />, { widget });
    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(
      `text-decoration: ${newValue}`,
    );

    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(
      `text-decoration: ${newValue}`,
    );
  });
});

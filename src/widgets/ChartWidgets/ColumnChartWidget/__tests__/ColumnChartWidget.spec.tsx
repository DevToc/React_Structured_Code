// used for checking existence of highcharts classnames
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { screen } from '@testing-library/react';
import { renderWidget } from 'utils/test-utils.test';
import merge from 'lodash.merge';
import { generateDefaultData } from '../ColumnChartWidget.helpers';
import { ReadOnlyColumnChartWidget } from '../ColumnChartWidget';

const GRID_LINE_SELECTOR = '.highcharts-yaxis-grid .highcharts-grid-line';

const DATA_LABEL_SELECTOR = '.highcharts-label.highcharts-data-label';

const X_AXIS_LABEL_SELECTOR = '.highcharts-axis-labels.highcharts-xaxis-labels';
const Y_AXIS_LABEL_SELECTOR = '.highcharts-axis-labels.highcharts-yaxis-labels';

const Y_AXIS_TITLE_SELECTOR = '.highcharts-axis.highcharts-yaxis .highcharts-axis-title';
const X_AXIS_TITLE_SELECTOR = '.highcharts-axis.highcharts-xaxis .highcharts-axis-title';

const mockWidget = generateDefaultData();
const mockId = mockWidget.widgetType + '123';

describe('widgets/ColumnChartWidget.tsx', () => {
  it('Should render the chart', () => {
    renderWidget(<ReadOnlyColumnChartWidget />, { widget: { ...mockWidget, widgetId: mockId } });

    const widget = screen.queryByTestId(/widgetbase-/);
    expect(widget).toBeInTheDocument();
  });

  it('axis titles should be bold by default', () => {
    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget: { ...mockWidget, widgetId: mockId } });

    expect(container.querySelectorAll(Y_AXIS_TITLE_SELECTOR)[0]).toHaveStyle('font-weight: bold');
    expect(container.querySelectorAll(X_AXIS_TITLE_SELECTOR)[0]).toHaveStyle('font-weight: bold');
  });

  it('Should render the chart with the correct grid line settings', () => {
    const newGridColor = '#d4d';
    const widget = {
      widgetId: mockId,
      widgetData: {
        ...mockWidget.widgetData,
        grid: {
          style: {
            lineColor: newGridColor,
          },
        },
      },
    };
    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });

    expect(container.querySelectorAll(GRID_LINE_SELECTOR)[0].getAttribute('stroke')).toBe(newGridColor);
  });

  it('Should render the hide the chart legend', () => {
    const widget = {
      widgetId: mockId,
      widgetData: {
        ...mockWidget.widgetData,
        legend: {
          ...mockWidget.widgetData.legend,
          enabled: false,
        },
      },
    };
    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });
    expect(container.getElementsByClassName('highcharts-legend').length).toBe(0);
  });

  it('should display the legend with the correct color', () => {
    const newColor = 'rgb(221, 68, 221)';
    const widget = {
      widgetId: mockId,
      widgetData: {
        ...mockWidget.widgetData,
        legend: {
          ...mockWidget.widgetData.legend,
          enabled: true,
          labelStyle: {
            color: newColor,
          },
        },
      },
    };
    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });
    expect(container.getElementsByClassName('highcharts-legend').length).toBe(1);
    expect(
      container.querySelectorAll(
        '.highcharts-legend-item.highcharts-column-series.highcharts-color-undefined.highcharts-series-0 > text',
      )[0],
    ).toHaveStyle(`color: ${newColor}`);
  });

  it('should update label color', () => {
    const newDataLabelColor = '#fff';
    const newAxisLabelColor = '#ded';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      dataLabels: { style: { color: newDataLabelColor } },
      xAxis: { labelStyle: { color: newAxisLabelColor } },
      yAxis: { labelStyle: { color: newAxisLabelColor } },
    });
    const widget = { widgetId: mockId, widgetData: updatedWidgetData };

    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });
    expect(container.querySelector(DATA_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`color: ${newDataLabelColor}`);
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
      dataLabels: { style: { fontWeight: newValue } },
      xAxis: { labelStyle: { fontWeight: newValue } },
      yAxis: { labelStyle: { fontWeight: newValue } },
    });
    const widget = { widgetData: updatedWidgetData, widgetId: mockId };

    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });
    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-weight: ${newValue}`);
    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-weight: ${newValue}`);
    expect(container.querySelector(DATA_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-weight: ${newValue}`);
  });

  it('should update label font style', () => {
    const newValue = 'italic';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      dataLabels: { style: { fontStyle: newValue } },
      xAxis: { labelStyle: { fontStyle: newValue } },
      yAxis: { labelStyle: { fontStyle: newValue } },
    });
    const widget = { widgetData: updatedWidgetData, widgetId: mockId };

    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });
    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-style: ${newValue}`);
    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-style: ${newValue}`);
    expect(container.querySelector(DATA_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`font-style: ${newValue}`);
  });

  it('should update label text decoration', () => {
    const newValue = 'underline';

    const updatedWidgetData = merge({}, mockWidget.widgetData, {
      dataLabels: { style: { textDecoration: newValue } },
      xAxis: { labelStyle: { textDecoration: newValue } },
      yAxis: { labelStyle: { textDecoration: newValue } },
    });
    const widget = { widgetData: updatedWidgetData, widgetId: mockId };

    const { container } = renderWidget(<ReadOnlyColumnChartWidget />, { widget });
    expect(container.querySelector(X_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(
      `text-decoration: ${newValue}`,
    );
    expect(container.querySelector(Y_AXIS_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(
      `text-decoration: ${newValue}`,
    );
    expect(container.querySelector(DATA_LABEL_SELECTOR)?.firstElementChild).toHaveStyle(`text-decoration: ${newValue}`);
  });
});

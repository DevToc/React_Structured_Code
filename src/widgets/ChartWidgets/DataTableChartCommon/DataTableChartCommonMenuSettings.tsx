import { ChangeEvent, ReactElement, useCallback, useEffect, useRef } from 'react';
import cloneDeep from 'lodash.clonedeep';

import { SidePanelHeader } from 'modules/common/components/SidePanel';
import {
  ChartSettings,
  ChartSettingsColorPicker,
  ChartSettingsDivider,
  ChartSettingsEntry,
  ChartSliderInput,
  ChartStyle,
  DataPrefix,
  DataSuffix,
  DataTab,
  GridLines,
  HorizontalAxis,
  Legend,
  NumberFormat,
  NumberFormatSwitch,
  SeriesColorPicker,
  SetupTab,
  Switcher,
  VerticalAxis,
} from 'modules/Editor/components/SideMenuSettings/ChartSettings';
import { WidgetId } from 'types/idTypes';
import { DataTabTable } from 'modules/Editor/components/SideMenuSettings/ChartSettings/DataTabTable';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { useEditor, useWidget } from 'widgets/sdk';
import { ChartWidgetData, NumberFormatSettingsType } from 'widgets/ChartWidgets/ChartWidget.types';
import { AxisSetting } from './ChartSettingsAxis';
import { useHighchartsData } from 'widgets/ChartWidgets/Chartwidget.hooks';
import { DEFAULT_NUMBER_FORMAT } from 'widgets/ChartWidgets/ChartWidget.config';
import { getRandomPatterns } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommon.helpers';
import {
  LegendFontColor,
  LegendFontSettings,
  LegendFontStyle,
  LegendFontWeight,
} from 'widgets/ChartWidgets/DataTableChartCommon/TextStyleSettings';

import { ALLOW_SINGLE_SERIES_CHARTS, FORCE_SINGLE_SERIES_CHARTS } from './DataTableChartCommon.config';
import { WidgetType } from 'types/widget.types';
import { LabelSetting, LabelSettingWithoutAxis } from './ChartSettingsLabel';

interface WidgetMenuSettingsProps {
  widgetId?: WidgetId;
  showDataLabels?: boolean;
  showAxisConfiguration?: boolean;
  showNumberFormatSwitch?: boolean;
  showXAxisConfiguration?: boolean;
  showYAxisConfiguration?: boolean;
  showLabelsConfiguration?: boolean;
  showLegendsConfiguration?: boolean;
  showGridLinesConfiguration?: boolean;
  showBorderColor?: boolean;
  showBorderWidth?: boolean;
  showDonutHole?: boolean;
  showPatterns?: boolean;
}

export const DataTableChartMenuSettings = ({
  showDataLabels = false,
  showAxisConfiguration = false,
  showNumberFormatSwitch = false,
  showXAxisConfiguration = false,
  showYAxisConfiguration = false,
  showLabelsConfiguration = false,
  showLegendsConfiguration = false,
  showGridLinesConfiguration = false,
  showBorderColor = false,
  showBorderWidth = false,
  showDonutHole = false,
  showPatterns = false,
}: WidgetMenuSettingsProps): ReactElement => {
  const { closeWidgetSideMenu, setChartWidgetSettingTabIndex, chartSettingsTabIndex } = useEditor();

  return (
    <>
      <SidePanelHeader title={'Edit Chart'} onClose={closeWidgetSideMenu} />
      <ChartSettings selectedTabIndex={chartSettingsTabIndex} setSelectedTabIndex={setChartWidgetSettingTabIndex}>
        <DataTab>
          {showDataLabels && (
            <NumberFormat>
              {showNumberFormatSwitch && <DataNumberFormat />}
              <DataLabelSuffix />
            </NumberFormat>
          )}
          {chartSettingsTabIndex === 0 && <ChartDataTable />}
        </DataTab>
        <SetupTab>
          <ChartStyle isDefaultOpen>
            <SeriesColor />
            {(showBorderColor || showBorderWidth) && <ChartSettingsDivider />}
            {showBorderColor && <BorderColor />}
            {showBorderWidth && <BorderWidth />}
            {(showDonutHole || showPatterns) && <ChartSettingsDivider />}
            {showDonutHole && <DonutHole />}
            {showPatterns && <Patterns />}
          </ChartStyle>
          {showGridLinesConfiguration && (
            <GridLines>
              <GridLineColor />
            </GridLines>
          )}
          {showAxisConfiguration && <AxisSetting />}
          {showXAxisConfiguration && !showAxisConfiguration && (
            <HorizontalAxis>
              <XAxisColor />
            </HorizontalAxis>
          )}
          {showYAxisConfiguration && !showAxisConfiguration && (
            <VerticalAxis>
              <YAxisColor />
            </VerticalAxis>
          )}
          <ChartDataLabel
            showAxisConfiguration={showAxisConfiguration}
            showLabelsConfiguration={showLabelsConfiguration}
          />
          {showLegendsConfiguration && <LegendConfig />}
        </SetupTab>
      </ChartSettings>
    </>
  );
};

const ChartDataLabel = ({ showAxisConfiguration = false, showLabelsConfiguration = false }) => {
  // If we need the label config with axis labels config, render the LabelSetting
  if (showLabelsConfiguration && showAxisConfiguration) return <LabelSetting />;

  // If we need the label config but not axis labels config.
  if (showLabelsConfiguration) return <LabelSettingWithoutAxis />;

  // If showLabelsConfiguration flag is false
  return null;
};

const ChartDataTable = () => {
  const { chartSettingsTabIndex } = useEditor();
  const { seriesMeta, seriesData, updateWidget } = useWidget<ChartWidgetData>();
  const optionRef = useRef({ seriesMeta, forceSingleSeries: true });

  useEffect(() => {
    optionRef.current = { seriesMeta, forceSingleSeries: true };
  }, [seriesMeta]);

  return (
    <DataTabTable
      // DataTabTable requires a non-proxy seriesData object to work properly
      // TODO: see if there's a better way to do this
      seriesData={cloneDeep(seriesData)}
      optionRef={optionRef}
      doUpdateWidget={updateWidget}
      doTableReloadWorkaround={chartSettingsTabIndex === 0}
    />
  );
};

const DataNumberFormat = () => {
  const { numberFormat: { format = DEFAULT_NUMBER_FORMAT } = {}, updateWidget } = useWidget<ChartWidgetData>();

  const onChangeNumberFormat = (format: NonNullable<NumberFormatSettingsType['format']>) => {
    updateWidget({ numberFormat: { format } });
  };

  return <NumberFormatSwitch onChange={onChangeNumberFormat} value={format} />;
};

const DataLabelSuffix = () => {
  const {
    updateWidget,
    dataLabels: { prefix = '', suffix = '' },
    numberFormat: { format = DEFAULT_NUMBER_FORMAT } = {},
    widgetId,
  } = useWidget<ChartWidgetData>();

  const onChangeLabelPrefix = (event: ChangeEvent<HTMLInputElement>) =>
    updateWidget({ dataLabels: { prefix: event.target.value } });
  const onChangeLabelSuffix = (event: ChangeEvent<HTMLInputElement>) =>
    updateWidget({ dataLabels: { suffix: event.target.value } });

  const showValueModification =
    format === 'value' || (format === 'percentage' && getWidgetTypeFromId(widgetId) !== WidgetType.PieChart); // Percentage is only supported in Pie Chart
  if (!showValueModification) return null;

  return (
    <>
      <DataPrefix value={prefix} onChange={onChangeLabelPrefix} />
      <DataSuffix value={suffix} onChange={onChangeLabelSuffix} />
    </>
  );
};

const BorderColor = () => {
  const {
    updateWidget,
    generalOptions: { borderColor },
  } = useWidget<ChartWidgetData>();
  const onChangeBorderColor = (color: string) => updateWidget({ generalOptions: { borderColor: color } });

  return <ChartSettingsColorPicker label='Border color' color={borderColor} onChange={onChangeBorderColor} />;
};

const SeriesColor = () => {
  const { widgetId, seriesData, seriesMeta, updateWidget } = useWidget<ChartWidgetData>();
  const { colors } = seriesMeta;
  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  const onSetSeriesColor = useCallback(
    (color: string, index: number) => {
      if (colorsRef.current[index] !== color) {
        const newColors = [...colorsRef.current];
        newColors[index] = color;
        updateWidget({ seriesMeta: { colors: newColors } });
      }
    },
    [updateWidget],
  );

  const widgetType = getWidgetTypeFromId(widgetId);
  const allowSingleSeries = ALLOW_SINGLE_SERIES_CHARTS.includes(widgetType);
  const forceSingleSeries = FORCE_SINGLE_SERIES_CHARTS.includes(widgetType);

  const { colorPickerSeries } = useHighchartsData({
    seriesData,
    seriesMeta,
    allowSingleSeries,
    forceSingleSeries,
  });

  return <SeriesColorPicker label='Chart color' series={colorPickerSeries} onChange={onSetSeriesColor} />;
};

const BorderWidth = () => {
  const {
    updateWidget,
    generalOptions: { borderWidth },
  } = useWidget<ChartWidgetData>();

  const onChangeBorderWidth = (width: number) => updateWidget({ generalOptions: { borderWidth: width } });

  return (
    <ChartSliderInput
      value={borderWidth}
      title={'Border width'}
      maxValue={5}
      minValue={0}
      onChange={onChangeBorderWidth}
    />
  );
};

const DonutHole = () => {
  const {
    updateWidget,
    generalOptions: { innerSize },
  } = useWidget<ChartWidgetData>();

  const onChangeInnerSizePercentage = (innerSize: number) => updateWidget({ generalOptions: { innerSize } });

  return (
    <ChartSliderInput
      value={innerSize}
      title={'Donut hole'}
      maxValue={100}
      minValue={0}
      onChange={onChangeInnerSizePercentage}
      suffix={'%'}
    />
  );
};

const GridLineColor = () => {
  const {
    updateWidget,
    grid: {
      style: { lineColor },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeGridLineColor = (color: string) => updateWidget({ grid: { style: { lineColor: color } } });

  return <ChartSettingsColorPicker label='Grid line color' color={lineColor} onChange={onChangeGridLineColor} />;
};

const XAxisColor = () => {
  const {
    updateWidget,
    xAxis: {
      style: { lineColor },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeXAxisLineColor = (color: string) => updateWidget({ xAxis: { style: { lineColor: color } } });

  return <ChartSettingsColorPicker label='Axis color' color={lineColor} onChange={onChangeXAxisLineColor} />;
};

const YAxisColor = () => {
  const {
    updateWidget,
    yAxis: {
      style: { lineColor },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeYAxisLineColor = (color: string) => updateWidget({ yAxis: { style: { lineColor: color } } });

  return <ChartSettingsColorPicker label='Axis color' color={lineColor} onChange={onChangeYAxisLineColor} />;
};

const LegendConfig = () => {
  const {
    updateWidget,
    legend: { enabled },
  } = useWidget<ChartWidgetData>();

  const onToggleLegend = () => updateWidget({ legend: { enabled: !enabled } });

  return (
    <Legend onToggle={onToggleLegend} isChecked={enabled}>
      <LegendFontSettings />
      <ChartSettingsEntry label={'Text style'}>
        <LegendFontColor />
        <LegendFontWeight />
        <LegendFontStyle />
      </ChartSettingsEntry>
    </Legend>
  );
};

const Patterns = () => {
  const {
    patterns: { enabled: isPatternsEnabled },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onTogglePatterns = () => {
    updateWidget({ patterns: { enabled: !isPatternsEnabled, list: !isPatternsEnabled ? getRandomPatterns() : [] } });
  };

  return <Switcher label='Show patterns' onToggle={onTogglePatterns} isChecked={isPatternsEnabled} />;
};

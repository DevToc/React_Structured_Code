import { ChangeEvent, ReactElement, Suspense, useCallback, useEffect, useRef } from 'react';
import cloneDeep from 'lodash.clonedeep';
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useWindowSize } from 'hooks/useWindowSize';

import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import {
  ChartSettings,
  ChartSettingsColorPicker,
  ChartSettingsDivider,
  ChartSliderInput,
  ChartStyle,
  Labels,
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
  VerticalAxis,
  Switcher,
  ChartSettingsEntry,
} from 'modules/Editor/components/SideMenuSettings/ChartSettings';
import { DataTabTable } from 'modules/Editor/components/SideMenuSettings/ChartSettings/DataTabTable';
import {
  LabelFontColor,
  LabelFontSettings,
  LabelFontStyle,
  LabelFontWeight,
  LegendFontColor,
  LegendFontSettings,
  LegendFontStyle,
  LegendFontWeight,
} from 'widgets/ChartWidgets/DataTableChartCommon/TextStyleSettings';
import { getRandomPatterns } from 'widgets/ChartWidgets/DataTableChartCommon/DataTableChartCommon.helpers';
import { AxisSetting } from 'widgets/ChartWidgets/DataTableChartCommon/ChartSettingsAxis';
import ChartSwapperMobile from 'widgets/ChartWidgets/DataTableChartCommon/ChartSwapperMobile';
import { DEFAULT_NUMBER_FORMAT } from 'widgets/ChartWidgets/ChartWidget.config';
import { useHighchartsData } from 'widgets/ChartWidgets/Chartwidget.hooks';
import { ChartWidgetData, NumberFormatSettingsType } from 'widgets/ChartWidgets/ChartWidget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { useWidget, useEditor } from 'widgets/sdk';

import { ReactComponent as ChartTypeIcon } from 'assets/icons/a11ymenu_bar_chart.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_circle.svg';
import { ReactComponent as SquareIcon } from 'assets/icons/square.svg';

import { WidgetId } from 'types/idTypes';
import { WidgetType } from 'types/widget.types';

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

export const ChartWidgetToolbarMobile = (): ReactElement => {
  const { deviceWidth } = useWindowSize();

  return (
    <Flex w={deviceWidth - 15} p='10px' gap='8px' align='center' data-testid='chart-widget-toolbar'>
      <ChartSwapperWrapper />
      <ToolbarDivider />
      <ChartSettingsWrapper />
      <ToolbarDivider />
      <AltTextMenuWrapper />
    </Flex>
  );
};

const ChartSwapperWrapper = () => {
  const { isOpen: isChartTypeOpen, onToggle: toggleChartType } = useDisclosure();

  return (
    <>
      <Box
        onClick={() => toggleChartType()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Border Style' icon={<ChartTypeIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Chart Type
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleChartType} isOpen={isChartTypeOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Select Chart Type</p>
              <CloseIcon onClick={toggleChartType} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <Box p={2}>
                <ChartSwapperMobile />
              </Box>
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
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
  } = useWidget<ChartWidgetData>();

  const onChangeLabelPrefix = (event: ChangeEvent<HTMLInputElement>) =>
    updateWidget({ dataLabels: { prefix: event.target.value } });
  const onChangeLabelSuffix = (event: ChangeEvent<HTMLInputElement>) =>
    updateWidget({ dataLabels: { suffix: event.target.value } });

  const showValueModification = format === 'value';
  if (!showValueModification) return null;

  return (
    <>
      <DataPrefix value={prefix} onChange={onChangeLabelPrefix} />
      <DataSuffix value={suffix} onChange={onChangeLabelSuffix} />
    </>
  );
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

  const { colorPickerSeries } = useHighchartsData({
    seriesData,
    seriesMeta,
    allowSingleSeries: false,
    forceSingleSeries: [WidgetType.PieChart, WidgetType.BarChart].includes(getWidgetTypeFromId(widgetId)),
  });

  return (
    <SeriesColorPicker
      label='Chart color'
      series={colorPickerSeries}
      onChange={onSetSeriesColor}
      placement='bottom-start'
    />
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

const ChartSettingsWrapper = ({
  showDataLabels = true,
  showAxisConfiguration = true,
  showNumberFormatSwitch = true,
  showXAxisConfiguration = true,
  showYAxisConfiguration = true,
  showLabelsConfiguration = true,
  showLegendsConfiguration = true,
  showGridLinesConfiguration = true,
  showBorderColor = true,
  showBorderWidth = true,
  showDonutHole = true,
  showPatterns = true,
}: WidgetMenuSettingsProps): ReactElement => {
  const { setChartWidgetSettingTabIndex, chartSettingsTabIndex } = useEditor();
  const { isOpen: isChartSettingsOpen, onToggle: toggleChartSettings } = useDisclosure();

  return (
    <>
      <Box
        onClick={() => toggleChartSettings()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Edit Chart' icon={<SquareIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Edit Chart
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleChartSettings} isOpen={isChartSettingsOpen}>
        <DrawerOverlay />
        {/* Without maxHeight set, drawer will go out of screen on iOS devices if insufficient screen height */}
        <DrawerContent style={{ maxHeight: '100%' }}>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Edit Chart</p>
              <CloseIcon onClick={toggleChartSettings} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ChartSettings
                selectedTabIndex={chartSettingsTabIndex}
                setSelectedTabIndex={setChartWidgetSettingTabIndex}
                isFitted={true}
              >
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
                  {showLabelsConfiguration && (
                    <Labels>
                      <LabelFontSettings />
                      <ChartSettingsEntry label={'Text style'}>
                        <LabelFontColor />
                        <LabelFontWeight />
                        <LabelFontStyle />
                      </ChartSettingsEntry>
                    </Labels>
                  )}
                  {showLegendsConfiguration && <LegendConfig />}
                </SetupTab>
              </ChartSettings>
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const AltTextMenuWrapper = () => {
  const { widgetId } = useWidget();
  return (
    <Box //
      mr='5px'
      p='10px 10px'
      as='div'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box w='75px' as='div'>
        <AltTextMenu widgetId={widgetId} />
      </Box>
    </Box>
  );
};

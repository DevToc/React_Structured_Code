import { ChangeEvent } from 'react';
import { FormControl, FormLabel, Stack, Switch } from '@chakra-ui/react';

import { Color } from 'types/basic.types';
import { ChartWidgetData } from 'widgets/ChartWidgets/ChartWidget.types';
import { useWidget, useSideMenuSetting } from 'widgets/sdk';
import { FontFamilySelect } from 'modules/common/components/FontFamilySelect';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import {
  Axis,
  ChartSettingsEntry,
  TextSetting,
  NumberSetting,
} from 'modules/Editor/components/SideMenuSettings/ChartSettings/ChartOptions';
import { SliderNumberInput } from 'modules/common/components/Input/SliderNumberInput';
import { FontSizeSelect } from 'modules/common/components/FontSizeSelect/FontSizeSelect';
import { SideSettingDivider } from 'modules/Editor/components/SideMenuSettings/SidemenuSettingsDivider';

export const AxisSetting = () => {
  return (
    <Axis>
      <XAxisTitle />
      <YAxisTitle />
      <AxisFont />
      <AxisTextStyle />
      <SideSettingDivider />
      <MinMaxSection />
      <SideSettingDivider />
      <XAxisLine />
      <YAxisLine />
      <AxisLineSubSettings />
    </Axis>
  );
};

export const XAxisTitle = () => {
  const {
    xAxis: { title: { text: xAxisTitle = '' } = {} },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'X-axis title';

  const onXAxisTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateWidget({ xAxis: { title: { text: event.target.value } } });
  };

  return (
    <TextSetting
      label={label}
      value={xAxisTitle}
      onChange={onXAxisTitleChange}
      placeholder={'Axis Title'}
      data-testid={'x-axes-title-input'}
    />
  );
};

export const YAxisTitle = () => {
  const {
    yAxis: { title: { text: yAxisTitle = '' } = {} },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Y-axis title';

  const onYAxisTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateWidget({ yAxis: { title: { text: event.target.value } } });
  };

  return (
    <TextSetting
      label={label}
      value={yAxisTitle}
      onChange={onYAxisTitleChange}
      placeholder={'Axis Title'}
      data-testid={'y-axes-title-input'}
    />
  );
};

export const AxisFont = () => {
  const label = 'Font';

  return (
    <ChartSettingsEntry label={label}>
      <Stack direction={'row'}>
        <AxisFontFamily />
        <AxisFontSize />
      </Stack>
    </ChartSettingsEntry>
  );
};

export const AxisFontFamily = () => {
  const {
    xAxis: { title: { style: { fontFamily: titleFontFamily = 'Inter' } = {} } = {} },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onTitleFontFamilyChange = (fontFamily: string) => {
    updateWidget({
      xAxis: { title: { style: { fontFamily } } },
      yAxis: { title: { style: { fontFamily } } },
    });
  };

  return (
    <FontFamilySelect
      fontFamily={titleFontFamily}
      onChange={onTitleFontFamilyChange}
      width='36'
      borderRadius='base'
      buttonProps={{
        size: 'xs',
        fontSize: '12px',
      }}
    />
  );
};

export const AxisFontSize = () => {
  const {
    xAxis: { title: { style: { fontSize: titleFontSize = '12px' } = {} } = {} },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onTitleFontSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateWidget({
      xAxis: { title: { style: { fontSize: event.target.value + 'px' } } },
      yAxis: { title: { style: { fontSize: event.target.value + 'px' } } },
    });
  };

  return (
    <FontSizeSelect
      data-testid={'axestitle-fontsize-select'}
      aria-label={'Axes title font size select'}
      value={parseInt(titleFontSize)}
      onChange={onTitleFontSizeChange}
      borderRadius='base'
      size='xs'
      width='72px'
    />
  );
};

export const AxisTextStyle = () => {
  const {
    xAxis: { title: { style: { color: titleFontColor = '' } = {} } = {} },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const { setAllowScrolling } = useSideMenuSetting();

  const label = 'Text Color';

  const onTitleFontColorChange = (color: Color) => {
    updateWidget({
      xAxis: { title: { style: { color } } },
      yAxis: { title: { style: { color } } },
    });
  };

  return (
    <ChartSettingsEntry label={label}>
      <Stack direction={'row'}>
        <ColorPicker
          iconStyle={'text'}
          color={titleFontColor}
          label={'Font color'}
          placement={'left-start'}
          onChange={onTitleFontColorChange}
          onOpen={setAllowScrolling.off}
          onClose={setAllowScrolling.on}
          showNoColorOption={false}
        />
      </Stack>
    </ChartSettingsEntry>
  );
};

export const MinMaxSection = () => {
  return (
    <Stack direction={'row'} spacing={4}>
      <MinValue />
      <MaxValue />
    </Stack>
  );
};

export const MinValue = () => {
  const {
    seriesMeta: { minValue = '' },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Min value';

  const onMinValueChange = (minValue: string) => {
    updateWidget({ seriesMeta: { minValue } });
  };

  return (
    <NumberSetting
      label={label}
      value={minValue}
      onChange={onMinValueChange}
      placeholder={'Auto'}
      containerProps={{
        flexDirection: 'column',
        alignItems: 'start',
        gap: 1,
      }}
      width={'100%'}
    />
  );
};

export const MaxValue = () => {
  const {
    seriesMeta: { maxValue = '' },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Max value';

  const onMaxValueChange = (maxValue: string) => {
    updateWidget({ seriesMeta: { maxValue } });
  };

  return (
    <NumberSetting
      label={label}
      value={maxValue}
      onChange={onMaxValueChange}
      placeholder={'Auto'}
      containerProps={{
        flexDirection: 'column',
        alignItems: 'start',
        gap: 1,
      }}
      width={'100%'}
    />
  );
};

export const XAxisLine = () => {
  const {
    xAxis: { enableLine: enableXAxisLine = true },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Show x-axis line';

  const onShowXAxisLineChange = () => {
    updateWidget({ xAxis: { enableLine: !enableXAxisLine } });
  };

  return (
    <ChartSettingsEntry
      label={label}
      containerProps={{
        as: FormControl,
      }}
      labelProps={{
        as: FormLabel,
      }}
    >
      <Switch onChange={onShowXAxisLineChange} isChecked={enableXAxisLine} />
    </ChartSettingsEntry>
  );
};

export const YAxisLine = () => {
  const {
    yAxis: { enableLine: enableYAxisLine = true },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Show y-axis line';

  const onShowYAxisLineChange = () => {
    updateWidget({ yAxis: { enableLine: !enableYAxisLine } });
  };

  return (
    <ChartSettingsEntry
      label={label}
      containerProps={{
        as: FormControl,
      }}
      labelProps={{
        as: FormLabel,
      }}
    >
      <Switch onChange={onShowYAxisLineChange} isChecked={enableYAxisLine} />
    </ChartSettingsEntry>
  );
};

export const AxisLineSubSettings = () => {
  const {
    xAxis: { enableLine: enableXAxisLine = true },
    yAxis: { enableLine: enableYAxisLine = true },
  } = useWidget<ChartWidgetData>();

  if (!enableXAxisLine && !enableYAxisLine) {
    return null;
  }

  return (
    <>
      <AxisLineColor />
      <AxisLineWidth />
    </>
  );
};

export const AxisLineColor = () => {
  const {
    xAxis: {
      style: { lineColor },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const { setAllowScrolling } = useSideMenuSetting();

  const label = 'Axis color';

  const onAxisLineColorChange = (lineColor: Color) => {
    updateWidget({
      xAxis: { style: { lineColor } },
      yAxis: { style: { lineColor } },
    });
  };

  return (
    <ChartSettingsEntry label={label}>
      <ColorPicker
        color={lineColor}
        onChange={onAxisLineColorChange}
        onOpen={setAllowScrolling.off}
        onClose={setAllowScrolling.on}
        placement='left'
      />
    </ChartSettingsEntry>
  );
};

export const AxisLineWidth = () => {
  const {
    xAxis: {
      style: { lineWidth },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Axis width';

  const onAxisLineWidthChange = (lineWidth: number) => {
    updateWidget({
      xAxis: { style: { lineWidth } },
      yAxis: { style: { lineWidth } },
    });
  };

  return (
    <SliderNumberInput
      title={label}
      value={lineWidth}
      maxValue={5}
      minValue={1}
      onChange={onAxisLineWidthChange}
      fontSize={'sm'}
      sliderWidth={'8rem'}
      containerProps={{
        sx: {
          '& > div': {
            margin: 0,
          },
          '& .chakra-slider': {
            marginRight: '0.5rem',
          },
        },
      }}
      titleProps={{ fontWeight: 'normal' }}
      numberInputProps={{ textAlign: 'left', w: 12 }}
    />
  );
};

export const ShowAxisLabel = () => {
  const {
    xAxis: { enablelabels: enableAxisLabels = true },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Show Axis labels';

  const onShowAxislabelsChange = () => {
    updateWidget({
      xAxis: { enablelabels: !enableAxisLabels },
      yAxis: { enablelabels: !enableAxisLabels },
    });
  };

  return (
    <ChartSettingsEntry label={label}>
      <Switch onChange={onShowAxislabelsChange} isChecked={enableAxisLabels} />
    </ChartSettingsEntry>
  );
};

export const AxisLabelFont = () => {
  const label = 'Font';

  return (
    <ChartSettingsEntry label={label}>
      <Stack direction={'row'}>
        <AxisLabelFontFamily />
        <AxisLabelFontSize />
      </Stack>
    </ChartSettingsEntry>
  );
};

export const AxisLabelFontFamily = () => {
  const {
    xAxis: {
      labelStyle: { fontFamily: axisLabelFontFamily = 'Inter' },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onAxislabelsFontFamilyChange = (fontFamily: string) => {
    updateWidget({
      xAxis: { labelStyle: { fontFamily } },
      yAxis: { labelStyle: { fontFamily } },
    });
  };

  return <FontFamilySelect fontFamily={axisLabelFontFamily} onChange={onAxislabelsFontFamilyChange} />;
};

export const AxisLabelFontSize = () => {
  const {
    xAxis: {
      labelStyle: { fontSize: axisLabelFontSize = 12 },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onAxislabelsFontSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateWidget({
      xAxis: { labelStyle: { fontSize: event.target.value } },
      yAxis: { labelStyle: { fontSize: event.target.value } },
    });
  };

  return (
    <FontSizeSelect
      data-testid={'axeslabel-fontsize-select'}
      aria-label={'Axes label font size select'}
      value={axisLabelFontSize}
      onChange={onAxislabelsFontSizeChange}
    />
  );
};

export const AxisLabelTextStyle = () => {
  const {
    xAxis: {
      labelStyle: { color: axisLabelColor = '' },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const { setAllowScrolling } = useSideMenuSetting();

  const label = 'Text Style';

  const onAxislabelsColorChange = (color: Color) => {
    updateWidget({
      xAxis: { labelStyle: { color } },
      yAxis: { labelStyle: { color } },
    });
  };

  return (
    <ChartSettingsEntry label={label}>
      <Stack direction={'row'}>
        <ColorPicker
          iconStyle={'text'}
          color={axisLabelColor}
          label={'Font color'}
          onChange={onAxislabelsColorChange}
          onOpen={setAllowScrolling.off}
          onClose={setAllowScrolling.on}
          showNoColorOption={false}
        />
      </Stack>
    </ChartSettingsEntry>
  );
};

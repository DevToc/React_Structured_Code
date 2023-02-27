import { ChangeEvent, useCallback } from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

import { ChartSettingsEntry, Labels } from 'modules/Editor/components/SideMenuSettings/ChartSettings/ChartOptions';
import { useWidget } from 'widgets/sdk';
import { ChartWidgetData } from '../ChartWidget.types';
import { FontSettings, TextSettings } from './TextStyleSettings';
import { SideSettingDivider } from 'modules/Editor/components/SideMenuSettings/SidemenuSettingsDivider';

export const LabelSetting = () => {
  return (
    <Labels>
      <XAxisLabel />
      <XAxisSubSetting />
      <SideSettingDivider />
      <YAxisLabel />
      <YAxisSubSetting />
      <SideSettingDivider />
      <DataLabel />
      <DataLabelSubSetting />
    </Labels>
  );
};

export const XAxisSubSetting = () => {
  const {
    xAxis: { enablelabels: enableLabels = true },
  } = useWidget<ChartWidgetData>();

  if (!enableLabels) return null;

  return (
    <>
      <XAxisLabelFont />
      <XAxisLabelText />
    </>
  );
};

export const YAxisSubSetting = () => {
  const {
    yAxis: { enablelabels: enableLabels = true },
  } = useWidget<ChartWidgetData>();

  if (!enableLabels) return null;

  return (
    <>
      <YAxisLabelFont />
      <YAxisLabelText />
    </>
  );
};

export const DataLabelSubSetting = () => {
  const {
    dataLabels: { enabled: enableLabels },
  } = useWidget<ChartWidgetData>();

  if (!enableLabels) return null;

  return (
    <>
      <DataLabelFont />
      <DataLabelText />
    </>
  );
};

export const LabelSettingWithoutAxis = () => {
  const {
    dataLabels: { enabled: enableLabels },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onShowDataLabelChange = () => {
    updateWidget({ dataLabels: { enabled: !enableLabels } });
  };

  return (
    <Labels isCheck={enableLabels} onToggle={onShowDataLabelChange}>
      <DataLabelFont />
      <DataLabelText />
    </Labels>
  );
};

export const XAxisLabel = () => {
  const {
    xAxis: { enablelabels = true },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Show x-axis labels';

  const onShowXAxisLabelChange = () => {
    updateWidget({ xAxis: { enablelabels: !enablelabels } });
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
      <Switch onChange={onShowXAxisLabelChange} isChecked={enablelabels} />
    </ChartSettingsEntry>
  );
};

export const XAxisLabelFont = () => {
  const {
    xAxis: {
      labelStyle: { fontFamily, fontSize },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onFontFamilyChange = useCallback(
    (fontFamily: string) => {
      updateWidget({
        xAxis: { labelStyle: { fontFamily } },
      });
    },
    [updateWidget],
  );

  const onFontSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateWidget({ xAxis: { labelStyle: { fontSize: `${event.target.value}px` } } });
    },
    [updateWidget],
  );

  return (
    <FontSettings
      fontFamily={fontFamily}
      fontSize={fontSize}
      onChangeFontFamily={onFontFamilyChange}
      onChangeFontSize={onFontSizeChange}
    />
  );
};

export const XAxisLabelText = () => {
  const {
    xAxis: {
      labelStyle: { color, fontStyle, fontWeight },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onFontColorChange = useCallback(
    (color: string) => {
      updateWidget({
        xAxis: { labelStyle: { color } },
      });
    },
    [updateWidget],
  );

  const onFontWeightChange = useCallback(
    (fontWeight: string) => {
      updateWidget({ xAxis: { labelStyle: { fontWeight } } });
    },
    [updateWidget],
  );

  const onFontStyleChange = useCallback(
    (fontStyle: string) => {
      updateWidget({ xAxis: { labelStyle: { fontStyle } } });
    },
    [updateWidget],
  );

  return (
    <TextSettings
      fontColor={color}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      onFontColorChange={onFontColorChange}
      onFontWeightChange={onFontWeightChange}
      onFontStyleChange={onFontStyleChange}
    />
  );
};

export const YAxisLabel = () => {
  const {
    yAxis: { enablelabels = true },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Show y-axis labels';

  const onShowYAxisLabelChange = () => {
    updateWidget({ yAxis: { enablelabels: !enablelabels } });
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
      <Switch onChange={onShowYAxisLabelChange} isChecked={enablelabels} />
    </ChartSettingsEntry>
  );
};

export const YAxisLabelFont = () => {
  const {
    yAxis: {
      labelStyle: { fontFamily, fontSize },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onFontFamilyChange = useCallback(
    (fontFamily: string) => {
      updateWidget({
        yAxis: { labelStyle: { fontFamily } },
      });
    },
    [updateWidget],
  );

  const onFontSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateWidget({ yAxis: { labelStyle: { fontSize: `${event.target.value}px` } } });
    },
    [updateWidget],
  );

  return (
    <FontSettings
      fontFamily={fontFamily}
      fontSize={fontSize}
      onChangeFontFamily={onFontFamilyChange}
      onChangeFontSize={onFontSizeChange}
    />
  );
};

export const YAxisLabelText = () => {
  const {
    yAxis: {
      labelStyle: { color, fontStyle, fontWeight },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onFontColorChange = useCallback(
    (color: string) => {
      updateWidget({
        yAxis: { labelStyle: { color } },
      });
    },
    [updateWidget],
  );

  const onFontWeightChange = useCallback(
    (fontWeight: string) => {
      updateWidget({ yAxis: { labelStyle: { fontWeight } } });
    },
    [updateWidget],
  );

  const onFontStyleChange = useCallback(
    (fontStyle: string) => {
      updateWidget({ yAxis: { labelStyle: { fontStyle } } });
    },
    [updateWidget],
  );

  return (
    <TextSettings
      fontColor={color}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      onFontColorChange={onFontColorChange}
      onFontWeightChange={onFontWeightChange}
      onFontStyleChange={onFontStyleChange}
    />
  );
};

export const DataLabel = () => {
  const {
    dataLabels: { enabled: enableLabels },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const label = 'Show data labels';

  const onShowDataLabelChange = () => {
    updateWidget({ dataLabels: { enabled: !enableLabels } });
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
      <Switch onChange={onShowDataLabelChange} isChecked={enableLabels} />
    </ChartSettingsEntry>
  );
};

export const DataLabelFont = () => {
  const {
    dataLabels: {
      style: { fontFamily, fontSize },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onFontFamilyChange = useCallback(
    (fontFamily: string) => {
      updateWidget({
        dataLabels: { style: { fontFamily } },
      });
    },
    [updateWidget],
  );

  const onFontSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateWidget({
        dataLabels: { style: { fontSize: `${event.target.value}px` } },
      });
    },
    [updateWidget],
  );

  return (
    <FontSettings
      fontFamily={fontFamily}
      fontSize={fontSize}
      onChangeFontFamily={onFontFamilyChange}
      onChangeFontSize={onFontSizeChange}
    />
  );
};

export const DataLabelText = () => {
  const {
    dataLabels: {
      style: { color, fontStyle, fontWeight },
    },
    updateWidget,
  } = useWidget<ChartWidgetData>();

  const onFontColorChange = useCallback(
    (color: string) => {
      updateWidget({ dataLabels: { style: { color } } });
    },
    [updateWidget],
  );

  const onFontWeightChange = useCallback(
    (fontWeight: string) => {
      updateWidget({ dataLabels: { style: { fontWeight } } });
    },
    [updateWidget],
  );

  const onFontStyleChange = useCallback(
    (fontStyle: string) => {
      updateWidget({ dataLabels: { style: { fontStyle } } });
    },
    [updateWidget],
  );

  return (
    <TextSettings
      fontColor={color}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      onFontColorChange={onFontColorChange}
      onFontWeightChange={onFontWeightChange}
      onFontStyleChange={onFontStyleChange}
    />
  );
};

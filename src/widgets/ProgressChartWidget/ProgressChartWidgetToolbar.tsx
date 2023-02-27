import { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';

import { ProgressChartType, ProgressChartWidgetData } from './ProgressChartWidget.types';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { SliderPopover } from 'modules/common/components/ToolbarPopover';
import { convertDonutSizeChartDataToInput, convertDonutSizeInputToChartData } from './ProgressChartWidget.helpers';
import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { useEditor, useWidget } from 'widgets/sdk';

import { ReactComponent as CornerRadiusIcon } from 'assets/icons/corner_radius.svg';
import { ReactComponent as DonutHoleIcon } from 'assets/icons/donut_hole.svg';
import { ReactComponent as BarHeightIcon } from 'assets/icons/bar_height.svg';
import { MAX_BAR_HEIGHT, MIN_BAR_HEIGHT } from './ProgressChartWidget.config';
import { useTranslation } from 'react-i18next';

const DONUT_TYPES = [ProgressChartType.Donut, ProgressChartType.HalfDonut];

const BAR_HEIGHT_RANGE = MAX_BAR_HEIGHT - MIN_BAR_HEIGHT;

export const ProgressChartWidgetToolbar = () => {
  return (
    <Flex gap='2' align='center'>
      <DataColorOptions />
      <ToolbarDivider />
      <CornerRoundingOption />
      <DonutHoleOption />
      <BarHeightOption />
    </Flex>
  );
};

const DataColorOptions = () => {
  const { nonDataColor, dataColor, updateWidget } = useWidget<ProgressChartWidgetData>();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'progressChartToolbar', useSuspense: false });

  const onUpdateNonDataColor = (color: string) => updateWidget({ nonDataColor: color });
  const onUpdateDataColor = (color: string) => updateWidget({ dataColor: color });

  const nonDataLabel = t('nonDataColor.label');
  const dataLabel = t('dataColor.label');

  return (
    <>
      <ColorPicker color={nonDataColor} onChange={onUpdateNonDataColor} label={nonDataLabel} />
      <ColorPicker color={dataColor} onChange={onUpdateDataColor} label={dataLabel} />
    </>
  );
};

const CornerRoundingOption = () => {
  const { cornerRadius, updateWidget } = useWidget<ProgressChartWidgetData>();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'progressChartToolbar', useSuspense: false });

  const onUpdateCornerRadius = (radius: number) => updateWidget({ cornerRadius: radius / 100 });

  const label = t('cornerRadius.label');

  return (
    <SliderPopover
      title={label}
      label={label}
      icon={<CornerRadiusIcon />}
      value={Math.round(cornerRadius * 100)}
      min={0}
      max={100}
      suffix={'%'}
      onChange={onUpdateCornerRadius}
      activeIconStyle={{ '& path': { fill: 'upgrade.blue.700' } }}
    />
  );
};

const DonutHoleOption = () => {
  const { donutSize, type, updateWidget } = useWidget<ProgressChartWidgetData>();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'progressChartToolbar', useSuspense: false });

  const onUpdateDonutSize = (size: number) => updateWidget({ donutSize: convertDonutSizeInputToChartData(size, type) });

  const label = t('donutSize.label');

  /**
   * donutSize needs to be normalized due to issues rendering certain percentages
   * This will prevent setting donutSize to those percentages.
   */
  const donutSizeNormalized = useMemo(
    () => Math.round(convertDonutSizeChartDataToInput(donutSize, type)),
    [donutSize, type],
  );

  if (!DONUT_TYPES.includes(type)) return null;

  return (
    <SliderPopover
      title={label}
      label={label}
      icon={<DonutHoleIcon />}
      value={donutSizeNormalized}
      min={0}
      max={100}
      suffix={'%'}
      onChange={onUpdateDonutSize}
      activeIconStyle={{ '& path': { fill: 'upgrade.blue.700' } }}
    />
  );
};

const BarHeightOption = () => {
  const { type, barHeight, updateWidget, heightPx } = useWidget<ProgressChartWidgetData>();
  const { boundingBox } = useEditor();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'progressChartToolbar', useSuspense: false });

  const label = t('barHeight.label');

  const onUpdateBarHeight = (height: number) => {
    const scale = heightPx / barHeight;

    // barHeight is normalized to range between [5, 50] in the toolbar
    // Use min/max normalization to determine the heightPx from the new height
    updateWidget({
      barHeight: height,
      heightPx: (((height - MIN_BAR_HEIGHT) / BAR_HEIGHT_RANGE) * BAR_HEIGHT_RANGE + MIN_BAR_HEIGHT) * scale,
    });

    // Update BB after redux state update
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  if (type !== ProgressChartType.Bar) return null;

  return (
    <SliderPopover
      title={label}
      label={label}
      icon={<BarHeightIcon />}
      value={barHeight}
      min={MIN_BAR_HEIGHT}
      max={MAX_BAR_HEIGHT}
      onChange={onUpdateBarHeight}
      activeIconStyle={{ '& path': { fill: 'upgrade.blue.700' } }}
    />
  );
};

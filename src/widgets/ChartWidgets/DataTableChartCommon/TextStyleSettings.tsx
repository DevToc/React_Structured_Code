import React from 'react';
import { useWidget, useSideMenuSetting } from 'widgets/sdk';
import { ChartWidgetData } from 'widgets/ChartWidgets/ChartWidget.types';
import { ChangeEvent, useCallback } from 'react';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { ReactComponent as ItalicIcon } from 'assets/icons/italic.svg';
import { ReactComponent as UnderlineIcon } from 'assets/icons/underline.svg';
import { ReactComponent as BoldIcon } from 'assets/icons/bold.svg';
import { FontFamilySelect } from 'modules/common/components/FontFamilySelect';
import { FontSizeSelect } from 'modules/common/components/FontSizeSelect';
import { ChartSettingsEntry } from 'modules/Editor/components/SideMenuSettings/ChartSettings';

export type FontSettingsProps = {
  fontSize: string;
  fontFamily: string;
  onChangeFontSize: (event: ChangeEvent<HTMLSelectElement>) => void;
  onChangeFontFamily: (fontFamily: string) => void;
};

export const FontSettings = ({ fontSize, onChangeFontSize, fontFamily, onChangeFontFamily }: FontSettingsProps) => {
  return (
    <Flex alignItems='center' gap={3} justifyContent='space-between' color='font.500' fontSize='sm' py='2'>
      Font
      <Flex alignItems='right' gap={3}>
        <FontFamilySelect
          fontFamily={fontFamily}
          onChange={onChangeFontFamily}
          borderRadius='base'
          width='36'
          buttonProps={{ size: 'xs' }}
        />
        <FontSizeSelect
          value={parseInt(fontSize)}
          onChange={onChangeFontSize}
          width='16'
          size='xs'
          aria-label='Font size'
          borderRadius='base'
        />
      </Flex>
    </Flex>
  );
};

export type TextSettingsProps = {
  fontColor: string;
  fontStyle: string;
  fontWeight: string;
  onFontColorChange: (fontColor: string) => void;
  onFontStyleChange: (fontStyle: string) => void;
  onFontWeightChange: (fontWeight: string) => void;
};

export const TextSettings = React.memo(
  ({
    fontColor,
    fontStyle,
    fontWeight,
    onFontColorChange,
    onFontStyleChange,
    onFontWeightChange,
  }: TextSettingsProps) => {
    const label = 'Text Style';
    const colorLabel = 'Font color';
    const boldLabel = 'Bold';
    const italicLabel = 'Italic';

    const { setAllowScrolling } = useSideMenuSetting();

    const onFontWeightClick = () => {
      const newFontWeight = fontWeight === 'normal' ? 'bold' : 'normal';
      onFontWeightChange(newFontWeight);
    };

    const onFontStyleClick = () => {
      const newFontStyle = fontStyle === 'normal' ? 'italic' : 'normal';
      onFontStyleChange(newFontStyle);
    };

    return (
      <ChartSettingsEntry label={label}>
        <ColorPicker
          iconStyle='text'
          color={fontColor}
          label={colorLabel}
          placement={'left-start'}
          onChange={onFontColorChange}
          onOpen={setAllowScrolling.off}
          onClose={setAllowScrolling.on}
        />
        <Tooltip hasArrow placement='bottom' label={boldLabel} bg='black'>
          <IconButton
            isActive={fontWeight === 'bold'}
            onClick={onFontWeightClick}
            size='sm'
            aria-label={boldLabel}
            variant='icon-btn-toolbar'
            icon={<BoldIcon />}
          />
        </Tooltip>
        <Tooltip hasArrow placement='bottom' label={italicLabel} bg='black'>
          <IconButton
            isActive={fontStyle === 'italic'}
            onClick={onFontStyleClick}
            size='sm'
            aria-label={italicLabel}
            variant='icon-btn-toolbar'
            icon={<ItalicIcon />}
          />
        </Tooltip>
      </ChartSettingsEntry>
    );
  },
);

export const LabelFontColor = () => {
  const {
    updateWidget,
    dataLabels: {
      style: { color },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeLabelColor = useCallback(
    (color: string) =>
      updateWidget({
        dataLabels: { style: { color } },
        xAxis: { labelStyle: { color } },
        yAxis: { labelStyle: { color } },
      }),
    [updateWidget],
  );
  const { setAllowScrolling } = useSideMenuSetting();

  return (
    <ColorPicker
      iconStyle='text'
      color={color}
      label='Font color'
      placement={'left-start'}
      onChange={onChangeLabelColor}
      onOpen={setAllowScrolling.off}
      onClose={setAllowScrolling.on}
    />
  );
};

export const LegendFontColor = () => {
  const {
    updateWidget,
    legend: {
      labelStyle: { color },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeLegendColor = useCallback(
    (color: string) =>
      updateWidget({
        legend: { labelStyle: { color } },
      }),
    [updateWidget],
  );

  const { setAllowScrolling } = useSideMenuSetting();

  return (
    <ColorPicker
      iconStyle='text'
      color={color}
      label='Font color'
      placement={'left-start'}
      onChange={onChangeLegendColor}
      onOpen={setAllowScrolling.off}
      onClose={setAllowScrolling.on}
    />
  );
};

export const LegendFontWeight = () => {
  const {
    updateWidget,
    legend: {
      labelStyle: { fontWeight },
    },
  } = useWidget<ChartWidgetData>();

  const onClickFontWeight = useCallback(() => {
    const newValue = fontWeight === 'normal' ? 'bold' : 'normal';

    updateWidget({
      legend: { labelStyle: { fontWeight: newValue } },
    });
  }, [fontWeight, updateWidget]);

  return (
    <Tooltip hasArrow placement='bottom' label='Bold' bg='black'>
      <IconButton
        isActive={fontWeight === 'bold'}
        onClick={onClickFontWeight}
        size='sm'
        aria-label='Bold Icon'
        variant='icon-btn-toolbar'
        icon={<BoldIcon />}
      />
    </Tooltip>
  );
};

export const LabelFontWeight = () => {
  const {
    updateWidget,
    dataLabels: {
      style: { fontWeight },
    },
  } = useWidget<ChartWidgetData>();

  const onClickFontWeight = useCallback(() => {
    const newValue = fontWeight === 'normal' ? 'bold' : 'normal';

    updateWidget({
      dataLabels: { style: { fontWeight: newValue } },
      xAxis: { labelStyle: { fontWeight: newValue } },
      yAxis: { labelStyle: { fontWeight: newValue } },
    });
  }, [fontWeight, updateWidget]);

  return (
    <Tooltip hasArrow placement='bottom' label='Bold' bg='black'>
      <IconButton
        isActive={fontWeight === 'bold'}
        onClick={onClickFontWeight}
        size='sm'
        aria-label='Bold Icon'
        variant='icon-btn-toolbar'
        icon={<BoldIcon />}
      />
    </Tooltip>
  );
};

export const LegendFontStyle = () => {
  const {
    updateWidget,
    legend: {
      labelStyle: { fontStyle },
    },
  } = useWidget<ChartWidgetData>();

  const onClickFontStyle = useCallback(() => {
    const newValue = fontStyle === 'normal' ? 'italic' : 'normal';

    updateWidget({
      legend: { labelStyle: { fontStyle: newValue } },
    });
  }, [fontStyle, updateWidget]);

  return (
    <Tooltip hasArrow placement='bottom' label='Italic' bg='black'>
      <IconButton
        isActive={fontStyle === 'italic'}
        onClick={onClickFontStyle}
        size='sm'
        aria-label='Italic Icon'
        variant='icon-btn-toolbar'
        icon={<ItalicIcon />}
      />
    </Tooltip>
  );
};

export const LabelFontStyle = () => {
  const {
    updateWidget,
    dataLabels: {
      style: { fontStyle },
    },
  } = useWidget<ChartWidgetData>();

  const onClickFontStyle = useCallback(() => {
    const newValue = fontStyle === 'normal' ? 'italic' : 'normal';

    updateWidget({
      dataLabels: { style: { fontStyle: newValue } },
      xAxis: { labelStyle: { fontStyle: newValue } },
      yAxis: { labelStyle: { fontStyle: newValue } },
    });
  }, [fontStyle, updateWidget]);

  return (
    <Tooltip hasArrow placement='bottom' label='Italic' bg='black'>
      <IconButton
        isActive={fontStyle === 'italic'}
        onClick={onClickFontStyle}
        size='sm'
        aria-label='Italic Icon'
        variant='icon-btn-toolbar'
        icon={<ItalicIcon />}
      />
    </Tooltip>
  );
};

export const LegendTextDecoration = () => {
  const {
    updateWidget,
    legend: {
      labelStyle: { textDecoration },
    },
  } = useWidget<ChartWidgetData>();

  const onClickTextDecoration = useCallback(() => {
    const newValue = textDecoration === 'none' ? 'underline' : 'none';

    updateWidget({
      legend: { labelStyle: { textDecoration: newValue } },
    });
  }, [textDecoration, updateWidget]);

  return (
    <Tooltip hasArrow placement='bottom' label='Underline' bg='black'>
      <IconButton
        isActive={textDecoration === 'underline'}
        onClick={onClickTextDecoration}
        size='sm'
        aria-label='Underline Icon'
        variant='icon-btn-toolbar'
        icon={<UnderlineIcon />}
      />
    </Tooltip>
  );
};

export const LabelTextDecoration = () => {
  const {
    updateWidget,
    dataLabels: {
      style: { textDecoration },
    },
  } = useWidget<ChartWidgetData>();

  const onClickTextDecoration = useCallback(() => {
    const newValue = textDecoration === 'none' ? 'underline' : 'none';

    updateWidget({
      dataLabels: { style: { textDecoration: newValue } },
      xAxis: { labelStyle: { textDecoration: newValue } },
      yAxis: { labelStyle: { textDecoration: newValue } },
    });
  }, [textDecoration, updateWidget]);

  return (
    <Tooltip hasArrow placement='bottom' label='Underline' bg='black'>
      <IconButton
        isActive={textDecoration === 'underline'}
        onClick={onClickTextDecoration}
        size='sm'
        aria-label='Underline Icon'
        variant='icon-btn-toolbar'
        icon={<UnderlineIcon />}
      />
    </Tooltip>
  );
};

export const LabelFontSettings = () => {
  const {
    updateWidget,
    dataLabels: {
      style: { fontSize, fontFamily },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeFontSize = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      updateWidget({
        dataLabels: { style: { fontSize: event.target.value + 'px' } },
        xAxis: { labelStyle: { fontSize: event.target.value + 'px' } },
        yAxis: { labelStyle: { fontSize: event.target.value + 'px' } },
      }),
    [updateWidget],
  );

  const onChangeFontFamily = useCallback(
    (fontFamily: string) =>
      updateWidget({
        dataLabels: { style: { fontFamily } },
        xAxis: { labelStyle: { fontFamily } },
        yAxis: { labelStyle: { fontFamily } },
      }),
    [updateWidget],
  );

  return (
    <FontSettings
      fontFamily={fontFamily}
      fontSize={fontSize}
      onChangeFontFamily={onChangeFontFamily}
      onChangeFontSize={onChangeFontSize}
    />
  );
};

export const LegendFontSettings = () => {
  const {
    updateWidget,
    legend: {
      labelStyle: { fontSize, fontFamily },
    },
  } = useWidget<ChartWidgetData>();

  const onChangeFontSize = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      updateWidget({
        legend: { labelStyle: { fontSize: event.target.value + 'px' } },
      }),
    [updateWidget],
  );

  const onChangeFontFamily = useCallback(
    (fontFamily: string) =>
      updateWidget({
        legend: { labelStyle: { fontFamily } },
      }),
    [updateWidget],
  );

  return (
    <FontSettings
      fontFamily={fontFamily}
      fontSize={fontSize}
      onChangeFontFamily={onChangeFontFamily}
      onChangeFontSize={onChangeFontSize}
    />
  );
};

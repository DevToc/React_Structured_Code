import { FlexProps, FormLabelProps, TextProps } from '@chakra-ui/react';
import { SeriesColorPickerProps } from './SeriesColorPicker/SeriesColorPicker.types';
import React, { ChangeEvent } from 'react';

interface ChartAccordionProps {
  isDefaultOpen?: boolean;
  children: React.ReactNode;

  // Props for accordion that have a toggle button
  onToggle?: () => void;
  isCheck?: boolean;
}

interface ChartSettingsTabProps {
  children: React.ReactNode;
}

interface ChartSettingsEntryProps<ContainerPropType = FlexProps, LabelPropType = TextProps> {
  children?: React.ReactNode;

  // The label of a setting on the side panel
  label?: string;

  // The label translation key. if the label is set, this will be ignored.
  labelKey?: string;

  // The properties to the setting container
  containerProps?: ContainerPropType;

  // The properties to the label
  labelProps?: LabelPropType;
}

interface ChartSettingInputProps extends ChartSettingsEntryProps<FlexProps, FormLabelProps> {
  // data-test-id on the input element
  testId?: string;
}

interface ChartSettingsAxisSectionProps {
  children: React.ReactNode;
}

interface ChartSettingsColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

interface ChartSettingsTextProps {
  value: string;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface ChartSettingsRadioSelectorProps<T> {
  onChange: (nextValue: T) => void;
  value: T;
}

interface ChartSliderInputProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  suffix?: string;
}

export type {
  ChartAccordionProps,
  ChartSettingsAxisSectionProps,
  ChartSettingsTabProps,
  ChartSettingsTextProps,
  ChartSettingsRadioSelectorProps,
  ChartSettingInputProps,
  ChartSettingsEntryProps,
  ChartSettingsColorPickerProps,
  ChartSliderInputProps,
  SeriesColorPickerProps,
};

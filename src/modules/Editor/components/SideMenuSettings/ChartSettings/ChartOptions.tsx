import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import {
  ChakraComponent,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  forwardRef,
  InputProps,
  NumberInput,
  NumberInputFieldProps,
  NumberInputProps,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { ColorPicker } from '../../ColorPicker';
import { SettingsAccordion, SettingsAccordionToggle } from './ChartSettingsAccordion';
import {
  ChartAccordionProps,
  ChartSettingsColorPickerProps,
  ChartSliderInputProps,
  ChartSettingsTextProps,
  ChartSettingInputProps,
  ChartSettingsEntryProps,
  ChartSettingsRadioSelectorProps,
} from './ChartSettings.types';
import { SliderNumberInput } from 'modules/common/components/Input/SliderNumberInput';
import { NumberInputField } from 'modules/common/components/Input/NumberInputField';
import { Input } from 'modules/common/components/Input/Input';
import { useSideMenuSetting } from 'widgets/sdk';

/**
 * Shared settings menu components for all charts
 * Components can either be
 *
 * 1. Composed with the settings components:
 *  <VerticalAxis>
 *      <ChartSettingsColorPicker label='' color={color} onChange={onChange} />
 *      <SeriesColorPicker label='' color={color} onChange={onChange} />
 *  </VerticalAxis>
 *
 * 2. or custom components can be created with the base components: e.g.
 *   <SettingsAccordion title="custom component">
 *      <Heading>Custom</Heading>
 *      <MySlider />
 *      ...
 *   </SettingsAccordion>
 */
export const ChartSettingsEntry = memo(({ children, label, containerProps, labelProps }: ChartSettingsEntryProps) => {
  return (
    <Flex alignItems='center' gap={3} justifyContent='space-between' color='font.500' fontSize='sm' {...containerProps}>
      <Text margin={0} fontSize='sm' fontWeight={'normal'} {...labelProps}>
        {label}
      </Text>
      <Flex alignItems='right' gap={3}>
        {children}
      </Flex>
    </Flex>
  );
});

export const TextSetting: ChakraComponent<typeof Input, ChartSettingInputProps & InputProps> = forwardRef(
  function TextSetting(inProps, ref) {
    const { label, testId, containerProps, labelProps, ...otherProps } = inProps;

    return (
      <FormControl as={Flex} align='center' justifyContent={'space-between'} {...containerProps}>
        <FormLabel margin={0} fontSize='sm' fontWeight={'normal'} {...labelProps}>
          {label}
        </FormLabel>
        <Input
          ref={ref}
          size={'xs'}
          padding={'4px 8px'}
          margin={0}
          borderRadius={4}
          width={'3xs'}
          data-testid={testId}
          borderColor='outline.gray'
          {...otherProps}
        />
      </FormControl>
    );
  },
);

export const NumberSetting: ChakraComponent<
  typeof NumberInput,
  ChartSettingInputProps & NumberInputProps & { inputProps?: NumberInputFieldProps }
> = forwardRef(function NumberSetting(inProps, ref) {
  const { label, testId, containerProps, labelProps, inputProps, placeholder, ...otherProps } = inProps;
  return (
    <FormControl as={Flex} align='center' justifyContent={'space-between'} {...containerProps}>
      <FormLabel margin={0} fontSize='sm' fontWeight={'normal'} {...labelProps}>
        {label}
      </FormLabel>
      <NumberInput size={'xs'} {...otherProps}>
        <NumberInputField
          ref={ref}
          placeholder={placeholder}
          data-testid={testId}
          borderColor='outline.gray'
          {...inputProps}
        />
      </NumberInput>
    </FormControl>
  );
});

export const Legend = memo(
  ({ children, onToggle, isChecked }: { children: React.ReactNode; onToggle: () => void; isChecked: boolean }) => {
    const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
    const title = t('chartSettings.legendTitle');

    return (
      <SettingsAccordionToggle onToggle={onToggle} isChecked={isChecked} title={title}>
        {children}
      </SettingsAccordionToggle>
    );
  },
);

export const Switcher = memo(
  ({ onToggle, isChecked, label }: { onToggle: () => void; isChecked: boolean; label: string }) => {
    const switchId = label.replaceAll(' ', '-').toLowerCase() + 'toggle';

    return (
      <Flex
        alignItems='center'
        gap={3}
        justifyContent='space-between'
        color='font.500'
        mr='auto'
        fontSize='sm'
        py='2'
        mt='2'
      >
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor={switchId} mr='auto' fontSize='sm' fontWeight='400' mb='0'>
            {label}
          </FormLabel>
          <Switch onChange={onToggle} isChecked={isChecked} id={switchId} />
        </FormControl>
      </Flex>
    );
  },
);

export const NumberFormat = memo(({ children }: ChartAccordionProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const title = t('chartSettings.numberFormat');

  return (
    <SettingsAccordion title={title} isDefaultOpen>
      {children}
    </SettingsAccordion>
  );
});

export const Axis = memo(({ children }: { children: React.ReactNode }): ReactElement => {
  // const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false }); // TODO: on new PR
  const title = 'Axes';

  return (
    <SettingsAccordion
      title={title}
      accordionPanelProps={{
        display: 'flex',
        gap: 3,
        flexDirection: 'column',
      }}
    >
      {children}
    </SettingsAccordion>
  );
});

export const NumberFormatSwitch = memo(function NumberFormatSwitch({
  onChange,
  value,
}: ChartSettingsRadioSelectorProps<'percentage' | 'value'>) {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const label = t('chartSettings.numberFormatFormat');
  const percentageText = t('chartSettings.numberFormatPercentage');
  const valueText = t('chartSettings.numberFormatValue');

  return (
    <FormControl id={'data-table-format'} as={Flex} align={'center'} marginBottom={1}>
      <Text id={'data-table-format-label'} mr='auto' fontSize={'sm'}>
        {label}
      </Text>
      <RadioGroup onChange={onChange} value={value} name={label}>
        <Stack direction={'row'} spacing={6}>
          <Radio id={'data-format-percentage'} value={'percentage'} size={'sm'}>
            {percentageText}
          </Radio>
          <Radio id={'data-format-value'} value={'value'} size={'sm'}>
            {valueText}
          </Radio>
        </Stack>
      </RadioGroup>
    </FormControl>
  );
});

export const DataPrefix = memo(({ value, onBlur, onChange }: ChartSettingsTextProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const label = t('chartSettings.dataPrefix');

  return (
    <Flex align='center'>
      <Text mr='auto' fontSize='sm'>
        {label}
      </Text>
      <Input
        size={'xs'}
        fontSize={'12px'}
        padding={'6px 8px 6px 8px'}
        margin={'6px 0'}
        borderRadius={4}
        borderColor={'outline.gray'}
        width={'7rem'}
        aria-label='number format prefix'
        placeholder='e.g. $, £, €'
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        data-testid='number-format-prefix'
      />
    </Flex>
  );
});

export const DataSuffix = memo(({ value, onBlur, onChange }: ChartSettingsTextProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const label = t('chartSettings.dataSuffix');

  return (
    <Flex align='center'>
      <Text mr='auto' fontSize='sm'>
        {label}
      </Text>
      <Input
        size={'xs'}
        fontSize={'12px'}
        padding={'6px 8px 6px 8px'}
        margin={'8px 0'}
        borderRadius={4}
        borderColor={'outline.gray'}
        width={'7rem'}
        aria-label='number format suffix'
        placeholder='e.g. kg, ft, M, °'
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        data-testid='number-format-suffix'
      />
    </Flex>
  );
});

export const Labels = memo(({ children, isCheck, onToggle = () => {} }: ChartAccordionProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const title = t('chartSettings.labelsTitle');

  // if the enable labels toggle is not undefined, which is a boolean,
  // then we need to have a toggle button on the accordion header.
  // Therefore, render accordion component with a toggle instead of the normal setting accordion.
  const Component = typeof isCheck === 'boolean' ? SettingsAccordionToggle : SettingsAccordion;

  return (
    <Component
      title={title}
      isChecked={isCheck ?? false} // When isChecked is undefined, isCheck is not used. fallback to false for typecheck
      onToggle={onToggle}
      accordionPanelProps={{
        display: 'flex',
        gap: 3,
        flexDirection: 'column',
      }}
    >
      {children}
    </Component>
  );
});

export const VerticalAxis = memo(({ isDefaultOpen, children }: ChartAccordionProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const title = t('chartSettings.verticalAxisTitle');

  return <SettingsAccordion title={title}>{children}</SettingsAccordion>;
});

export const HorizontalAxis = memo(({ isDefaultOpen, children }: ChartAccordionProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const title = t('chartSettings.horizontalAxisTitle');

  return <SettingsAccordion title={title}>{children}</SettingsAccordion>;
});

export const GridLines = memo(({ isDefaultOpen, children }: ChartAccordionProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const title = t('chartSettings.gridLinesTitle');

  return <SettingsAccordion title={title}>{children}</SettingsAccordion>;
});

export const ChartStyle = ({ isDefaultOpen, children }: ChartAccordionProps) => {
  const { t } = useTranslation('editor_side_menu_settings', { useSuspense: false });
  const title = t('chartSettings.chartStyleTitle');

  return (
    <SettingsAccordion isDefaultOpen={isDefaultOpen} title={title}>
      {children}
    </SettingsAccordion>
  );
};

export const ChartSettingsColorPicker = memo(({ label, color, onChange }: ChartSettingsColorPickerProps) => {
  const { setAllowScrolling } = useSideMenuSetting();
  return (
    <Flex align='center'>
      <Text mr='auto' fontSize='sm'>
        {label}
      </Text>
      <ColorPicker
        color={color}
        onChange={onChange}
        onClose={setAllowScrolling.on}
        onOpen={setAllowScrolling.off}
        placement='left'
      />
    </Flex>
  );
});

export const ChartSliderInput = ({ title, value, onChange, minValue, maxValue, suffix }: ChartSliderInputProps) => {
  return (
    <SliderNumberInput
      title={title}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      suffix={suffix}
      fontSize={'sm'}
      titleProps={{ fontWeight: 'normal' }}
      numberInputProps={{ textAlign: 'left', w: 12 }}
      sliderWidth={120}
      onChange={onChange}
      containerProps={{ pt: 2 }}
    />
  );
};

export const ChartSettingsDivider = styled(Divider)`
  width: calc(100% + 2rem);
  margin: 1rem 0;
  margin-left: -1rem;
`;

import { ChangeEvent, useCallback } from 'react';
import { Flex, Tooltip, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { normalizeNumber } from 'utils/number';
import { useWidget } from 'widgets/sdk';
import { FontStyleOption, FontWeightOption, LabelTextWidgetData, TextDecorationOption } from './LabelTextWidget.types';
import { ToolbarNumberInput } from 'modules/common/components/Toolbar/ToolbarNumberInput';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { FontFamilySelect } from 'modules/common/components/FontFamilySelect';

import { ReactComponent as BoldIcon } from 'assets/icons/bold.svg';
import { ReactComponent as ItalicIcon } from 'assets/icons/italic.svg';
import { ReactComponent as UnderlineIcon } from 'assets/icons/underline.svg';
import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { FontSizeSelect } from 'modules/common/components/FontSizeSelect';
import { Input } from 'modules/common/components/Input/Input';

export const LabelTextToolbar = () => {
  const { hasFontSizeOption } = useWidget<LabelTextWidgetData>();

  return (
    <Flex gap='2' align='center' data-testid='metric-text-widget-toolbar'>
      <ValueInput />
      <ToolbarDivider />
      <FontColorOption />
      <FontFamilyOption />
      {/* TODO should remove this check when toolbar is updated */}
      {!!hasFontSizeOption && <FontSizeOption />}
      <ToolbarDivider />
      <FontStyleOptions />
    </Flex>
  );
};

const ValueInput = () => {
  const { value, isNumeric, suffix, updateWidget } = useWidget<LabelTextWidgetData>();

  // On change callback if the label is numeric
  const updateNumericValue = useCallback(
    (newValue: number) => {
      const newValueNormalized = `${normalizeNumber(0, 100, newValue)}`;
      if (value === newValueNormalized) return;

      updateWidget({ value: newValueNormalized });
    },
    [updateWidget, value],
  );

  // On change callback if the label is non-numeric
  const updateStringValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateWidget({ value: e.target.value || '' });
    },
    [updateWidget],
  );

  return isNumeric ? (
    <ToolbarNumberInput
      value={parseFloat(value) || 0}
      label={'Chart Value'}
      suffix={suffix}
      onChange={updateNumericValue}
    />
  ) : (
    // TODO update the styling when a non-numeric label is required - currently there are no widgets that use a non-numeric label text widget
    <Input placeholder={'Label'} value={value} onChange={updateStringValue} size={'xs'} />
  );
};

const FontFamilyOption = () => {
  const {
    style: { fontFamily },
    updateWidget,
  } = useWidget<LabelTextWidgetData>();

  const updateFontFamily = useCallback(
    (newFont: string) => {
      updateWidget({ style: { fontFamily: newFont } });
    },
    [updateWidget],
  );

  return <FontFamilySelect onChange={updateFontFamily} fontFamily={fontFamily} />;
};

const FontSizeOption = () => {
  const {
    style: { fontSize },
    updateWidget,
  } = useWidget<LabelTextWidgetData>();

  const updateFontSize = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value;
    if (!value) return;

    const newSize = parseFloat(value);
    updateWidget({ heightPx: newSize, style: { fontSize: newSize } });
  };

  return <FontSizeSelect value={Math.floor(fontSize)} onChange={updateFontSize} />;
};

const FontColorOption = () => {
  const {
    style: { color },
    updateWidget,
  } = useWidget<LabelTextWidgetData>();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'labelTextToolbar', useSuspense: false });
  const label = t('fontColor.label');

  const updateFontColor = useCallback(
    (newColor: string) => {
      updateWidget({ style: { color: newColor } });
    },
    [updateWidget],
  );

  return (
    <ColorPicker
      iconStyle='text'
      color={color ?? ''}
      label={label}
      onChange={updateFontColor}
      showNoColorOption={false}
    />
  );
};

const FontStyleOptions = () => {
  const {
    style: { fontWeight, fontStyle, textDecoration },
    updateWidget,
  } = useWidget<LabelTextWidgetData>();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'labelTextToolbar', useSuspense: false });

  const boldAriaLabel = t('fontStyle.bold.ariaLabel');
  const italicAriaLabel = t('fontStyle.italic.ariaLabel');
  const underlineAriaLabel = t('fontStyle.underline.ariaLabel');

  const isBold = fontWeight === FontWeightOption.Bold;
  const isItalic = fontStyle === FontStyleOption.Italic;
  const isUnderline = textDecoration === TextDecorationOption.Underline;

  const onSetBold = useCallback(() => {
    updateWidget({
      style: { fontWeight: !isBold ? FontWeightOption.Bold : FontWeightOption.Normal },
    });
  }, [isBold, updateWidget]);

  const onSetItalic = useCallback(() => {
    updateWidget({
      style: { fontStyle: !isItalic ? FontStyleOption.Italic : FontStyleOption.Normal },
    });
  }, [updateWidget, isItalic]);

  const onSetUnderline = useCallback(() => {
    updateWidget({
      style: { textDecoration: !isUnderline ? TextDecorationOption.Underline : TextDecorationOption.None },
    });
  }, [updateWidget, isUnderline]);

  return (
    <>
      <Tooltip hasArrow placement='bottom' label='Bold' bg='black'>
        <IconButton
          isActive={isBold}
          onClick={onSetBold}
          size='sm'
          aria-label={boldAriaLabel}
          variant='icon-btn-toolbar'
          icon={<BoldIcon />}
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Italic' bg='black'>
        <IconButton
          isActive={isItalic}
          onClick={onSetItalic}
          size='sm'
          aria-label={italicAriaLabel}
          variant='icon-btn-toolbar'
          icon={<ItalicIcon />}
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Underline' bg='black'>
        <IconButton
          isActive={isUnderline}
          onClick={onSetUnderline}
          size='sm'
          aria-label={underlineAriaLabel}
          variant='icon-btn-toolbar'
          icon={<UnderlineIcon />}
        />
      </Tooltip>
    </>
  );
};

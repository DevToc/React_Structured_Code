import { ReactElement } from 'react';
import { FormControl, FormLabel, NumberInput } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'modules/Editor/store';
import { setSize } from 'modules/Editor/store/infographSlice';
import { useSizeInputControl } from '../hooks';
import { PageSizeUnit } from 'types/paper.types';
import { pixelToCm, pixelToInch } from '../helpers';
import { MAX_NUMBER_INPUT, MIN_NUMBER_INPUT } from '../config';
import { NumberInputField } from 'modules/common/components/Input/NumberInputField';

interface PageSizeInputProps {
  unit: PageSizeUnit;
  value: number;
}

const getMaxNumberInput = (unit: PageSizeUnit): number => {
  switch (unit) {
    case PageSizeUnit.in:
      return pixelToInch(MAX_NUMBER_INPUT);
    case PageSizeUnit.cm:
      return pixelToCm(MAX_NUMBER_INPUT);
    default:
      break;
  }

  return MAX_NUMBER_INPUT;
};

const PageWidthInput = ({ value, unit }: PageSizeInputProps): ReactElement => {
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });
  const dispatch = useAppDispatch();
  const { internalValue, onBlur, onChange, onKeyDown } = useSizeInputControl({
    size: value,
    unit,
    setSize: (value: number) => {
      dispatch(setSize({ size: { widthPx: value } }));
    },
  });

  return (
    <FormControl>
      <FormLabel fontSize='xs' fontWeight='500' htmlFor='pageWidth'>
        {t('pageSize.widthInput.label')}
      </FormLabel>
      <NumberInput
        value={internalValue}
        max={getMaxNumberInput(unit)}
        min={MIN_NUMBER_INPUT}
        size='sm'
        fontWeight='400'
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <NumberInputField data-testid='page-menu-resize-width-input' id='pageWidth' ps='2' pe='2' />
      </NumberInput>
    </FormControl>
  );
};

const PageHeightInput = ({ value, unit }: PageSizeInputProps): ReactElement => {
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });
  const dispatch = useAppDispatch();
  const { internalValue, onBlur, onChange, onKeyDown } = useSizeInputControl({
    size: value,
    unit,
    setSize: (value: number) => {
      dispatch(setSize({ size: { heightPx: value } }));
    },
  });

  return (
    <FormControl>
      <FormLabel fontSize='xs' fontWeight='500' htmlFor='pageWidth'>
        {t('pageSize.heightInput.label')}
      </FormLabel>
      <NumberInput
        value={internalValue}
        max={getMaxNumberInput(unit)}
        min={MIN_NUMBER_INPUT}
        size='sm'
        fontWeight='400'
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <NumberInputField data-testid='page-menu-resize-height-input' id='pageWidth' ps='2' pe='2' />
      </NumberInput>
    </FormControl>
  );
};

export { PageWidthInput, PageHeightInput };

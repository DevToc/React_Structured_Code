import { ReactElement, FormEvent } from 'react';
import { FormControl, FormLabel, Select, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PageSizeUnit } from 'types/paper.types';

interface PapeSizeUnitSelectProps {
  value: PageSizeUnit;
  onChange?: (e: FormEvent<HTMLSelectElement>) => void;
}

const PapeSizeUnitSelect = ({ value, onChange }: PapeSizeUnitSelectProps): ReactElement => {
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });

  return (
    <Tooltip hasArrow placement='bottom' label={t('pageSize.unitSelect.label')} bg='black'>
      <FormControl>
        <FormLabel fontSize='xs' fontWeight='500' htmlFor='pageSizeUnit'>
          {t('pageSize.unitSelect.label')}
        </FormLabel>
        <Select
          data-testid='page-menu-resize-unit-select'
          id='pageSizeUnit'
          value={value}
          size='sm'
          fontWeight='400'
          aria-label={t('pageSize.unitSelect.ariaLabel')}
          onChange={onChange}
        >
          {Object.values(PageSizeUnit).map((v) => (
            <option key={`pageSizeUnit-${v}`} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
};

export { PapeSizeUnitSelect };

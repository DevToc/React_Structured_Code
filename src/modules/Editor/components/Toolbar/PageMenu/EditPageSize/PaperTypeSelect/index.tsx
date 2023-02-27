import { ReactElement, FormEvent, memo } from 'react';
import { Select, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PaperType } from 'types/paper.types';

interface PaperTypeSelectProps {
  value?: PaperType;
  onChange?: (e: FormEvent<HTMLSelectElement>) => void;
}

const PaperTypeSelect = memo(({ value, onChange }: PaperTypeSelectProps): ReactElement => {
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });

  return (
    <Tooltip hasArrow placement='bottom' label={t('pageSize.paperType.tooltip')} bg='black'>
      <Select
        data-testid='page-menu-resize-paper-select'
        value={value ?? ''}
        size='sm'
        aria-label={t('pageSize.paperType.ariaLabel')}
        onChange={onChange}
      >
        {value === undefined && <option value={'custom'}>Custom</option>}
        {Object.values(PaperType).map((v: string) => (
          <option key={`pagerType-${v}`} aria-selected={v === value} value={v}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
});

export { PaperTypeSelect };

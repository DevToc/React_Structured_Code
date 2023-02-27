import { Select, Tooltip } from '@chakra-ui/react';
import { VERTICAL_ALIGNMENT } from 'constants/fonts';

type VerticalAlignmentSelectProps = {
  verticalAlignment: string;
  onChange: (e: React.FormEvent<HTMLSelectElement>) => void;
};

export const VerticalAlignmentSelect = ({ onChange, verticalAlignment }: VerticalAlignmentSelectProps) => {
  return (
    <Tooltip hasArrow placement='bottom' label='Vertical Alignment' bg='black'>
      <Select
        onChange={onChange}
        value={verticalAlignment ?? VERTICAL_ALIGNMENT.top}
        width='90px'
        size='sm'
        aria-label='Vertical Alignment'
        borderColor='outline.gray'
      >
        {Object.values(VERTICAL_ALIGNMENT).map((alignment) => (
          <option key={`verticalAlign-${alignment}`} value={alignment}>
            {alignment}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
};

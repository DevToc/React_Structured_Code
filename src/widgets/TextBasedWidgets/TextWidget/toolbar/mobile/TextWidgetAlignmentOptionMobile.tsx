import { Button, Stack } from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from 'assets/icons/check.svg';
import { TEXT_ALIGNMENT } from 'constants/fonts';

interface TextWidgetAlignmentOptionMobileProps {
  selectedTag: string;
  onChange: (value?: any) => void;
}

export const TextWidgetAlignmentOptionMobile = ({ selectedTag, onChange }: TextWidgetAlignmentOptionMobileProps) => {
  const selectedIndex = Object.keys(TEXT_ALIGNMENT).findIndex((opt) => opt === selectedTag);

  const handleSelect = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    onChange(e.currentTarget.dataset.value);
  };

  return (
    <Stack p={2} h={'50%'}>
      {Object.keys(TEXT_ALIGNMENT).map((opt, i) => (
        <Button
          onClick={handleSelect}
          data-value={opt}
          size={'xs'}
          key={opt}
          isActive={i === selectedIndex}
          variant={'toolbar-dropdown-item'}
          rightIcon={<>{i === selectedIndex && <CheckIcon />}</>}
        >
          {opt}
        </Button>
      ))}
    </Stack>
  );
};

import { Button, Stack } from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from 'assets/icons/check.svg';
import { FONT_SIZES } from 'constants/fonts';

interface TextWidgetFontSizeOptionMobileProps {
  selectedTag: number;
  onChange: (value?: any) => void;
}

export const TextWidgetFontSizeOptionMobile = ({ selectedTag, onChange }: TextWidgetFontSizeOptionMobileProps) => {
  const selectedIndex = FONT_SIZES.findIndex((opt) => opt === selectedTag);

  const handleSelect = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    onChange(e.currentTarget.dataset.value);
  };

  return (
    <Stack p={2} h={300}>
      {FONT_SIZES.map((opt, i) => (
        <Button
          onClick={handleSelect}
          data-value={opt}
          size={'sm'}
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

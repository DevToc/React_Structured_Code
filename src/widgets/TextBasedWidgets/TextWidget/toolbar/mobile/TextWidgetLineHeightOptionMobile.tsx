import { Button, Stack } from '@chakra-ui/react';

import { TEXT_LINE_HEIGHT } from 'constants/fonts';

import { TextWidgetTag } from '../../../common/TextBasedWidgets.types';

import { ReactComponent as CheckIcon } from 'assets/icons/check.svg';

interface TextWidgetLineHeightOptionMobileProps {
  selectedTag: TextWidgetTag;
  onChange: (value?: any) => void;
}

export const TextWidgetLineHeightOptionMobile = ({ selectedTag, onChange }: TextWidgetLineHeightOptionMobileProps) => {
  const selectedIndex = TEXT_LINE_HEIGHT.findIndex((opt) => opt === selectedTag);

  const handleSelect = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    onChange(e.currentTarget.dataset.value);
  };

  return (
    <Stack p={2} h={300}>
      {TEXT_LINE_HEIGHT.map((opt, i) => (
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

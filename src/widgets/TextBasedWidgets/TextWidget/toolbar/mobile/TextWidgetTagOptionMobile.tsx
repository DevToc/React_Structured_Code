import { Button, Stack } from '@chakra-ui/react';
import { TextWidgetTag } from 'widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { ReactComponent as CheckIcon } from 'assets/icons/check.svg';

const TAG_OPTIONS = [
  {
    value: TextWidgetTag.Title,
    label: 'Title',
  },
  {
    value: TextWidgetTag.H1,
    label: 'H1',
  },
  {
    value: TextWidgetTag.H2,
    label: 'H2',
  },
  {
    value: TextWidgetTag.H3,
    label: 'H3',
  },
  {
    value: TextWidgetTag.H4,
    label: 'H4',
  },
  {
    value: TextWidgetTag.H5,
    label: 'H5',
  },
  {
    value: TextWidgetTag.H6,
    label: 'H6',
  },
  {
    value: TextWidgetTag.Paragraph,
    label: 'P',
  },
];

interface TextWidgetTagOptionMobileProps {
  selectedTag: TextWidgetTag;
  onChange: (value?: any) => void;
}

export const TextWidgetTagOptionMobile = ({ selectedTag, onChange }: TextWidgetTagOptionMobileProps) => {
  const selectedIndex = TAG_OPTIONS.findIndex((opt) => opt.value === selectedTag);

  const handleSelect = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    onChange(e.currentTarget.dataset.value);
  };

  return (
    <Stack p={2}>
      {TAG_OPTIONS.map((opt, i) => (
        <Button
          onClick={handleSelect}
          data-value={opt.value}
          size={'xs'}
          key={opt.value}
          isActive={i === selectedIndex}
          variant={'toolbar-dropdown-item'}
          rightIcon={<>{i === selectedIndex && <CheckIcon />}</>}
        >
          {opt.label}
        </Button>
      ))}
    </Stack>
  );
};

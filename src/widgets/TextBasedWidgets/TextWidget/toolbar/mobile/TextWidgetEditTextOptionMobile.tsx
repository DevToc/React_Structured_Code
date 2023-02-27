import React from 'react';
import { Textarea, Stack } from '@chakra-ui/react';

interface TextWidgetEditTextOptionMobileProps {
  textValue: string;
  onChange: (value?: any) => void;
}

export const TextWidgetEditTextOptionMobile = ({ textValue, onChange }: TextWidgetEditTextOptionMobileProps) => {
  const handleChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    onChange(e.currentTarget.dataset.value);
  };

  return (
    <Stack p={2} h={300}>
      <Textarea value={textValue} onChange={handleChange} size={'sm'} />
    </Stack>
  );
};

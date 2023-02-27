import { useState } from 'react';
import { Input, IconButton, InputGroup, InputLeftElement, InputRightElement, Center } from '@chakra-ui/react';

import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_circle.svg';

interface SearchInputProps {
  onSearch: (value: string) => void;
  clearSearch: () => void;
  label: string;
  clearButtonLabel: string;
}

export const SearchInput = ({ onSearch, clearSearch, label, clearButtonLabel }: SearchInputProps) => {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const handleSearch = (e: React.FormEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (value && value.trim()) onSearch(value);
  };

  const onClearSearch = () => {
    setValue('');
    clearSearch();
  };

  return (
    <InputGroup onSubmit={handleSearch} as='form' size='sm'>
      <InputLeftElement>
        <IconButton
          type='submit'
          size='xs'
          borderRadius='full'
          variant='unstyled'
          onClick={handleSearch}
          aria-label={label}
          icon={
            <Center>
              <SearchIcon stroke='var(--vg-colors-upgrade-blue-500' />
            </Center>
          }
          data-testid='search-icons-button'
        />
      </InputLeftElement>
      <Input w='100%' value={value} onChange={onChange} placeholder={label} aria-label={label} />
      <InputRightElement>
        <IconButton
          size='xs'
          borderRadius='full'
          variant='unstyled'
          onClick={onClearSearch}
          aria-label={clearButtonLabel}
          icon={
            <Center>
              <CloseIcon stroke='var(--vg-colors-outline-gray' />
            </Center>
          }
          data-testid='clear-icon-search-button'
        />
      </InputRightElement>
    </InputGroup>
  );
};

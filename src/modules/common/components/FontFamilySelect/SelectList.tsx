import { useRef, useLayoutEffect, createContext, useContext } from 'react';
import { Flex, Input, Box, InputGroup, InputLeftElement, Button } from '@chakra-ui/react';

import { Code } from 'constants/keyboard';
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';

export interface Option {
  value: string;
}

type SelectMenuListProps = {
  children: React.ReactNode;
  label: string;
  testId: string;
};

export const SelectMenuList = ({ children, label, testId }: SelectMenuListProps) => {
  const { onClose, value, optionRefList, options, onChange } = useContext(SelectContext);

  const optionsWrapperRef = useRef<HTMLDivElement>(null);
  const optionsWrapperId = 'select-list-box';

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!e.target) return;

    const id = (e.target as HTMLElement).id;
    if (!id) return;

    const isOptionTarget = !!optionRefList?.[id];
    const isListBoxTarget = id === optionsWrapperId;

    // focus next option
    if (e.key === Code.ArrowDown) {
      e.preventDefault();
      if (!isOptionTarget) return;

      const next = optionRefList[id].nextElementSibling as HTMLDivElement;
      if (next) next.focus();
    }

    // focus previous option
    if (e.key === Code.ArrowUp) {
      e.preventDefault();
      if (!isOptionTarget) return;

      const prev = optionRefList[id].previousElementSibling as HTMLDivElement;
      if (prev) prev.focus();
    }

    // focus first option if selected option does not exist in the filtered list
    if (e.key === Code.Tab) {
      if (e.shiftKey) return;
      if (!isListBoxTarget) return e.preventDefault();

      const selectedOption = options.find((option: Option) => option.value === value);
      if (selectedOption || !options.length) return;

      e.preventDefault();
      return (optionRefList[options[0].value] as HTMLElement).focus();
    }

    // focus the list box element if option
    // else close the dropdown
    if (e.key === Code.Escape) {
      if (isListBoxTarget) return onClose();

      if (isOptionTarget) {
        e.preventDefault();
        return optionsWrapperRef?.current?.focus();
      }
    }

    // select the focused option option
    if (e.key === Code.Enter || e.key === Code.Space) {
      if (isListBoxTarget) return;

      if (isOptionTarget && value !== id) {
        e.preventDefault();
        return onChange(id);
      }
    }
  };

  return (
    <Flex
      direction='column'
      gap={1}
      p={2}
      pt={0}
      maxH='284px'
      overflowY='auto'
      role='listbox'
      tabIndex={0}
      ref={optionsWrapperRef}
      aria-labelledby={label}
      onKeyDown={onKeyDown}
      id={optionsWrapperId}
      data-testid={testId}
    >
      {children}
    </Flex>
  );
};

type SelectMenuOptionProps = {
  option: Option;
  isSelected: boolean;
  children: React.ReactNode;
};

export const SelectMenuOption = ({ option, isSelected, children }: SelectMenuOptionProps) => {
  const { setOptionRef, onChange } = useContext(SelectContext);
  const { value } = option;
  const onClick = () => onChange(value);
  const setRef = (ref: Element | null) => setOptionRef(ref, value);

  // roving tabindex with the selected option
  const tabIndex = isSelected ? 0 : -1;

  return (
    <Button
      ref={setRef}
      id={value}
      data-testid={value}
      onClick={onClick}
      isActive={isSelected}
      aria-selected={isSelected}
      tabIndex={tabIndex}
      as='div'
      variant='toolbar-dropdown-item'
      role='option'
      size='xs'
      minH={6}
      maxH={6}
      cursor='pointer'
    >
      {children}
    </Button>
  );
};

type SelectMenuSearchProps = {
  onFilter: (optionArr: Option[]) => void;
  unfilteredOptions: Option[];
};

export const SelectMenuSearch = ({ onFilter, unfilteredOptions }: SelectMenuSearchProps) => {
  const { onClose } = useContext(SelectContext);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === Code.Escape) return onClose();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value?.toLowerCase();

    const filteredOptionList = unfilteredOptions.filter(
      (option) => !search || option.value.toLowerCase().indexOf(search) !== -1,
    );

    onFilter(filteredOptionList);
  };

  return (
    <Box p={2}>
      <InputGroup size='xs'>
        <InputLeftElement pointerEvents='none'>
          <SearchIcon width='16px' height='16px' stroke='var(--vg-colors-upgrade-blue-500' />
        </InputLeftElement>
        <Input onKeyDown={onKeyDown} placeholder='Search' onChange={onChange} />
      </InputGroup>
    </Box>
  );
};

// shared internal state for SelectMenu components
const SelectContext = createContext({
  setOptionRef: (ref: Element | null, optionValue: string) => {},
  onChange: (value: string) => {},
  onClose: () => {},
  optionRefList: {} as { [key: string]: Element },
  options: [] as Option[],
  value: '',
});

type SelectMenuProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  children: React.ReactNode;
};

export const SelectMenu = ({ children, onChange, value, options, onClose }: SelectMenuProps) => {
  const optionRefList = useRef<{ [value: string]: HTMLDivElement }>({});

  const setOptionRef = (ref: Element | null, optionValue: string) => {
    if (!ref) return null;
    optionRefList.current[optionValue] = ref as HTMLDivElement;
  };

  // scroll the selected option into view when the dropdown is opened
  useLayoutEffect(() => {
    if (optionRefList.current[value]) optionRefList.current[value].scrollIntoView({ block: 'center' });
  }, [value]);

  return (
    <Flex direction='column'>
      <SelectContext.Provider
        value={{ onChange, setOptionRef, optionRefList: optionRefList.current, value, options, onClose }}
      >
        {children}
      </SelectContext.Provider>
    </Flex>
  );
};

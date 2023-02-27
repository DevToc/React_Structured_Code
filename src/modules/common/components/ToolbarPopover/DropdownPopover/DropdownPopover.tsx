import { ComponentProps, ReactElement, ReactNode } from 'react';
import {
  Box,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  IconButton,
  Stack,
  Button,
  PopoverHeader,
  PlacementWithLogical,
  PopoverProps,
  Text,
} from '@chakra-ui/react';

import { ReactComponent as CheckIcon } from '../../../../../assets/icons/check.svg';
import { ReactComponent as ChevronDownIcon } from '../../../../../assets/icons/chevron_down.svg';
import { PopoverWrapper } from '../PopoverWrapper';

type DropdownPopoverOption = {
  value: any;
  label: string;
  icon?: ReactElement;
};

type DropdownPopoverOptions = Array<DropdownPopoverOption>;

interface DropdownPopoverProps extends Partial<PopoverProps> {
  w?: string | number;
  buttonWidth?: string | number;
  selectedIndex: number;
  options: DropdownPopoverOptions;
  toolbarIcon?: ReactElement;
  label: string;
  onSelect?: (value?: any) => void;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactElement; // icon to display for the selected option
  header?: ReactNode;
  placement?: PlacementWithLogical;
  buttonVariant?: string;
  optionsButtonVariant?: string;
  buttonOptionProps?: ComponentProps<typeof Button>;
  triggerSelectOnSameValue?: boolean; // Call onSelect even if we click on the already selected value
}

/**
 * DROPDOWN POPOVER COMPONENT
 *
 * This component renders a Chakra icon button that when clicked will
 * display a Chakra Popover component with dropdown options specified by
 * 'options' prop.
 *
 * If no icon is defined, a text button will render as the trigger.
 */
export const DropdownPopover = ({
  selectedIndex,
  options,
  toolbarIcon,
  label,
  header,
  selectedIcon,
  placement,
  buttonVariant,
  optionsButtonVariant,
  onSelect = () => {},
  w = '8.5rem',
  buttonOptionProps = {},
  showSelectedIcon = false,
  triggerSelectOnSameValue = true,
  ...popoverProps
}: DropdownPopoverProps) => {
  const handleSelect = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    const value = e.currentTarget.dataset.value;

    // Don't call onSelect for non-changed values.
    if (!triggerSelectOnSameValue && selectedIndex === options.findIndex((option) => option.value === value)) {
      return;
    }

    onSelect(value);
  };

  const selectedLabel = options[selectedIndex].label;

  return (
    <PopoverWrapper>
      <Popover placement={placement || 'bottom-start'} closeOnBlur={true} closeOnEsc={true} {...popoverProps}>
        {({ isOpen }) => (
          <>
            <Tooltip hasArrow placement={'bottom'} label={label} bg='black'>
              <Box>
                <PopoverTrigger>
                  {toolbarIcon ? (
                    <IconButton
                      variant={'icon-btn-toolbar-option'}
                      isActive={isOpen}
                      aria-label={label}
                      icon={toolbarIcon}
                      size='sm'
                    />
                  ) : (
                    <Button
                      leftIcon={options[selectedIndex]?.icon}
                      variant={buttonVariant || 'outline'}
                      rightIcon={<ChevronDownIcon />}
                      isActive={isOpen}
                      size={'xs'}
                      width={w}
                      _focus={{ boxShadow: 'outline' }}
                    >
                      <Text fontSize={'sm'} fontWeight={'500'} flexGrow='1' textAlign='left'>
                        {selectedLabel}
                      </Text>
                    </Button>
                  )}
                </PopoverTrigger>
              </Box>
            </Tooltip>
            {/* TODO add zindex hierarchy */}
            <Box zIndex={1001}>
              <PopoverContent w={w} boxShadow='md' padding='0'>
                {header && <PopoverHeader p={2}>{header}</PopoverHeader>}
                <Stack p={2}>
                  {options.map((opt, i) => (
                    <Button
                      leftIcon={opt.icon}
                      onClick={handleSelect}
                      data-value={opt.value}
                      size={'xs'}
                      key={opt.value}
                      isActive={i === selectedIndex}
                      variant={optionsButtonVariant || 'toolbar-dropdown-item'}
                      rightIcon={showSelectedIcon && i === selectedIndex ? selectedIcon || <CheckIcon /> : undefined}
                      {...buttonOptionProps}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Stack>
              </PopoverContent>
            </Box>
          </>
        )}
      </Popover>
    </PopoverWrapper>
  );
};

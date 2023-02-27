import { ReactElement } from 'react';
import {
  Button,
  Box,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  IconButton,
  VisuallyHidden,
  CSSObject,
} from '@chakra-ui/react';

import { SliderNumberInput } from '../../Input/SliderNumberInput';

interface SliderPopoverProps {
  value: number;
  title: string;
  label?: string;
  icon?: ReactElement;
  onChange?: (value: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  activeIconStyle?: CSSObject;
  buttonTitle?: string;
}

const DEFAULT_ACTIVE_ICON_STYLE = {
  bg: 'hover.blue',
};

/**
 * SLIDER POPOVER COMPONENT
 *
 * This component renders a Chakra icon button that when clicked will
 * display a Chakra Popover component with a slider and number input
 */
export const SliderPopover = ({
  value,
  icon,
  title,
  label = '',
  suffix = '',
  min = 0,
  max = 100,
  activeIconStyle,
  buttonTitle,
  onChange = () => {},
}: SliderPopoverProps) => {
  const iconStyle = activeIconStyle && {
    _active: {
      ...DEFAULT_ACTIVE_ICON_STYLE,
      ...activeIconStyle,
    },
  };

  return (
    <Popover placement={'bottom-start'} closeOnEsc={true}>
      {({ isOpen }) => (
        <>
          <Tooltip hasArrow placement={'bottom'} label={label} bg='black'>
            <Box>
              <PopoverTrigger>
                {buttonTitle ? (
                  <Button size='sm' fontWeight='semibold' variant={'icon-btn-toolbar-option'} isActive={isOpen}>
                    {buttonTitle}
                  </Button>
                ) : (
                  <IconButton
                    aria-label={label}
                    variant={'icon-btn-toolbar-option'}
                    icon={icon}
                    size='sm'
                    isActive={isOpen}
                    {...(iconStyle && { sx: iconStyle })}
                  />
                )}
              </PopoverTrigger>
            </Box>
          </Tooltip>
          <PopoverContent w={'100%'} boxShadow='md'>
            <VisuallyHidden>
              <PopoverHeader>{label}</PopoverHeader>
            </VisuallyHidden>
            <SliderNumberInput
              title={title}
              value={value}
              onChange={onChange}
              minValue={min}
              maxValue={max}
              suffix={suffix}
              sliderWidth={120}
              containerProps={{ p: 2, pt: 3 }}
            />
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

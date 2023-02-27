import { NumberInputField as ChakraNumberInputField } from '@chakra-ui/react';
import { isBrowser } from 'constants/browser';
import { ComponentProps, FocusEvent, forwardRef, MouseEvent } from 'react';
import { SAFARI_FOCUS_TIMEOUT } from './Inputs.config';

/**
 * NUMBER INPUT COMPONENT
 *
 * Renders a Chakra <NumberInputField /> component with the same props - when focused, will highlight
 * all text
 */
export const NumberInputField = forwardRef<HTMLInputElement, ComponentProps<typeof ChakraNumberInputField>>(
  ({ onClick, onFocus, ...chakraInputProps }, ref) => {
    // Highlight all text on focus
    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      e.preventDefault();

      /*
       * Safari has issues with the focus event and calling the select() function
       * Need to call after a timeout
       */
      if (isBrowser.SAFARI) {
        setTimeout(() => e.target.select(), SAFARI_FOCUS_TIMEOUT);
      } else {
        e.target.select();
      }

      onFocus?.(e);
    };

    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;

      // Firefox already has expected default behaviour
      if (!isBrowser.FIREFOX) {
        target.select();
      }

      onClick?.(e);
    };

    return <ChakraNumberInputField ref={ref} {...chakraInputProps} onFocus={handleFocus} onClick={handleClick} />;
  },
);

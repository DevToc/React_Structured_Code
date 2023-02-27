import { Input as ChakraInput } from '@chakra-ui/react';
import { isBrowser } from 'constants/browser';
import { ComponentProps, FocusEvent, forwardRef, MouseEvent } from 'react';
import { SAFARI_FOCUS_TIMEOUT } from './Inputs.config';

/**
 * INPUT COMPONENT
 *
 * Renders a Chakra <Input /> component with the same props
 * When focused, will highlight all text
 */
export const Input = forwardRef<HTMLInputElement, ComponentProps<typeof ChakraInput>>(
  ({ onFocus, onClick, ...chakraInputProps }, ref) => {
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

    return <ChakraInput {...chakraInputProps} ref={ref} onFocus={handleFocus} onClick={handleClick} />;
  },
);

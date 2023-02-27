import { ComponentProps, ReactElement } from 'react';
import { AccordionButton } from '@chakra-ui/react';
import { CHECKER_HEADER_HEIGHT } from '../../AccessibilityManager.config';

const CheckItemHeader = ({ children, ...props }: ComponentProps<typeof AccordionButton>): ReactElement => {
  return (
    <AccordionButton
      h={`${CHECKER_HEADER_HEIGHT}px`}
      p='0.75rem 1rem'
      alignItems={'center'}
      justifyContent={'space-between'}
      {...props}
    >
      {children}
    </AccordionButton>
  );
};

export { CheckItemHeader };

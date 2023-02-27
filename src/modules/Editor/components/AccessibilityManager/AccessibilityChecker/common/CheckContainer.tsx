import { ComponentProps, ReactElement } from 'react';
import { Flex, AccordionItem } from '@chakra-ui/react';

interface CheckContainerProps extends ComponentProps<typeof AccordionItem> {
  children?: React.ReactNode;
}

const CheckContainer = ({ children, ...props }: CheckContainerProps): ReactElement => {
  return (
    <AccordionItem w='100%' border='0' padding='1' {...props}>
      <Flex w='100%' direction='column' borderRadius='4' boxShadow={'0px 0px 4px rgba(0, 0, 0, 0.24)'}>
        {children}
      </Flex>
    </AccordionItem>
  );
};

export { CheckContainer };

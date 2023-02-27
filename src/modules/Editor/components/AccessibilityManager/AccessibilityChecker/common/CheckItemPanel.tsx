import { ComponentProps, ReactElement } from 'react';
import { AccordionPanel } from '@chakra-ui/react';

type CheckItemPanelProps = { isShow?: boolean } & ComponentProps<typeof AccordionPanel>;

const CheckItemPanel = ({ children, isShow = true, ...props }: CheckItemPanelProps): ReactElement | null => {
  if (!isShow) return null;

  return (
    <AccordionPanel p='0.75rem 1rem' {...props}>
      {children}
    </AccordionPanel>
  );
};

export { CheckItemPanel };

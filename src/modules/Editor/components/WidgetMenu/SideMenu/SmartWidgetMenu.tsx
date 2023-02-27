import { ReactElement } from 'react';
import { Flex, Button } from '@chakra-ui/react';

export const SmartWidgetMenu = (): ReactElement => {
  return (
    <Flex p='16px'>
      <Button size='sm'>Add smart widget</Button>
    </Flex>
  );
};

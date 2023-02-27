import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

type ScoreBadgeType = {
  children: ReactNode;
  isChecked: boolean;
};

export const ScoreBadge = ({ children, isChecked }: ScoreBadgeType) => {
  return (
    <Flex
      alignItems='center'
      ml='2'
      fontWeight='medium'
      fontSize='xs'
      bg={isChecked ? 'action.50' : 'red.50'}
      color={isChecked ? 'action.700' : 'red.600'}
      h='6'
      px='2'
      borderRadius='4'
    >
      {children}
    </Flex>
  );
};

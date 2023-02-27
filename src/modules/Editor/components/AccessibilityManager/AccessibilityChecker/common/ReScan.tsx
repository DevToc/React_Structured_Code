import { ComponentProps, ReactElement } from 'react';
import { Flex, Text, IconButton } from '@chakra-ui/react';
import { ReactComponent as RefreshIcon } from '../../../../../../assets/icons/a11ymenu_refresh.svg';

const ReScan = ({
  children,
  onClick,
  buttonAriaLabel,
  ...props
}: Partial<ComponentProps<typeof IconButton>>): ReactElement => {
  const { fontSize, fontWeight, lineHeight } = props;
  return (
    <Flex w='100%' direction='row' borderRadius={4} p='2' gap='2' bg={'upgrade.blue.50'} justifyContent='space-around'>
      <Text
        fontSize={fontSize ?? 'xs'}
        fontWeight={fontWeight ?? 600}
        lineHeight={lineHeight ?? 'var(--vg-lineHeights-shorter)'}
        display='flex'
        alignItems='center'
      >
        {children}
      </Text>

      <IconButton
        aria-label={buttonAriaLabel}
        size='sm'
        icon={<RefreshIcon color='var(--vg-colors-font-500)' height='24px' />}
        bg='transparent'
        onClick={onClick}
      />
    </Flex>
  );
};

export { ReScan };

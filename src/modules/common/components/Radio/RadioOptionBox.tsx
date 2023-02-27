import { Box, BoxProps, RadioProps } from '@chakra-ui/react';

const defaultProps = {
  p: '2',
  borderRadius: 'base',
};

export const RadioOptionBox = ({
  children,
  isDisabled,
  onClick,
  selected,
  selectedBgColor,
  boxProps = {},
}: RadioProps & { selected: boolean; selectedBgColor?: string; boxProps?: BoxProps }) => {
  const defaultSelectedBgColor = selectedBgColor ? selectedBgColor : 'upgrade.blue.50';

  return (
    <Box
      {...defaultProps}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      bgColor={!isDisabled && selected ? defaultSelectedBgColor : 'transparent'}
      onClick={onClick}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

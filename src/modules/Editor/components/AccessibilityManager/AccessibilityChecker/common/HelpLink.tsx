import { ComponentProps, ReactElement } from 'react';
import { Box, Link } from '@chakra-ui/react';

const HelpLink = ({ children, lineHeight, ...props }: ComponentProps<typeof Link>): ReactElement => {
  return (
    <Box lineHeight={lineHeight ?? 'var(--vg-lineHeights-none)'}>
      <Link fontSize='xs' variant='inline' isExternal {...props}>
        {children}
      </Link>
    </Box>
  );
};

export { HelpLink };

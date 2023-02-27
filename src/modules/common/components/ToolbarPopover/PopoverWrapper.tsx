import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { isBrowser } from 'constants/browser';

// It's necessary because in safari, without the translateZ, the Popover is hidden.
export const PopoverWrapper = styled(Box)`
  .chakra-popover__popper {
    ${() =>
      isBrowser.SAFARI
        ? css`
            z-index: var(--vg-zIndices-toolbar) !important;
          `
        : ''}
  }
  .chakra-popover__content {
    ${() =>
      isBrowser.SAFARI
        ? css`
            transform: translateZ(0) !important;
            transition: 0.1s;
          `
        : ''}
  }
`;

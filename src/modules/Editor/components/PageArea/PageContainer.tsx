import { ReactElement, ReactNode, forwardRef } from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from '@chakra-ui/react';
import { SCROLL_CONTAINER_ID } from './PageArea.config';

import { LOCK_COLOR, MOVEABLE_LOCK_CLASS } from '../../../../constants/bounding-box';

interface PageScrollContainerProps {
  children: ReactNode;
  mr?: string;
}

export const StyledScrollContainerBox = styled(Box)`
  overflow: auto;
  height: 100%;
  position: relative;
  background-color: var(--vg-colors-gray-100);

  .${MOVEABLE_LOCK_CLASS} .moveable-line.moveable-direction {
    background: ${LOCK_COLOR} !important;
  }
`;

export const PageScrollContainer = forwardRef<HTMLDivElement, PageScrollContainerProps>(
  ({ children, ...props }: PageScrollContainerProps, ref): ReactElement => (
    <StyledScrollContainerBox ref={ref} id={SCROLL_CONTAINER_ID} data-testid={SCROLL_CONTAINER_ID} {...props}>
      {children}
    </StyledScrollContainerBox>
  ),
);

interface PageTransformContainerProps {
  children: ReactNode;
  readonly?: boolean;
}

export const PageTransformContainer = ({ children, readonly = false }: PageTransformContainerProps): ReactElement => (
  <Box minH='100%' minW='100%' display='flex' position='absolute' pointerEvents={readonly ? 'none' : 'auto'}>
    <Flex position='relative' transform='scale(1)' flex='1'>
      <Flex position='relative' m='auto' shrink={0} justify='center'>
        <Flex p='24px' direction='column' position='relative'>
          {children}
        </Flex>
      </Flex>
    </Flex>
  </Box>
);

import { ReactElement, ReactNode, forwardRef } from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from '@chakra-ui/react';
import { useForwardRef } from 'hooks/useForwardRef';
import { LOCK_COLOR, MOVEABLE_LOCK_CLASS } from 'constants/bounding-box';
import { SCROLL_CONTAINER_ID } from './PageArea.config';

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
    <StyledScrollContainerBox ref={ref} id={SCROLL_CONTAINER_ID} {...props}>
      {children}
    </StyledScrollContainerBox>
  ),
);

interface PageTransformContainerProps {
  children: ReactNode;
  readonly?: boolean;
}

export const PageTransformContainer = forwardRef<HTMLDivElement, PageTransformContainerProps>(
  ({ children, readonly = false }: PageTransformContainerProps, ref): ReactElement => {
    const container_ref = useForwardRef<HTMLDivElement>(ref);
    return (
      <Box
        minH='100%'
        minW='100%'
        display='flex'
        position='absolute'
        ref={container_ref}
        pointerEvents={readonly ? 'none' : 'auto'}
      >
        <Flex position='relative' transform='scale(1)' flex='1'>
          <Flex position='relative' shrink={0} justify='center'>
            <Flex p='24px' direction='column' position='relative' m='0 auto auto'>
              {children}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    );
  },
);

import { Box } from '@chakra-ui/react';
import { ComponentProps } from 'react';

/**
 * POSITION ABSOLUTE CONTAINER
 *
 * Renders a Chakra <Box /> component with position: absolute, w=h=100%
 * Accepts Box props.
 */
export const AbsoluteContainer = (boxProps: ComponentProps<typeof Box>) => (
  <Box position={'absolute'} w={'full'} h={'full'} {...boxProps} />
);

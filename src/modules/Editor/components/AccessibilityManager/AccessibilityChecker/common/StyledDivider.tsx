import { Divider } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ACCESSIBILITY_MENU_WIDTH } from '../../AccessibilityManager.config';

const StyledDivider = styled(Divider)`
  width: calc(${ACCESSIBILITY_MENU_WIDTH}px - 2 * var(--vg-space-3));
  margin: var(--vg-space-2) 0;
  margin-left: -1rem;
  height: 1px;
  background-color: var(--vg-colors-divider-gray);
`;

export { StyledDivider };

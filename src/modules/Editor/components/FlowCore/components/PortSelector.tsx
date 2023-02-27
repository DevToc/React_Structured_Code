import styled from '@emotion/styled';
import { PortSelectorProps } from 'types/flowCore.types';

const PortSelector = styled.div<PortSelectorProps>`
  position: absolute;
  left: ${(props) => -(props.size / 2)}px;
  top: ${(props) => -(props.size / 2)}px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size}px;
  pointer-events: auto;
`;

export default PortSelector;

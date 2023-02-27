import styled from '@emotion/styled';
import { PortProps } from 'types/flowCore.types';

const Port = styled.div<PortProps>`
  display: flex;
  position: absolute;
  align-items: 'center';
  justify-content: 'center';
  left: ${(props) => -(props.size / 2)}px;
  top: ${(props) => -(props.size / 2)}px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: var(${(props) => (props.isHover ? '--vg-colors-blue-500' : '--vg-colors-gray-50')});
  border: 2px solid var(${(props) => (props.isHover ? '--vg-colors-gray-50' : '--vg-colors-blue-500')});
  border-radius: 20px;
  box-sizing: border-box;
`;

export default Port;

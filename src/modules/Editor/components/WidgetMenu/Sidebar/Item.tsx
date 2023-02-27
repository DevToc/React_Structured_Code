import { memo, ReactElement } from 'react';
import { SidebarItem } from '../WidgetMenu.types';
import styled from '@emotion/styled';

type SidebarButtonProps = {
  isActive: boolean;
};

const SidebarButton = styled.button<SidebarButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 14px;
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    outline: unset;
    background: var(--vg-colors-hover-gray);
    cursor: pointer;
  }

  &:focus {
    outline: unset;
    background: var(--vg-colors-hover-gray);
  }
  &:focus::after {
    content: '';
    border-left: 4px var(--vg-colors-upgrade-blue-500) solid;
    display: block;
    position: absolute;
    height: 100%;
    left: 0;
  }

  & > svg {
    width: 32px;
    height: 32px;
    padding: 2px;
  }
`;

const IconLabel = styled.span`
  padding: 2px;
`;

interface ItemProps {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
  id?: string;
}

export const Item = memo(({ id, item, isActive, onClick }: ItemProps): ReactElement => {
  const { icon: Icon, label } = item;
  const testId = `${label}${isActive ? '-active' : ''}`;

  return (
    <SidebarButton
      data-testid={testId}
      id={id}
      onClick={onClick}
      isActive={isActive}
      style={{
        background: isActive ? 'var(--vg-colors-hover-blue)' : '',
        color: isActive ? 'var(--vg-colors-blue-700)' : 'var(--vg-colors-black)',
      }}
    >
      <Icon />
      <IconLabel>{label}</IconLabel>
    </SidebarButton>
  );
});

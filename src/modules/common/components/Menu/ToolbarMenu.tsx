import { Box, MenuDivider } from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';
import { Menu } from './Menu';
import { MenuType } from './Menu.types';
import { MenuItem } from './MenuItem';

import { ReactComponent as CheckIcon } from '../../../../assets/icons/toolbar/check.svg';
import { isDevelopment, isPreview } from '../../../../utils/environment';

export interface ToolbarMenuProps {
  children: ReactNode;
  name: string;
  menu: MenuType;
  isRoot?: boolean;
  zIndex?: string;
}

export const ToolbarMenu = forwardRef<HTMLElement, ToolbarMenuProps>((inProps, ref) => {
  const { children, name, menu, isRoot = true, zIndex = '' } = inProps;

  return (
    <Menu buttonValue={children} isRoot={isRoot} ref={ref} key={name} zIndex={zIndex}>
      {Object.entries(menu).map(([key, { checked, data, Icon, label, onClick }]) => {
        if (data != null && label != null) {
          return (
            <ToolbarMenu name={label} menu={data} isRoot={false} key={label}>
              {Icon && <Icon />}
              {label}
            </ToolbarMenu>
          );
        } else if (label != null) {
          return (
            <MenuItem onClick={onClick} key={label} data-testid={key}>
              {Icon && <Icon />}
              {label}
              <Box flexGrow={1} />
              {checked && <CheckIcon />}
            </MenuItem>
          );
        } else {
          return <MenuDivider key={key} />;
        }
      })}
    </Menu>
  );
});

if (isDevelopment || isPreview) {
  ToolbarMenu.displayName = 'ToolbarMenu';
}

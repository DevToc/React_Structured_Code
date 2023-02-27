import React, { ReactNode } from 'react';
import {
  Button,
  ComponentWithAs,
  forwardRef,
  Menu as ChakraMenu,
  MenuButton,
  MenuButtonProps,
  MenuList,
  MenuListProps,
  MenuProps as ChakraMenuProps,
  useMenuContext,
  useMenuDescendant,
  useMenuDescendantsContext,
} from '@chakra-ui/react';
import { SubMenuButton } from './SubMenuButton';
import { SubMenuButtonProvider } from './useSubMenuButton';

import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron_down.svg';
import { ReactComponent as ChevronRightIcon } from '../../../../assets/icons/chevron_right.svg';

export interface MenuProps extends ChakraMenuProps {
  /**
   * The the menu items
   */
  children: ReactNode;
  /**
   * True if it is the root menu
   * False if it is the sub menu
   */
  isRoot?: boolean;
  /**
   * The props passing to the menu button element
   */
  menuButtonProps?: MenuButtonProps;
  /**
   * The props passing to the menu list element
   */
  menuListProps?: MenuListProps;
  /**
   * The menu button
   */
  buttonValue: ReactNode;
  zIndex?: string;
}

interface InternalMenuProps extends MenuProps {
  menu?: ReturnType<typeof useMenuContext>;
}

const InternalMenu: ComponentWithAs<'menu', InternalMenuProps> = forwardRef(function InternalMenu(inProps, ref) {
  const {
    children,
    isRoot = true,
    menu,
    menuButtonProps: menuButtonPropsProp = {},
    menuListProps = {},
    buttonValue,
    zIndex,
    ...other
  } = inProps;

  const { _active, _focus, _hover, ...otherMenuButtonPropsProp } = menuButtonPropsProp;
  const menuButtonProps = isRoot
    ? menuButtonPropsProp
    : {
        gap: '0.5rem',
        margin: '0.125rem 0',
        padding: '0.5rem 1rem 0.5rem 0.75rem',
        borderRadius: 0,
        borderLeft: ' 4px solid white',
        fontFamily: 'Inter, Oxygen, Helvetica, Arial, sans-serif',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '1.25rem',
        width: '100%',
        height: 'fit-content',
        sx: {
          textAlign: 'start',
        },

        _active: {
          boxShadow: 'none',
          ..._active,
        },

        _selected: {
          color: 'upgrade.blue.700',
          backgroundColor: 'hover.blue',
        },

        _focus: {
          backgroundColor: 'hover.gray',
          borderInlineStartColor: 'upgrade.blue.500',
          ..._focus,
        },

        _hover: {
          backgroundColor: 'hover.gray',
          borderInlineStartColor: 'hover.gray',

          _focus: {
            borderInlineStartColor: 'upgrade.blue.500',
          },
          ..._hover,
        },

        ...otherMenuButtonPropsProp,
      };

  const ButtonElement = isRoot ? MenuButton : SubMenuButton;

  return (
    <ChakraMenu placement={isRoot ? 'bottom-end' : 'right-start'} gutter={isRoot ? 8 : 4} {...other}>
      <ButtonElement
        ref={ref}
        as={Button}
        size={'sm'}
        variant={'ghost'}
        color={'font.500'}
        rightIcon={isRoot ? <ChevronDownIcon /> : <ChevronRightIcon />}
        {...menuButtonProps}
      >
        {buttonValue}
      </ButtonElement>
      <MenuList zIndex={zIndex} {...menuListProps}>
        {isRoot
          ? children
          : React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) {
                return null;
              }
              return React.cloneElement(child, {
                onClick: () => {
                  child.props.onClick?.();
                  menu?.onClose();
                },
              });
            })}
      </MenuList>
    </ChakraMenu>
  );
});

const SubMenuProvider = React.memo(function SubMenuProvider(props: { children: ReactNode }) {
  const { index, register } = useMenuDescendant({
    disabled: false,
  });

  const menu = useMenuContext();
  const descendants = useMenuDescendantsContext();

  const child = React.Children.only(props.children);

  return (
    <SubMenuButtonProvider value={{ index, menu, descendants, register }}>
      {React.isValidElement(child) ? React.cloneElement(child, { menu }) : null}
    </SubMenuButtonProvider>
  );
});

export const Menu: ComponentWithAs<'menu', MenuProps> = forwardRef(function Menu(inProps, ref) {
  const { isRoot } = inProps;

  return isRoot ? (
    <InternalMenu ref={ref} {...inProps} />
  ) : (
    <SubMenuProvider>
      <InternalMenu ref={ref} {...inProps} />
    </SubMenuProvider>
  );
});

import React, { useCallback, useEffect, useMemo } from 'react';
import { useClickable } from '../../../../libs/chakra-ui/clickable';
import { isActiveElement, isHTMLElement, focus, normalizeEventKey } from '@chakra-ui/utils';
import { useMergeRefs } from '../../../../libs/chakra-ui/hooks';
import { EventKeyMap } from '../../../../libs/chakra-ui/react-utils';
import {
  chakra,
  forwardRef,
  MenuItemProps,
  useStyles,
  SystemStyleObject,
  MenuIcon,
  MenuCommand,
  useMenuButton,
  HTMLChakraProps,
  MenuButtonProps,
  Box,
  useMenuContext,
} from '@chakra-ui/react';
import { useSubMenuButton } from './useSubMenuButton';

export interface StyledSubMenuButtonProps extends HTMLChakraProps<'button'> {}

const StyledSubMenuButton = forwardRef<StyledSubMenuButtonProps, 'button'>(function StyledSubMenuButton(inProps, ref) {
  const { type, ...other } = inProps;
  const styles = useStyles();

  /**
   * Given another component, use its type if present
   * Else, use no type to avoid invalid html, e.g. <a type="button" />
   * Else, fall back to "button"
   */
  const btnType = other.as || type ? type ?? undefined : 'button';

  const buttonStyles: SystemStyleObject = useMemo(
    () => ({
      textDecoration: 'none',
      color: 'inherit',
      userSelect: 'none',
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      textAlign: 'start',
      flex: '0 0 auto',
      justifyContent: 'start',
      outline: 0,
      gap: '0.5rem',
      backgroundColor: 'yellow',
      ...styles.item,
    }),
    [styles.item],
  );

  return <chakra.button ref={ref} type={btnType} {...other} __css={buttonStyles} />;
});

function isTargetMenuItem(target: EventTarget | null) {
  // this will catch `menuitem`, `menuitemradio`, `menuitemcheckbox`
  return isHTMLElement(target) && !!target.getAttribute('role')?.startsWith('menuitem');
}

export interface SubMenuButtonProps extends MenuItemProps, MenuButtonProps {}

export const SubMenuButton = forwardRef<SubMenuButtonProps, 'button'>(function SubMenuButton(inProps, ref) {
  const {
    as: As,
    icon,
    iconSpacing = '0.75rem',
    command,
    commandSpacing = '0.75rem',
    children,

    // useMenuItem props
    onMouseEnter: onMouseEnterProp,
    onMouseMove: onMouseMoveProp,
    onMouseLeave: onMouseLeaveProp,
    onClick: onClickProp,
    isDisabled,
    closeOnSelect = false,
    type: typeProp,

    ...other
  } = inProps;
  const { index, menu, descendants, register } = useSubMenuButton();
  const { setFocusedIndex, focusedIndex, closeOnSelect: menuCloseOnSelect, onClose, menuRef, menuId } = menu;

  const { isOpen: isChildMenuOpen, onToggle } = useMenuContext();

  const elementRef = React.useRef<HTMLDivElement>(null);
  const menuItemId = `${menuId}-menuitem-${index + 1}`;

  const onMouseEnter = React.useCallback(
    (event: any) => {
      onMouseEnterProp?.(event);
      if (isDisabled) return;
      setFocusedIndex(index);
    },
    [setFocusedIndex, index, isDisabled, onMouseEnterProp],
  );

  const onMouseMove = React.useCallback(
    (event: any) => {
      onMouseMoveProp?.(event);
      if (elementRef.current && !isActiveElement(elementRef.current)) {
        onMouseEnter(event);
      }
    },
    [onMouseEnter, onMouseMoveProp],
  );

  const onMouseLeave = React.useCallback(
    (event: any) => {
      onMouseLeaveProp?.(event);
      if (isDisabled) return;
      setFocusedIndex(-1);
    },
    [setFocusedIndex, isDisabled, onMouseLeaveProp],
  );

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      onClickProp?.(event as React.MouseEvent<HTMLButtonElement>);
      if (!isTargetMenuItem(event.currentTarget)) return;
      /**
       * Close menu and parent menus, allowing the MenuItem
       * to override its parent menu's `closeOnSelect` prop.
       */
      if (closeOnSelect ?? menuCloseOnSelect) {
        onClose();
      }

      if (!isChildMenuOpen) {
        if (elementRef.current) {
          focus(elementRef.current, {
            nextTick: true,
            selectTextIfInput: false,
            preventScroll: false,
          });
        } else if (menuRef.current && !isActiveElement(menuRef.current)) {
          focus(menuRef.current, { preventScroll: false });
        }
      } else {
        if (elementRef.current) {
          elementRef.current.blur();
        }
      }
    },
    [onClose, onClickProp, menuCloseOnSelect, menuRef, closeOnSelect, isChildMenuOpen],
  );

  const isFocused = index === focusedIndex;

  const menuItemRef = useMergeRefs(register, elementRef, ref);

  const clickableProps = useClickable({
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    ref: menuItemRef,
    isDisabled,
    isFocusable: true,
  });

  const menuItemProps = {
    ...other,
    ...clickableProps,
    type: typeProp ?? (clickableProps as any).type,
    role: 'menuitem',
    tabIndex: isFocused ? 0 : -1,
  };

  const { id: menuButtonId, ...otherButtonProps } = useMenuButton(menuItemProps, clickableProps.ref);

  const onFocusedKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const eventKey = normalizeEventKey(event);
      const keyMap: EventKeyMap = {
        ArrowDown: () => {
          const next = descendants.nextEnabled(index);
          if (next) setFocusedIndex(next.index);
        },
        ArrowUp: () => {
          const prev = descendants.prevEnabled(index);
          if (prev) setFocusedIndex(prev.index);
        },
      };

      const action = keyMap[eventKey];

      if (action) {
        event.preventDefault();
        event.stopPropagation();
        action(event);
      }
    },
    [setFocusedIndex, descendants, index],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const eventKey = normalizeEventKey(event);
      const keyMap: EventKeyMap = {
        Enter: onToggle,
        Space: onToggle,
      };

      const action = keyMap[eventKey];

      if (action) {
        event.preventDefault();
        event.stopPropagation();
        action(event);
      }
    },
    [onToggle],
  );

  useEffect(() => {
    if (isFocused) {
      const listener = onKeyDown as unknown as EventListener;
      document.addEventListener('keydown', listener);

      return () => {
        document.removeEventListener('keydown', listener);
      };
    }
  }, [isFocused, onKeyDown]);

  const shouldWrap = icon || command;

  const _children = shouldWrap ? <span style={{ pointerEvents: 'none', flex: 1 }}>{children}</span> : children;

  const Element = As || StyledSubMenuButton;

  const selectedStyle =
    isChildMenuOpen || isFocused
      ? {
          backgroundColor: 'hover.gray',
          borderInlineStartColor: 'upgrade.blue.500',

          _hover: {
            backgroundColor: 'hover.gray',
            borderInlineStartColor: 'upgrade.blue.500',

            _focus: {
              borderInlineStartColor: 'upgrade.blue.500',
            },
          },
          _focusWithin: {
            backgroundColor: 'hover.gray',
            borderInlineStartColor: 'upgrade.blue.500',
          },
        }
      : {};

  return (
    <Element
      id={`${menuItemId} ${menuButtonId}`}
      {...otherButtonProps}
      {...selectedStyle}
      onKeyDown={onFocusedKeyDown}
      data-focused={isChildMenuOpen || isFocused}
    >
      {icon && (
        <MenuIcon fontSize={'0.8em'} marginEnd={iconSpacing}>
          {icon}
        </MenuIcon>
      )}
      {_children}
      {command && <MenuCommand marginStart={commandSpacing}>{command}</MenuCommand>}
      <Box flexGrow={1} />
    </Element>
  );
});

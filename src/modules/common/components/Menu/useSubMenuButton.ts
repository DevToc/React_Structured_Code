import { useMenuContext, useMenuDescendantsContext } from '@chakra-ui/react';
import { createContext } from '../../../../libs/chakra-ui/react-utils';

export interface UseSubMenuButtonProps {
  index: number;
  menu: ReturnType<typeof useMenuContext>;
  descendants: ReturnType<typeof useMenuDescendantsContext>;
  register: (node: HTMLElement | null) => void;
}

export const [SubMenuButtonProvider, useSubMenuButton] = createContext<UseSubMenuButtonProps>({
  strict: false,
  name: 'SubMenuButtonContext',
});

export interface UseMenuButtonReturn extends ReturnType<typeof useSubMenuButton> {}

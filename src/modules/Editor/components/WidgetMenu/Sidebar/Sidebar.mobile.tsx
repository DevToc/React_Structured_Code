import { ReactElement } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import { SIDEBAR_ITEMS } from '../WidgetMenu.config';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { Item } from './Item';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { setActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSlice';

export const SidebarMobile = (): ReactElement => {
  const dispatch = useAppDispatch();
  const activeWidgetMenu = useAppSelector(selectActiveWidgetMenu);
  /**
   * Activates the selected widget menu.
   * If the activated menu and clicked menu ​​are the same, set the WIDGET_MENU_OPTIONS.NONE to close the widget menu.
   *
   * @param itemId {WIDGET_MENU_OPTIONS}
   */
  const onClickSidebarItem = (itemId: WIDGET_MENU_OPTIONS): void => {
    dispatch(setActiveWidgetMenu(itemId));
  };

  return (
    <Flex
      width='100%'
      minWidth='100%'
      flexDirection='row'
      justifyContent='space-evenly'
      zIndex='var(--vg-zIndices-sideBar)'
      data-testid='widget-menu-sidebar'
      gap={2}
    >
      {SIDEBAR_ITEMS.map((item) => {
        const isActive = activeWidgetMenu === item.id;
        const onClick = () => onClickSidebarItem(item.id);

        return (
          <Box key={item.id} position='relative' width='100%'>
            <Item id={item.id} onClick={onClick} item={item} isActive={isActive} />
          </Box>
        );
      })}
    </Flex>
  );
};
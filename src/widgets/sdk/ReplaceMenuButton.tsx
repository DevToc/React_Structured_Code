import { Button } from '@chakra-ui/react';
import { useAppDispatch } from 'modules/Editor/store';
import { setActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSlice';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';

export const ReplaceMenuButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setActiveWidgetMenu(WIDGET_MENU_OPTIONS.REPLACE));
  };

  return (
    <Button size='sm' onClick={handleClick} fontWeight='semibold' variant='ghost'>
      Replace
    </Button>
  );
};

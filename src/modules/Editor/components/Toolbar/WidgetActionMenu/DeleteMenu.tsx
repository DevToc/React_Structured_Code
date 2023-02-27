import { IconButton, Tooltip } from '@chakra-ui/react';

import { setActiveWidget } from 'modules/Editor/store/store';
import { selectActiveWidgetIds } from 'modules/Editor/store/widgetSelector';
import { removeWidget } from 'modules/Editor/store/infographSlice';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store/hooks';

import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';

export const DeleteMenu = () => {
  const dispatch = useAppDispatch();

  const activePageId = useAppSelector(selectActivePage);
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);

  const isDisabled = !activeWidgetIds.length;
  const label = 'Delete widget';

  const removeActiveWidgets = () => {
    dispatch(removeWidget({ pageId: activePageId, widgetIds: activeWidgetIds }));
    dispatch(setActiveWidget([]));
  };

  return (
    <Tooltip hasArrow placement='bottom' label={label} bg='black'>
      <IconButton
        isDisabled={isDisabled}
        size='sm'
        aria-label={label}
        icon={<TrashIcon />}
        onClick={removeActiveWidgets}
      />
    </Tooltip>
  );
};

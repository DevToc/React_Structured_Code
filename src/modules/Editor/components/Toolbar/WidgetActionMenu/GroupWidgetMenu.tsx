import { Button, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'modules/Editor/store/hooks';
import { groupSelectedWidgets, unGroupSelectedWidgets } from 'modules/Editor/store';
import { selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { useAppSelector } from 'modules/Editor/store/hooks';
import { Keyboard } from 'modules/common/components/Keyboard';

const GroupWidgetMenu = () => {
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('editor_toolbar');

  const groupText = t('group.group');
  const unGroupText = t('group.ungroup');

  const singleGroupSelected =
    activeWidgets.length === 1 && activeWidgets[0].groupMembers.length > 0 && !!activeWidgets[0].groupId;
  const hasUngroup = singleGroupSelected;
  const hasGroup = activeWidgets.length > 1;

  const onGroup = () => dispatch(groupSelectedWidgets(activeWidgets));
  const onUnGroup = () => {
    const groupId = activeWidgets[0]?.groupId;
    if (groupId) dispatch(unGroupSelectedWidgets(groupId));
  };

  const onClick = () => {
    if (hasUngroup) return onUnGroup();
    if (hasGroup) return onGroup();
  };

  const isDisabled = !hasGroup && !hasUngroup;
  const label = hasGroup ? groupText : hasUngroup ? unGroupText : groupText;

  return (
    <Tooltip
      hasArrow
      placement='bottom'
      label={
        <>
          {label} <Keyboard shortcut={['ctrl', 'alt', 'G']} macOs={['⌘', '⌥', 'G']} />
        </>
      }
      bg='black'
    >
      <Button
        variant='ghost'
        fontWeight='semibold'
        data-testid='group-widget-menu'
        isDisabled={isDisabled}
        onClick={onClick}
        size='sm'
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export { GroupWidgetMenu };

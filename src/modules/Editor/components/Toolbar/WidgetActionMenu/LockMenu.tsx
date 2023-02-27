import { IconButton, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { LOCK_COLOR } from 'constants/bounding-box';
import { ReactComponent as LockIcon } from 'assets/icons/lock.svg';

import { updateWidget } from 'modules/Editor/store/infographSlice';
import { selectIsWidgetLocked } from 'modules/Editor/store/infographSelector';
import { selectActiveWidgetIds } from 'modules/Editor/store/widgetSelector';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store/hooks';
import { Keyboard } from 'modules/common/components/Keyboard';

export const LockMenu = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('editor_toolbar');

  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const isLocked = useAppSelector(selectIsWidgetLocked(activeWidgetIds[0]));

  const lockText = t('lockBtn.label');
  const unlockText = t('unlockBtn.label');

  const label = isLocked ? unlockText : lockText;
  const isDisabled = activeWidgetIds.length !== 1;

  const lockWidget = () => {
    const updatedWidget = { widgetId: activeWidgetIds[0], widgetData: { isLocked: !isLocked } };
    dispatch(updateWidget(updatedWidget));
  };

  return (
    <Tooltip
      hasArrow
      placement='bottom'
      label={
        <>
          {label}
          <Keyboard shortcut={['ctrl', 'alt', 'L']} macOs={['⌘', 'Opt', 'L']} />
        </>
      }
      bg='black'
    >
      <IconButton
        size='sm'
        aria-label={label}
        icon={<LockIcon style={{ stroke: isLocked ? LOCK_COLOR : '' }} />}
        onClick={lockWidget}
        isDisabled={isDisabled}
      />
    </Tooltip>
  );
};

import { ReactElement } from 'react';
import { IconButton, ButtonGroup, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../../store/history/historyManager';
import { Keyboard } from '../../../common/components/Keyboard';

import { ReactComponent as UndoIcon } from '../../../../assets/icons/undo.svg';
import { ReactComponent as RedoIcon } from '../../../../assets/icons/redo.svg';

const UndoButton = (): ReactElement => {
  const { t } = useTranslation('editor_toolbar');
  const { canUndo, undo } = useHistory();

  return (
    <Tooltip
      hasArrow
      placement='bottom'
      label={
        <>
          {t('undoBtn.text')} <Keyboard shortcut={['ctrl', 'Z']} macOs={['⌘', 'Z']} />
        </>
      }
    >
      <IconButton icon={<UndoIcon />} onClick={undo} disabled={!canUndo} aria-label={t('undoBtn.ariaLabel')} />
    </Tooltip>
  );
};

const RedoButton = (): ReactElement => {
  const { t } = useTranslation('editor_toolbar');
  const { canRedo, redo } = useHistory();

  return (
    <Tooltip
      hasArrow
      placement='bottom'
      label={
        <>
          {t('redoBtn.text')} <Keyboard shortcut={['ctrl', 'Y']} macOs={['⌘', 'Y']} />
        </>
      }
    >
      <IconButton icon={<RedoIcon />} onClick={redo} disabled={!canRedo} aria-label={t('redoBtn.ariaLabel')} />
    </Tooltip>
  );
};

export const UndoMenu = (): ReactElement => (
  <ButtonGroup spacing={1} ml={2} size='sm' variant='ghost'>
    <UndoButton />
    <RedoButton />
  </ButtonGroup>
);

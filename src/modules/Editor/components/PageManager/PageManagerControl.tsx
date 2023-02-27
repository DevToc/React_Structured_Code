import { Flex, IconButton, Tooltip, Divider } from '@chakra-ui/react';

import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { addNewPage, duplicatePage, setActivePage } from 'modules/Editor/store';
import { PageSwitcher } from './PageSwitcher';
import { removePage } from 'modules/Editor/store/infographSlice';
import {
  selectPageOrder,
  selectWidgets,
  selectPage,
  selectHasReachedPageLimit,
} from 'modules/Editor/store/infographSelector';
import { switchPage } from 'modules/Editor/store/pageControlSlice';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { PageDirection } from 'modules/Editor/store/pageControlSlice.types';
import { ToggleView } from './ToggleView';
import { createCopyPage } from '../Clipboard';

import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';

interface PageManagerControlProps {
  rightOffset: string;
  pageManagerToggleButtonRef: React.RefObject<HTMLButtonElement>;
}

export const PageManagerControl = ({ rightOffset, pageManagerToggleButtonRef }: PageManagerControlProps) => (
  <Flex
    bg='white'
    borderTopLeftRadius={4}
    borderBottomLeftRadius={4}
    w='36px'
    position='absolute'
    right={rightOffset}
    top='25%'
    border='1px solid var(--vg-colors-gray-200)'
    zIndex='var(--vg-zIndices-pageManager)'
    p='2px'
  >
    <Flex w='100%' position='relative' gap={2} direction='column' align='center'>
      <ToggleView buttonRef={pageManagerToggleButtonRef} left='-36px' />
      <PageSwitcher />
      <Divider width={6} bg='gray.100' />
      <DuplicatePage />
      <AddPage />
      <DeletePage />
    </Flex>
  </Flex>
);

const DeletePage = () => {
  const dispatch = useAppDispatch();

  const pageOrder = useAppSelector(selectPageOrder);
  const activePageId = useAppSelector(selectActivePage);

  const onDeletePage = () => {
    const isLast = activePageId === pageOrder[pageOrder.length - 1];
    const direction = isLast ? PageDirection.previous : PageDirection.next;

    dispatch(setActivePage({ direction }));
    dispatch(removePage({ pageId: activePageId }));
  };

  const label = 'Delete Page';
  const hasOnePage = pageOrder?.length === 1;

  return (
    <Tooltip hasArrow placement='left' gutter={10} label={label} bg='black'>
      <IconButton
        isDisabled={hasOnePage}
        size='sm'
        onClick={onDeletePage}
        variant='ghost'
        aria-label={label}
        icon={<TrashIcon />}
      />
    </Tooltip>
  );
};

const AddPage = () => {
  const dispatch = useAppDispatch();

  const activePageId = useAppSelector(selectActivePage);
  const hasReachedPageLimit = useAppSelector(selectHasReachedPageLimit);

  const onAddPage = () => {
    if (hasReachedPageLimit) return;

    dispatch(addNewPage({ insertAfterId: activePageId }));
  };
  const label = 'Add Page';

  return (
    <Tooltip hasArrow placement='left' gutter={10} label={label} bg='black'>
      <IconButton
        size='sm'
        onClick={onAddPage}
        isDisabled={hasReachedPageLimit}
        variant='ghost'
        aria-label={label}
        icon={<PlusIcon />}
      />
    </Tooltip>
  );
};

const DuplicatePage = () => {
  const dispatch = useAppDispatch();

  const activePageId = useAppSelector(selectActivePage);
  const activePage = useAppSelector(selectPage(activePageId));
  const widgets = useAppSelector(selectWidgets);
  const hasReachedPageLimit = useAppSelector(selectHasReachedPageLimit);

  const onDuplicatePage = () => {
    if (hasReachedPageLimit) return;

    const [pageClipboard] = createCopyPage(activePage, widgets);
    dispatch(duplicatePage({ insertAfterId: activePageId, pageClipboard }));
  };
  const label = 'Duplicate Page';

  return (
    <Tooltip hasArrow placement='left' gutter={10} label={label} bg='black'>
      <IconButton
        size='sm'
        variant='ghost'
        onClick={onDuplicatePage}
        aria-label={label}
        icon={<CopyIcon />}
        isDisabled={hasReachedPageLimit}
      />
    </Tooltip>
  );
};

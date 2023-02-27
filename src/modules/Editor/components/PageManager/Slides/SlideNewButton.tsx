import { Button } from '@chakra-ui/react';

import { selectActivePage } from '../../../store/pageSelector';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addNewPage } from '../../../store';
import { ADD_NEW_SLIDES_ID } from './Slide.config';

import { ReactComponent as PlusIcon } from '../../../../../assets/icons/plus.svg';
import { selectHasReachedPageLimit } from 'modules/Editor/store/infographSelector';

export const SlideNewButton = () => {
  const dispatch = useAppDispatch();
  const activePageId = useAppSelector(selectActivePage);
  const hasReachedPageLimit = useAppSelector(selectHasReachedPageLimit);

  const onAddNewSlide = () => dispatch(addNewPage({ insertAfterId: activePageId }));

  return (
    <Button
      borderTop='1px solid var(--vg-colors-gray-200)'
      borderRadius='0'
      color='brand.500'
      fontSize='sm'
      variant='pagemanager-bottom-button'
      id={ADD_NEW_SLIDES_ID}
      onClick={onAddNewSlide}
      leftIcon={<PlusIcon style={{ stroke: 'var(--vg-colors-brand-500)', strokeWidth: '2px' }} />}
      isDisabled={hasReachedPageLimit}
    >
      New page
    </Button>
  );
};

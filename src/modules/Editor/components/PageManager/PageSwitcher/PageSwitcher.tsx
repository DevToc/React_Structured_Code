import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, IconButton, Text, Tooltip } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { selectPageOrder } from '../../../store/infographSelector';
import { selectActivePage } from '../../../store/pageSelector';
import { switchPage } from '../../../store/pageControlSlice';
import { PageDirection } from '../../../store/pageControlSlice.types';
import { ReactComponent as ChevronIcon } from '../../../../../assets/icons/chevron.svg';
import { PageNumberInput } from 'modules/common/components/Input/PageNumberInput';

export const PageSwitcher = () => {
  const { t } = useTranslation('editor_page_manager');
  const dispatch = useAppDispatch();

  const pageOrder = useAppSelector(selectPageOrder);
  const activePageId = useAppSelector(selectActivePage);
  const currentPageIdx = pageOrder.findIndex((pageId) => pageId === activePageId);
  const displayIdx = currentPageIdx + 1;
  const totalPageCount = pageOrder?.length || 0;

  const isFirstPage = currentPageIdx === 0;
  const isLastPage = currentPageIdx === pageOrder?.length - 1;

  const onNextPage = () => dispatch(switchPage({ direction: PageDirection.next, pageOrder }));
  const onPreviousPage = () => dispatch(switchPage({ direction: PageDirection.previous, pageOrder }));

  const previousPageLabel = 'Previous Page';
  const nextPageLabel = 'Next Page';

  const handleManualPageSwitch = useCallback(
    (pageNumber: number) => {
      dispatch(
        switchPage({
          direction: PageDirection.manual,
          pageOrder,
          pageNumber,
        }),
      );
    },
    [dispatch, pageOrder],
  );
  return (
    <Flex direction='column' align='center'>
      <Tooltip hasArrow placement='left' gutter={10} label={previousPageLabel} bg='black'>
        <IconButton
          size='sm'
          isDisabled={isFirstPage}
          onClick={onPreviousPage}
          variant='ghost'
          aria-label={previousPageLabel}
          icon={<ChevronIcon style={{ transform: 'rotate(180deg)' }} />}
        />
      </Tooltip>

      <PageNumberInput
        currentPageNumber={currentPageIdx + 1}
        totalPageCount={totalPageCount}
        handlePageSwitch={handleManualPageSwitch}
        numberInputProps={{
          mt: 1,
          mb: 1,
          size: 'sm',
          color: 'var(--vg-colors-font-500)',
        }}
      />
      <Text fontWeight='500' fontSize='xs' data-testid={`active-page-idx-${displayIdx}`}>
        {t('page-number-input', { totalCount: totalPageCount })}
      </Text>
      <Tooltip hasArrow placement='left' gutter={10} label={nextPageLabel} bg='black'>
        <IconButton
          size='sm'
          onClick={onNextPage}
          isDisabled={isLastPage}
          variant='ghost'
          aria-label={nextPageLabel}
          icon={<ChevronIcon />}
        />
      </Tooltip>
    </Flex>
  );
};

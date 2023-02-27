import { Flex, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { useAppDispatch, useAppSelector, setActivePage } from 'modules/Editor/store';
import { selectPageOrder } from 'modules/Editor/store/infographSelector';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { PageDirection } from 'modules/Editor/store/pageControlSlice.types';
import { PageNumberInput } from 'modules/common/components/Input/PageNumberInput';

export const PageNavigation = (): ReactElement => {
  const { t } = useTranslation('editor_page_manager');
  const dispatch = useAppDispatch();
  const pageOrder = useAppSelector(selectPageOrder);
  const activePageId = useAppSelector(selectActivePage);
  const currentPageIdx = pageOrder.findIndex((pageId) => pageId === activePageId);
  const totalPageCount = pageOrder?.length || 0;
  const isFirstPage = currentPageIdx === 0;
  const isLastPage = currentPageIdx === totalPageCount - 1;
  const currentPage = currentPageIdx + 1;

  const onNextPage = () => dispatch(setActivePage({ direction: PageDirection.next }));
  const onPreviousPage = () => dispatch(setActivePage({ direction: PageDirection.previous }));

  const previousPageLabel = 'Previous Page';
  const nextPageLabel = 'Next Page';

  const handleManualPageSwitch = useCallback(
    (pageNumber: number) => dispatch(setActivePage({ direction: PageDirection.manual, pageNumber })),
    [dispatch],
  );

  return (
    <Flex align='center'>
      <Tooltip hasArrow placement='top' gutter={10} label={previousPageLabel} bg='black'>
        <IconButton
          size='xs'
          variant='icon-btn-page-navigation'
          isDisabled={isFirstPage}
          onClick={onPreviousPage}
          aria-label={previousPageLabel}
          icon={<ChevronIcon style={{ transform: 'rotate(90deg)' }} />}
        />
      </Tooltip>
      <PageNumberInput
        currentPageNumber={currentPage}
        totalPageCount={totalPageCount}
        handlePageSwitch={handleManualPageSwitch}
        numberInputProps={{
          ml: 2,
          size: 'xs',
          color: 'white',
        }}
      />
      <Text fontSize='sm' lineHeight='shorter' color='white' ml={2} mr={2}>
        {t('page-number-input', { totalCount: totalPageCount })}
      </Text>

      <Tooltip hasArrow placement='top' gutter={10} label={nextPageLabel} bg='black'>
        <IconButton
          size='xs'
          variant='icon-btn-page-navigation'
          onClick={onNextPage}
          isDisabled={isLastPage}
          aria-label={nextPageLabel}
          icon={<ChevronIcon style={{ transform: 'rotate(270deg)' }} />}
        />
      </Tooltip>
    </Flex>
  );
};

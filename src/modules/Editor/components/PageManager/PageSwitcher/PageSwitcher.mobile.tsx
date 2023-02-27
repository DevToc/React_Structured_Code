import { Flex, Text } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { selectPageOrder } from '../../../store/infographSelector';
import { selectActivePage } from '../../../store/pageSelector';
import { PageNumberInput } from 'modules/common/components/Input/PageNumberInput';
import { useCallback } from 'react';
import { switchPage } from '../../../store/pageControlSlice';
import { PageDirection } from '../../../store/pageControlSlice.types';
import { useTranslation } from 'react-i18next';

export const PageSwitcherMobile = () => {
  const { t } = useTranslation('editor_page_manager');
  const dispatch = useAppDispatch();
  const pageOrder = useAppSelector(selectPageOrder);
  const activePageId = useAppSelector(selectActivePage);
  const currentPageIdx = pageOrder.findIndex((pageId) => pageId === activePageId);
  const displayIdx = currentPageIdx + 1;
  const totalPageCount = pageOrder?.length || 0;

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
    <Flex direction='row' align='center'>
      <PageNumberInput
        currentPageNumber={currentPageIdx + 1}
        totalPageCount={totalPageCount}
        handlePageSwitch={handleManualPageSwitch}
        numberInputProps={{
          mr: 1,
          size: 'md',
          color: 'var(--vg-colors-font-500)',
        }}
      />
      <Text fontWeight='500' fontSize='md' data-testid={`active-page-idx-${displayIdx}`}>
        {t('page-number-input', { totalCount: totalPageCount })}
      </Text>
    </Flex>
  );
};

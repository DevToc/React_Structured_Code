import { ReactElement, memo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { setDownloadModal } from '../../store/editorSettingsSlice';
import { DownloadModalTrigger } from '../../store/editorSettingsSlice.types';
import { useAppDispatch } from '../../store';

export const ShareButton = memo((): ReactElement => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common_navbar');

  const handleOpenModal = () => dispatch(setDownloadModal({ isOpen: true, trigger: DownloadModalTrigger.ShareButton }));

  const label = 'Share infograph';
  const testId = 'share-infograph-button';

  return (
    <Box ml='auto'>
      <Button variant='action' size='sm' data-testid={testId} aria-label={label} onClick={handleOpenModal}>
        {t('navbar.share-button')}
      </Button>
    </Box>
  );
});

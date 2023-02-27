import { ReactElement, memo } from 'react';
import { Box, IconButton } from '@chakra-ui/react';

import { DownloadModal } from '../components/DownloadModal';
import { setDownloadModal } from '../../../store/editorSettingsSlice';
import { DownloadModalTrigger } from '../../../store/editorSettingsSlice.types';
import { useAppDispatch } from '../../../store';

import { ReactComponent as DownloadIcon } from '../../../../../assets/icons/download.svg';

export const DownloadMenuMobile = memo((): ReactElement => {
  const dispatch = useAppDispatch();

  const handleOpenModal = () => dispatch(setDownloadModal({ isOpen: true, trigger: DownloadModalTrigger.Navbar }));

  const label = 'Download infograph';
  const testId = 'download-infograph-button';

  return (
    <Box ml='auto'>
      <IconButton
        variant='ghost'
        size='sm'
        data-testid={testId}
        aria-label={label}
        icon={<DownloadIcon />}
        onClick={handleOpenModal}
      />
      <DownloadModal />
    </Box>
  );
});

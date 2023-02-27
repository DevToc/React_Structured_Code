import { useState, useRef } from 'react';
import { Button, useToast, ToastId } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { exportRequest, saveAs, DownloadAPIResponse } from 'api/export';
import { ExportType, ExportScale } from 'api/export';
import { selectOriginalEditorId } from 'modules/Editor/store/selectEditorSettings';
import { store } from 'modules/Editor/store';
import { useAppSelector } from 'modules/Editor/store';
import { useAccessibilityChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/checker.hooks';
import { useScanDocument } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/common/hooks/useScanDocument';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { DownloadOption, downloadFileType } from 'constants/download';
import { DOWNLOAD } from 'constants/mixpanel';
import { DownloadButtonProps, ExportStatus } from './DownloadModal.types';

// TODO: cancel request on unmount
// TODO: handle error
export const DownloadButton = ({ downloadOption, shouldDisable, selectedPageNumbers }: DownloadButtonProps) => {
  const [status, setStatus] = useState(ExportStatus.Default);
  const { t } = useTranslation('common_navbar');
  const toast = useToast({
    position: 'bottom-left',
    containerStyle: {
      marginLeft: 150,
    },
  });
  const downloadingToastIdRef = useRef<ToastId | undefined>(undefined);
  const originalEditorId = useAppSelector(selectOriginalEditorId);
  const {
    state: { checkers, showChecker },
  } = useAccessibilityChecker();
  const { scanDocumentLanguage } = useScanDocument();

  const showDownloadingToast = () => {
    downloadingToastIdRef.current = toast({
      title: 'Downloading...',
      status: 'info',
      duration: 8000,
      isClosable: false,
    });
  };

  const closeDownloadingToast = () => {
    if (downloadingToastIdRef.current) {
      toast.close(downloadingToastIdRef.current);
    }
  };

  const showDownloadCompleteToast = () => {
    toast({
      title: 'Download Complete',
      status: 'success',
      duration: 3000,
      isClosable: false,
    });
  };

  const showDownloadErrorToast = () => {
    toast({
      title: 'Download Failed',
      description: 'Please retry or contact support',
      status: 'error',
      duration: 3000,
      isClosable: false,
    });
  };

  const handleDownload = async () => {
    try {
      setStatus(ExportStatus.Pending);

      await scanDocumentLanguage();

      const infograph = store.getState().infograph;
      const selectedPages =
        selectedPageNumbers.length > 0
          ? selectedPageNumbers.map((pageNumber) => infograph.pageOrder[pageNumber - 1])
          : infograph.pageOrder;
      // Use original infograph id for export API request
      const options = {
        id: originalEditorId || infograph.id,
        pages: selectedPages,
      };
      const typeOption =
        downloadOption === DownloadOption.InteractivePDF ? { type: ExportType.pdf } : { type: ExportType.png };
      const scaleOption = downloadOption === DownloadOption.PNGHD ? { scale: ExportScale.PNGHD } : null;
      const exportOptions = { ...options, ...typeOption, ...scaleOption };
      showDownloadingToast();

      const { url } = (await exportRequest(infograph, exportOptions)) as DownloadAPIResponse;

      if (url) saveAs(url, infograph.id, showDownloadCompleteToast);

      const count = Object.values(checkers).filter((checker) => !checker.isMarkAsResolved).length;
      Mixpanel.track(DOWNLOAD, {
        editor_version: 'E2',
        file_type: downloadFileType[downloadOption],
        design_id: options.id,
        width: infograph.size.widthPx,
        height: infograph.size.heightPx,
        design_accessibility_checked: showChecker ? 'TRUE' : 'FALSE',
        design_accessibility: showChecker && count < 1 ? 'TRUE' : 'FALSE',
      });
    } catch (error) {
      closeDownloadingToast();
      showDownloadErrorToast();
      console.error(error);
    } finally {
      closeDownloadingToast();
      setStatus(ExportStatus.Default);
    }
  };

  return (
    <Button
      loadingText={t('modals.download.download-button-loading')}
      w='100%'
      onClick={handleDownload}
      variant='action'
      _hover={{ background: shouldDisable ? 'green.500' : 'green.600' }}
      isLoading={status === ExportStatus.Pending}
      isDisabled={shouldDisable}
    >
      {t('modals.download.download-button')}
    </Button>
  );
};

import { Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'modules/Editor/store';
import { setDownloadModal } from 'modules/Editor/store/editorSettingsSlice';
import { DownloadModalTrigger } from 'modules/Editor/store/editorSettingsSlice.types';
import { CHECKER_HEADER_HEIGHT } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.config';
import {
  CheckContainer,
  CheckItemHeaderLabel,
  CheckDescriptionText,
} from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/common';
import { useAccessibilityChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/checker.hooks';
import { refreshChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/checker.actions';
import { RescanConfirmModal } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/RescanConfirmModal';

import { ReactComponent as AlertIcon } from 'assets/icons/a11ymenu_alert.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/a11ymenu_refresh.svg';
import { ReactComponent as OkStatusIcon } from 'assets/icons/a11ymenu_status_ok.svg';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';

interface StatusBannerProps {
  scanDocument: () => void;
}

const StatusBanner = ({ scanDocument }: StatusBannerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { state, dispatch } = useAccessibilityChecker();
  const appDispatch = useAppDispatch();

  const count = useMemo(
    () => Object.values(state.checkers).filter((checker) => !checker.isMarkAsResolved).length,
    [state],
  );
  const isResolved = count < 1;

  const handleRefresh = () => {
    onClose();
    dispatch(refreshChecker());
    scanDocument();
  };

  const handleOpenModal = () => {
    appDispatch(setDownloadModal({ isOpen: true, trigger: DownloadModalTrigger.AccessibilityMenuDownloadButton }));
  };

  if (isResolved) return <ResolvedBanner handleOpenModal={handleOpenModal} />;
  return <IssueBanner isOpen={isOpen} onOpen={onOpen} onClose={onClose} handleRefresh={handleRefresh} count={count} />;
};

const ResolvedBanner = ({ handleOpenModal }: { handleOpenModal: () => void }) => {
  const downloadButtonLabel = 'Download infograph';
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu',
    useSuspense: false,
  });

  return (
    <CheckContainer borderTop='unset' bg='action.50' padding={0}>
      <Flex p='0.75rem 1rem' alignItems={'top'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems='top'>
          <OkStatusIcon width='18' height='18' />
          <Flex direction='column' gap='1'>
            <CheckItemHeaderLabel>{t('statusBanner.resolved.title')}</CheckItemHeaderLabel>
            <CheckDescriptionText>{t('statusBanner.resolved.description')}</CheckDescriptionText>
          </Flex>
        </Flex>
        <IconButton
          size='md'
          width='32px'
          height='32px'
          minW='32px'
          aria-label={downloadButtonLabel}
          icon={<DownloadIcon />}
          bg='transparent'
          onClick={handleOpenModal}
          _hover={{ backgroundColor: 'hover.gray' }}
        />
      </Flex>
    </CheckContainer>
  );
};

interface IssueBannerProps {
  count: number;
  isOpen: boolean;
  handleRefresh: () => void;
  onOpen: () => void;
  onClose: () => void;
}
const IssueBanner = ({ count, handleRefresh, isOpen, onOpen, onClose }: IssueBannerProps) => {
  const refreshButtonLabel = 'Check accessibility';
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu',
    useSuspense: false,
  });

  return (
    <CheckContainer bg='yellow.100' p='0'>
      <Flex h={`${CHECKER_HEADER_HEIGHT}px`} p='0.75rem 1rem' alignItems={'center'} justifyContent={'space-between'}>
        <Flex gap='2' alignItems='center'>
          <AlertIcon />
          <CheckItemHeaderLabel>{t('statusBanner.issue.title', { count })}</CheckItemHeaderLabel>
        </Flex>
        <IconButton
          size='md'
          width='32px'
          height='32px'
          minW='32px'
          aria-label={refreshButtonLabel}
          icon={<RefreshIcon />}
          bg='transparent'
          onClick={onOpen}
          _hover={{ backgroundColor: 'hover.gray' }}
        />
      </Flex>
      <RescanConfirmModal isOpen={isOpen} onConfirm={handleRefresh} onClose={onClose} />
    </CheckContainer>
  );
};

export { StatusBanner };

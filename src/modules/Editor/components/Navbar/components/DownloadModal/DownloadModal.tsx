import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  TabProps,
  useBoolean,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useViewport } from 'hooks/useViewport';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { setAccessibilityViewIndex, setDownloadModal } from 'modules/Editor/store/editorSettingsSlice';
import { selectDownloadModalTrigger, selectIsDownloadModalOpen } from 'modules/Editor/store/selectEditorSettings';
import { selectPageOrder } from 'modules/Editor/store/infographSelector';
import { DownloadModalTrigger } from 'modules/Editor/store/editorSettingsSlice.types';
import SharePanel from '../SharePanel';
import { AccessibilityCheckPrompt } from '../AccessibilityCheckPrompt';
import { DownloadOptionSelect } from './DownloadOptionSelect';
import { DownloadButton } from './DownloadButton';
import { useFocus } from 'modules/Editor/components/Focus';
import { useUser, UserTypes } from 'hooks/useUser';

import { DownloadOption, CustomPageOption } from 'constants/download';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { ACCESSIBILITY_CHECKER_OPENED, UPGRADE, EDITOR_VERSION, E2_DOWNLOAD_MODAL } from 'constants/mixpanel';
import { UpgradeButton } from '../UpgradeButton';
import { useDebouncedCallback } from 'hooks/useDebounce';
import { parseCustomPageRangeInput } from './DownloadModal.helpers';
import { CustomPageOptionSelect } from './CustomPageOptionSelect';
import { DefaultTabNumber } from './DownloadModal.types';

const tabStyles: TabProps = {
  fontWeight: 'semibold',
  fontSize: 'sm',
  px: '5',
  pt: '5',
  pb: '2',
  _selected: { color: 'upgrade.blue.500', borderBottom: '2px solid' },
  _focus: { boxShadow: 'none' },
};

export const DownloadModal = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useViewport();

  const downloadModalTrigger = useAppSelector(selectDownloadModalTrigger);
  const isDownloadModalOpen = useAppSelector(selectIsDownloadModalOpen);
  const pageOrder = useAppSelector(selectPageOrder);

  const { closeAccessibilityMenuRef } = useFocus();
  const { t } = useTranslation('common_navbar');

  const modalBodyTestId = 'download-modal-body';
  const modalCloseButtonTestId = 'close-download-modal-button';

  const finalFocusRef =
    downloadModalTrigger === DownloadModalTrigger.AccessibilityMenu && closeAccessibilityMenuRef
      ? closeAccessibilityMenuRef
      : undefined;

  const initialTab =
    downloadModalTrigger === DownloadModalTrigger.ShareButton ? DefaultTabNumber.Share : DefaultTabNumber.Download;

  const { data: userInfo } = useUser();
  const userType = userInfo?.user_type;
  const isFreeUser = userType === UserTypes.Free;
  const isPremiumUser = userType === UserTypes.Premium;

  const [downloadOption, setDownloadOption] = useState<DownloadOption>(DownloadOption.InteractivePDF);
  const downloadOptionHandler = (option: DownloadOption) => setDownloadOption(option);

  const clickUpgradeHandler = () => {
    window.open(`${window.location.origin}/account/subscription`);

    Mixpanel.track(UPGRADE, {
      editor_version: EDITOR_VERSION,
      Feature: E2_DOWNLOAD_MODAL,
    });
  };

  const onClose = () => dispatch(setDownloadModal({ isOpen: false }));

  const onSetAccessibilityView = () => {
    dispatch(setDownloadModal({ isOpen: false, trigger: DownloadModalTrigger.AccessibilityMenu }));
    dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.CHECK));

    Mixpanel.track(ACCESSIBILITY_CHECKER_OPENED, {
      from: 'Download Modal',
    });
  };

  const [customPageRangeOption, setCustomPageRangeOption] = useState(CustomPageOption.All);
  const [selectedPageNumbers, setSelectedPageNumbers] = useState<number[]>([]);
  const [isValidRange, setIsValidRange] = useBoolean(true);

  const handleSelectedRanges = (value: string) => {
    if (value === '') {
      setSelectedPageNumbers([]);
      setIsValidRange.on();
      return;
    }

    try {
      const selectedPages = parseCustomPageRangeInput(value, pageOrder.length);

      setSelectedPageNumbers(selectedPages);
      setIsValidRange.on();
    } catch (err) {
      // Validation fail
      setIsValidRange.off();
    }
  };

  const debounceHandleSelectedPages = useDebouncedCallback(handleSelectedRanges, 300);

  const handleCustomPageRangeOption = (option: CustomPageOption) => {
    if (option === CustomPageOption.All && selectedPageNumbers.length > 0) {
      setSelectedPageNumbers([]);
    }

    setCustomPageRangeOption(option);
  };

  const handleCustomPageRangeInput = (input: string) => {
    debounceHandleSelectedPages(input);
  };

  const isMultipage = pageOrder.length > 1;

  return (
    <Modal
      finalFocusRef={finalFocusRef}
      isOpen={isDownloadModalOpen}
      onClose={onClose}
      size={isMobile ? 'full' : 'sm'}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton data-testid={modalCloseButtonTestId} />
        <Tabs defaultIndex={initialTab}>
          <TabList>
            <Tab {...tabStyles} ml='5'>
              {t('modals.share-panel.title-share')}
            </Tab>
            <Tab {...tabStyles}>{t('modals.download.title-download')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel pt='5' px='6' pb='7'>
              <AccessibilityCheckPrompt onSetAccessibilityView={onSetAccessibilityView} />
              <SharePanel />
              <Box h='158'></Box>
            </TabPanel>
            <TabPanel pt='5' px='6' pb='7'>
              <ModalBody data-testid={modalBodyTestId} p={0}>
                <AccessibilityCheckPrompt onSetAccessibilityView={onSetAccessibilityView} />
                <Flex flexDir='column' borderRadius='base' my={4} alignItems='start'>
                  {isMultipage && (
                    <CustomPageOptionSelect
                      customPageRangeOption={customPageRangeOption}
                      handleCustomPageRangeOption={handleCustomPageRangeOption}
                      handleCustomPageRangeInput={handleCustomPageRangeInput}
                      isValidRange={isValidRange}
                      isFreeUser={isFreeUser}
                      isPremiumUser={isPremiumUser}
                      handleClickUpgrade={clickUpgradeHandler}
                    />
                  )}
                  <DownloadOptionSelect
                    downloadOption={downloadOption}
                    handleDownloadOption={downloadOptionHandler}
                    isFreeUser={isFreeUser}
                    handleClickUpgrade={clickUpgradeHandler}
                  />
                </Flex>
              </ModalBody>
              <ModalFooter p='0' mt='6'>
                {isFreeUser ? (
                  <UpgradeButton handleClickUpgrade={clickUpgradeHandler} />
                ) : (
                  <DownloadButton
                    downloadOption={downloadOption}
                    shouldDisable={!isValidRange}
                    selectedPageNumbers={selectedPageNumbers}
                  />
                )}
              </ModalFooter>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

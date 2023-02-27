import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Heading,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

interface RescanConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const CONTAINER_WIDTH = 448;

const RescanConfirmModal = ({ onConfirm, onClose, isOpen }: RescanConfirmModalProps) => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.rescanConfirmModal',
    useSuspense: false,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w={CONTAINER_WIDTH} m='auto' p='0'>
        <ModalHeader>
          <Heading size={'md'}>{t('heading')}</Heading>
        </ModalHeader>
        <ModalCloseButton data-testid={'checker-rescan-close-button'} />
        <ModalBody>
          <Text fontSize={'sm'}>{t('desc')}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant={'ghost'} size={'sm'} mr={2} onClick={onClose} data-testid={'checker-rescan-cancel-button'}>
            {t('cancel')}
          </Button>
          <Button colorScheme={'green'} size={'sm'} onClick={onConfirm} data-testid={'checker-rescan-confirm-button'}>
            {t('rescan')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { RescanConfirmModal };

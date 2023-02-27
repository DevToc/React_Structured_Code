import { useEffect, useState } from 'react';
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Select,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { LANGUAGES } from 'constants/language';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setLanguage } from '../../../store/infographSlice';
import { selectLanguage } from '../../../store/infographSelector';
import { Language } from '../../../../../types/infographTypes';
import { DOCUMENT_LANGUAGE_HELP_LINK } from '../../../../../constants/links';
import { Mixpanel } from '../../../../../libs/third-party/Mixpanel/mixpanel';
import { DOCUMENT_LANGUAGE_EDITED, HELP_OPENED } from '../../../../../constants/mixpanel';
import { setLanguageUpdatedOnce } from 'modules/Editor/store/editorSettingsSlice';

interface LanguageOptionProps {
  label: string;
  value: string;
}

const LanguageOption = ({ label, value }: LanguageOptionProps) => {
  return (
    <option value={value} data-testid='setLanguage-option'>
      {label}
    </option>
  );
};

interface SetLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetLanguageModal = ({ isOpen, onClose }: SetLanguageModalProps) => {
  const currentLang = useAppSelector(selectLanguage);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('common_navbar');
  const { t: tApp } = useTranslation('app');

  useEffect(() => {
    if (currentLang) {
      setSelectedLang(currentLang);
    }
  }, [currentLang]);

  const selectLang = (iso639_1_Code: string) => {
    const lang = LANGUAGES.find((e) => e.iso639_1_Code === iso639_1_Code);

    if (lang) {
      setSelectedLang(lang);
    } else {
      setSelectedLang(null);
    }

    Mixpanel.track(DOCUMENT_LANGUAGE_EDITED, {
      language: lang?.displayName || 'Unknown',
    });
  };

  const clearAndClose = () => {
    // Reset to current lang
    if (currentLang) {
      setSelectedLang(currentLang);
    }
    onClose();
  };

  const doSave = () => {
    // do nothing if nothing is selected
    if (!selectedLang) {
      return;
    }

    // Dispatch changes only if lang is changed
    if (selectedLang.iso639_1_Code !== currentLang.iso639_1_Code) {
      dispatch(setLanguage({ language: selectedLang }));
      dispatch(setLanguageUpdatedOnce(true));
    }

    clearAndClose();
  };

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: 'Language Modal',
      help_type: 'Document Language',
    });
  };

  const modalBodyTestId = 'setLanguage-modal-body';
  const selectTestId = 'setLanguage-select';

  return (
    <Modal isOpen={isOpen} size={'lg'} onClose={clearAndClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('modals.set-language.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody data-testid={modalBodyTestId}>
          <Text fontSize={'sm'}>{t('modals.set-language.body-text')}</Text>
          <Text mt={4}>
            <Link
              href={DOCUMENT_LANGUAGE_HELP_LINK}
              isExternal
              variant={'external'}
              fontSize={'xs'}
              onClick={handleClickHelpLink}
            >
              {t('modals.set-language.learn-more')}
            </Link>
          </Text>
          <Select
            size={'sm'}
            placeholder={t('modals.set-language.select-placeholder')}
            mt={4}
            onChange={(e) => selectLang(e.target.value)}
            value={selectedLang?.iso639_1_Code}
            data-testid={selectTestId}
          >
            {LANGUAGES.map((lang, i) => (
              <LanguageOption key={lang.iso639_1_Code} label={lang.displayName} value={lang.iso639_1_Code} />
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' onClick={clearAndClose}>
            {tApp('button.cancel')}
          </Button>
          <Button variant={'action'} ml={3} onClick={doSave} disabled={!selectedLang}>
            {tApp('button.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { SetLanguageModal };

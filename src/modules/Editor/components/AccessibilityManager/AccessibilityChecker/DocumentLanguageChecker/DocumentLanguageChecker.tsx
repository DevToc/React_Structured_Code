import { ReactElement } from 'react';
import { Box, Flex, UnorderedList, ListItem, Text, Button, useDisclosure, Portal } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  CheckContainer,
  CheckItemHeader,
  CheckItemHeaderLabel,
  CheckItemPanel,
  CheckDescriptionText,
  MarkResolved,
  StatusIconButton,
  HelpLink,
} from '../common';
import { DOCUMENT_LANGUAGE_HELP_LINK } from '../../../../../../constants/links';
import { AccessibilityCheckers, AccessibilityCheckerStatus } from '../../AccessibilityManager.types';
import { useAccessibilityChecker } from '../checker.hooks';
import { markChecker } from '../checker.actions';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectLanguage } from '../../../../store/infographSelector';
import { SetLanguageModal } from '../../../Navbar/components/SetLanguageModal';
import { Mixpanel } from '../../../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_CHECKER,
  ACCESSIBILITY_MANUAL_CHECKED,
  CHECKER_LABELS,
  DOCUMENT_LANGUAGE_MODAL_OPENED,
  HELP_OPENED,
} from '../../../../../../constants/mixpanel';
import { setLanguageUpdatedOnce } from 'modules/Editor/store/editorSettingsSlice';

const DocumentLanguageChecker = (): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu',
    useSuspense: false,
  });

  // Control visibility of Doc Lang modal
  const { onOpen, isOpen, onClose } = useDisclosure();

  const appDispatch = useAppDispatch();
  const { state, dispatch } = useAccessibilityChecker();
  const { isMarkAsResolved } = state.checkers[AccessibilityCheckers.documentLanguage];
  const handleMarkResolved = () => {
    dispatch(markChecker(AccessibilityCheckers.documentLanguage));
    appDispatch(setLanguageUpdatedOnce(true));

    if (!isMarkAsResolved) {
      Mixpanel.track(ACCESSIBILITY_MANUAL_CHECKED, {
        a11y_checker_items: CHECKER_LABELS[AccessibilityCheckers.documentLanguage],
      });
    }
  };

  const docLang = useAppSelector(selectLanguage);

  const handleOpenModal = () => {
    onOpen();

    Mixpanel.track(DOCUMENT_LANGUAGE_MODAL_OPENED, {
      from: ACCESSIBILITY_CHECKER,
    });
  };

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: CHECKER_LABELS[AccessibilityCheckers.documentLanguage],
    });
  };

  return (
    <>
      <CheckContainer>
        <CheckItemHeader>
          <CheckItemHeaderLabel>{t('documentLanguage.headerLabel')}</CheckItemHeaderLabel>
          <StatusIconButton
            aria-label='check document language button'
            status={isMarkAsResolved ? AccessibilityCheckerStatus.reviewed : AccessibilityCheckerStatus.warn}
          />
        </CheckItemHeader>
        <CheckItemPanel>
          <Flex direction='column' gap='2'>
            <Flex direction='column' gap='2'>
              <CheckDescriptionText>{t('documentLanguage.desc1')}</CheckDescriptionText>
              <CheckDescriptionText>{t('documentLanguage.makeSure')}</CheckDescriptionText>
              <UnorderedList pl='6'>
                <ListItem>
                  <CheckDescriptionText>{t('documentLanguage.tip1')}</CheckDescriptionText>
                </ListItem>
                <ListItem>
                  <CheckDescriptionText>{t('documentLanguage.tip2')}</CheckDescriptionText>
                </ListItem>
              </UnorderedList>
              <HelpLink href={DOCUMENT_LANGUAGE_HELP_LINK} onClick={handleClickHelpLink}>
                {t('documentLanguage.learnMore')}
              </HelpLink>
            </Flex>
            <Flex
              my={2}
              borderRadius={4}
              bg={'hover.gray'}
              p={3}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Text fontSize={'xs'} fontWeight={'medium'}>
                Document Language: {docLang.displayName}
              </Text>
              <Button variant={'a11ymenu-outline'} size={'xs'} w={10} onClick={handleOpenModal}>
                Edit
              </Button>
            </Flex>
            <Box>
              <MarkResolved isChecked={isMarkAsResolved} onChange={handleMarkResolved}>
                {t('documentLanguage.resolvedCheck')}
              </MarkResolved>
            </Box>
          </Flex>
        </CheckItemPanel>
      </CheckContainer>
      <Portal>
        <SetLanguageModal onClose={onClose} isOpen={isOpen} />
      </Portal>
    </>
  );
};

export { DocumentLanguageChecker };

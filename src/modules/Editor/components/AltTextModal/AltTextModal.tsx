import { useState, useCallback, ChangeEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Heading,
  Box,
  UnorderedList,
  ListItem,
  ModalFooter,
  Link,
  Textarea,
  Checkbox,
  Button,
} from '@chakra-ui/react';

import { CollapsibleBox } from '../../../common/components/CollapsibleBox';
import { Toggletip } from '../../../common/components/Toggletip';

import { ReactComponent as SolidInfoIcon } from '../../../../assets/icons/filled_info.svg';
import { ReactComponent as OutlineInfoIcon } from '../../../../assets/icons/outline_info.svg';

import { MAX_ALLOW_CHARS } from './AltTextModal.config';
import { ALTERNATIVE_TEXT_HELP_LINK } from '../../../../constants/links';
import { Mixpanel } from '../../../../libs/third-party/Mixpanel/mixpanel';
import { HELP_OPENED } from '../../../../constants/mixpanel';

interface AltTextModalProps {
  onSubmit: (altText: string, isDecorative: boolean) => void;
  onClose: () => void;
  isOpen: boolean;

  altText?: string;
  isDecorative?: boolean;
}

export const AltTextModal = ({ onSubmit, onClose, isOpen, altText = '', isDecorative = false }: AltTextModalProps) => {
  const { t, ready } = useTranslation('editor_toolbar_alt_text_menu', {
    keyPrefix: 'altTextModal',
    useSuspense: false,
  });

  // Tips to render in collapsible box
  const altTextTips = useMemo(
    () => [
      <Text fontSize={'xs'}>{t('tips.tip1')}</Text>,
      <Text fontSize={'xs'}>{t('tips.tip2')}</Text>,
      <Text fontSize={'xs'}>{t('tips.tip3')}</Text>,
      <Text fontSize={'xs'}>
        {t('tips.tip4.part1')}
        <b>{t('markAsDecorative')}</b>
        {t('tips.tip4.part2')}
      </Text>,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, ready],
  );

  // Memoize strings to prevent flashing due to i18next
  const strings = useMemo(
    () => ({
      description: t('description'),
      heading: t('heading'),
      helpLinkText: t('helpLinkText'),
      altTextPlaceholder: {
        active: t('textInputPlaceholder.active'),
        disabled: t('textInputPlaceholder.disabled'),
      },
      tipsTitle: t('tips.title'),
      markAsDecorative: t('markAsDecorative'),
      markAsDecorativeTooltip: t('markAsDecorativeTooltip'),
      cancel: t('cancel'),
      save: t('save'),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, ready],
  );

  const [altTextInput, setAltTextInput] = useState<string>(altText);
  const [isDecorativeChecked, setIsDecorativeChecked] = useState<boolean>(isDecorative);

  /**
   * Update alt text + is decorative fields when a new
   * widget is selected.
   */
  useEffect(() => {
    setAltTextInput(altText);
    setIsDecorativeChecked(isDecorative);
  }, [altText, isDecorative]);

  const onTextInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAltTextInput(e.target.value);
  };

  const onCheckIsDecorative = () => {
    setIsDecorativeChecked(!isDecorativeChecked);
  };

  /**
   * Triggered when modal is closed by ESC, close/cancel button
   *
   * Changes to altText/isDecorative are not persisted, state is
   * reverted back to initial state.
   */
  const handleCloseModal = useCallback(() => {
    setAltTextInput(altText);
    setIsDecorativeChecked(isDecorative);

    onClose();
  }, [onClose, altText, isDecorative]);

  const handleSubmit = useCallback(() => {
    onSubmit(altTextInput, isDecorativeChecked);
  }, [altTextInput, isDecorativeChecked, onSubmit]);

  const altTextPlaceholder = isDecorativeChecked
    ? strings.altTextPlaceholder.disabled
    : strings.altTextPlaceholder.active;

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: 'Alt Modal',
      help_type: 'Alt Text',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size={'md'}>{strings.heading}</Heading>
        </ModalHeader>
        <ModalCloseButton data-testid={'alttext-close-button'} />
        <ModalBody>
          <Text fontSize={'sm'} mb={3}>
            {strings.description}
          </Text>

          {/* ALT TEXT TIPS */}
          <CollapsibleBox
            title={strings.tipsTitle}
            titleIcon={<SolidInfoIcon fill='var(--vg-colors-upgrade-blue-500)' />}
            collapseAriaLabel={'Toggle Alt Text Tips'}
          >
            <UnorderedList pl={10}>
              {altTextTips.map((tip, i) => (
                <ListItem key={i}>{tip}</ListItem>
              ))}
            </UnorderedList>
            <Link
              fontSize={'xs'}
              variant={'inline'}
              href={ALTERNATIVE_TEXT_HELP_LINK}
              isExternal
              onClick={handleClickHelpLink}
            >
              {strings.helpLinkText}
            </Link>
          </CollapsibleBox>

          {/* DESCRIPTION INPUT */}
          <Box mt={4}>
            <Text mb={2} fontSize={'sm'} fontWeight={700}>
              Description
            </Text>
            <Textarea
              maxLength={MAX_ALLOW_CHARS}
              fontSize={'sm'}
              placeholder={altTextPlaceholder}
              resize={'vertical'}
              p={2}
              value={isDecorativeChecked ? altTextPlaceholder : altTextInput}
              onChange={onTextInputChange}
              isDisabled={isDecorativeChecked}
              variant={isDecorativeChecked ? 'disabled' : 'outline'}
              focusBorderColor={'upgrade.blue.500'}
              data-testid={'alttext-text-input'}
            />
          </Box>

          {/* MARK AS DECORATIVE OPTION */}
          <Flex justifyContent={'space-between'} mt={4}>
            <Flex gap={2} alignItems={'center'}>
              <Checkbox size={'sm'} isChecked={isDecorativeChecked} onChange={onCheckIsDecorative}>
                {strings.markAsDecorative}
              </Checkbox>
              <Toggletip
                label={strings.markAsDecorativeTooltip}
                placement={'top'}
                buttonAriaLabel={'Mark as Decorative Tooltip'}
                hasArrow
                icon={<OutlineInfoIcon />}
                testLabel={'decorative-toggletip-button'}
              />
            </Flex>
          </Flex>
        </ModalBody>

        {/* BUTTON GROUP */}
        <ModalFooter>
          <Button variant={'ghost'} size={'sm'} mr={2} onClick={handleCloseModal} data-testid={'alttext-cancel-button'}>
            {strings.cancel}
          </Button>
          <Button colorScheme={'green'} size={'sm'} onClick={handleSubmit} data-testid={'alttext-save-button'}>
            {strings.save}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

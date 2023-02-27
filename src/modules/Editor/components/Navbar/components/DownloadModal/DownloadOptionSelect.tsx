import { Flex, Text, Box, Stack, Image, Link, RadioGroup, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { DownloadOption } from 'constants/download';
import { Toggletip } from 'modules/common/components/Toggletip';
import { ReactComponent as InteractivePDFIcon } from 'assets/icons/interactive-pdf-info.svg';
import pngHDImg from 'assets/images/pngHD_download.png';
import { DOWNLOAD_MODAL_HELP_LINK } from 'constants/links';
import { OptionTitle } from './OptionTitle';
import { DownloadOptionProps } from './DownloadModal.types';
import { RadioOptionBox } from 'modules/common/components/Radio/RadioOptionBox';
import { RadioOption } from 'modules/common/components/Radio/RadioOption';

export const DownloadOptionSelect = ({
  downloadOption,
  handleDownloadOption,
  isFreeUser,
  handleClickUpgrade,
}: DownloadOptionProps) => {
  const { t } = useTranslation('common_navbar');
  const pdfInfoTestId = 'pdf-info-iconBtn';

  const handleClickRadio = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // Find radio input
    const [option] = e.currentTarget.getElementsByTagName('input');

    if (option?.value) {
      handleDownloadOption?.(option?.value);
    }
  };

  return (
    <>
      {/* Title */}
      <OptionTitle
        upgradeDescription={t('modals.download.upgrade-premium')}
        shouldUpgrade={isFreeUser}
        handleClickUpgrade={handleClickUpgrade}
      >
        {t('modals.download.choose-format')}
      </OptionTitle>
      {/* RadioGroupBox */}
      <RadioGroup mb='4' w='full' value={isFreeUser ? 0 : downloadOption}>
        <Stack>
          <RadioOptionBox
            isDisabled={isFreeUser}
            selected={DownloadOption.PNG === downloadOption}
            onClick={handleClickRadio}
          >
            <Box>
              <RadioOption value={DownloadOption.PNG} isDisabled={isFreeUser}>
                {t('modals.download.option-png')}
                <Text as='span' fontSize='xs' fontWeight='normal' noOfLines={1}>
                  {t('modals.download.option-png-description')}
                </Text>
              </RadioOption>
            </Box>
          </RadioOptionBox>
          <RadioOptionBox
            isDisabled={isFreeUser}
            selected={DownloadOption.PNGHD === downloadOption}
            onClick={handleClickRadio}
          >
            <Box>
              <RadioOption value={DownloadOption.PNGHD} isDisabled={isFreeUser}>
                {t('modals.download.option-png-hd')}
                <Image
                  src={pngHDImg}
                  w='6'
                  h='5'
                  p='1'
                  display='inline'
                  verticalAlign='top'
                  alt='png HD download image'
                />
                <Text as='span' fontSize='xs' fontWeight='normal' noOfLines={1}>
                  {t('modals.download.option-png-hd-description')}
                </Text>
              </RadioOption>
            </Box>
          </RadioOptionBox>
          <RadioOptionBox
            isDisabled={isFreeUser}
            selected={DownloadOption.InteractivePDF === downloadOption}
            onClick={handleClickRadio}
          >
            <RadioOption value={DownloadOption.InteractivePDF} isDisabled={isFreeUser} skipTextWrap>
              <HStack align='center' spacing='0.5'>
                <Text fontSize='sm' fontWeight='medium'>
                  {t('modals.download.option-interactive-pdf')}
                </Text>
                <Toggletip
                  hasArrow={true}
                  placement={'top'}
                  offset={[60, 6]}
                  icon={<InteractivePDFIcon data-testid={pdfInfoTestId} />}
                  buttonAriaLabel={'pdf information tooltip'}
                  contentStyle={{ width: 'fit-content', borderRadius: 'base' }}
                >
                  <PDFInfoToolTip />
                </Toggletip>
              </HStack>
              <Text fontSize='xs'>{t('modals.download.option-interactive-pdf-description')}</Text>
            </RadioOption>
          </RadioOptionBox>
        </Stack>
      </RadioGroup>
    </>
  );
};

const PDFInfoToolTip = () => {
  const { t } = useTranslation('common_navbar');
  const helpLinkTestId = 'a11y-help-link';

  return (
    <Flex flexDir='column' w='60' alignItems='flex-start'>
      <Text as='span' mb='2' fontSize='xs' align='left'>
        {t('modals.download.tooltip-text-pdf')}
      </Text>
      <Link
        w='fit-content'
        href={DOWNLOAD_MODAL_HELP_LINK}
        isExternal
        variant='external'
        fontSize='xs'
        data-testid={helpLinkTestId}
      >
        {t('modals.download.accessibility-prompt-link')}
      </Link>
    </Flex>
  );
};

import { Flex, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { CustomPageOption } from 'constants/download';
import { ChangeEvent, ComponentProps, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { OptionTitle } from './OptionTitle';
import { ReactComponent as AlertIcon } from 'assets/icons/a11ymenu_alert.svg';
import { CustomPageOptionProps } from './DownloadModal.types';
import { RadioOptionBox } from 'modules/common/components/Radio/RadioOptionBox';
import { RadioOption } from 'modules/common/components/Radio/RadioOption';
import { Input } from 'modules/common/components/Input/Input';

export const CustomPageOptionSelect = ({
  customPageRangeOption,
  handleCustomPageRangeOption,
  handleCustomPageRangeInput,
  isValidRange,
  isFreeUser,
  isPremiumUser,
  handleClickUpgrade,
}: CustomPageOptionProps) => {
  const { t } = useTranslation('common_navbar');

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleCustomPageRangeInput(e.target.value || '');
  };

  const handleClickRadio = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    // Find radio input
    const [option] = e.currentTarget.getElementsByTagName('input');

    if (option?.value) {
      handleCustomPageRangeOption?.(option?.value);
    }
  };

  const shouldUpgrade = isFreeUser || isPremiumUser;

  const title = t('modals.download.title-select-pages');
  const inputError = t('modals.download.invalid-input-error');
  const optionAll = t('modals.download.option-all');
  const optionCustom = t('modals.download.option-custom');

  const inputLabel = 'Custom page range input';

  return (
    <>
      {/* Title */}
      <OptionTitle
        upgradeDescription={t('modals.download.upgrade-premium')}
        shouldUpgrade={shouldUpgrade}
        handleClickUpgrade={handleClickUpgrade}
      >
        {title}
      </OptionTitle>
      {/* RadioGroupBox */}
      <RadioGroup mb='4' w='full' value={shouldUpgrade ? 0 : customPageRangeOption}>
        <Stack spacing={0}>
          <RadioOptionBox
            isDisabled={shouldUpgrade}
            selected={CustomPageOption.All === customPageRangeOption}
            onClick={handleClickRadio}
          >
            <RadioOption value={CustomPageOption.All} isDisabled={shouldUpgrade}>
              {optionAll}
            </RadioOption>
          </RadioOptionBox>
          <RadioOptionBox
            isDisabled={shouldUpgrade}
            selected={CustomPageOption.Custom === customPageRangeOption}
            onClick={handleClickRadio}
            boxProps={{
              display: 'flex',
              lineHeight: 1,
            }}
          >
            <RadioOption value={CustomPageOption.Custom} isDisabled={shouldUpgrade}>
              {optionCustom}
            </RadioOption>
            <Input
              ml={2}
              w={120}
              size={'xs'}
              errorBorderColor='red.600'
              onChange={handleChangeInput}
              isInvalid={!isValidRange}
              cursor='text'
              isDisabled={shouldUpgrade}
              aria-label={inputLabel}
            />
          </RadioOptionBox>
        </Stack>
        {isValidRange === false && <RenderErrorMsg>{inputError}</RenderErrorMsg>}
      </RadioGroup>
    </>
  );
};

const RenderErrorMsg = ({ children }: ComponentProps<typeof Flex>) => (
  <Flex position='absolute' alignItems='center' pl='2'>
    <AlertIcon width={14} height={14} data-testid='error-alert-icon' />
    <Text ml='2' fontSize={12} color='red.500'>
      {children}
    </Text>
  </Flex>
);

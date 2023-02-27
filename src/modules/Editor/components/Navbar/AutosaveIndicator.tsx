import { ReactElement, useContext, useEffect } from 'react';
import { Flex, Text, useBoolean } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PersistManagerContext } from '../../store/persistManager';
import { ReactComponent as OkStatusIcon } from '../../../../assets/icons/a11ymenu_status_ok_transparent.svg';
import { useDebouncedCallback } from '../../../../hooks/useDebounce';

export const AutosaveIndicator = (): ReactElement => {
  const { t } = useTranslation('common_navbar');
  const { saving } = useContext(PersistManagerContext);
  const [savingState, setSavingState] = useBoolean(false);

  const testid = 'autosave-indicator';

  const debouncedUpdateSavingState = useDebouncedCallback(() => {
    setSavingState.off();
  }, 500);

  useEffect(() => {
    if (saving && !savingState) {
      setSavingState.on();
    }

    if (!saving && savingState) {
      debouncedUpdateSavingState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, savingState, debouncedUpdateSavingState]);

  return (
    <Flex
      width='109px'
      height='32px'
      background='blackAlpha.200'
      borderRadius='base'
      fontFamily='Inter, Oxygen, Helvetica, Arial, sans-serif'
      color='font.500'
      align='center'
      justify='center'
      data-testid={testid}
      gap={2}
    >
      {savingState ? null : <OkStatusIcon />}
      <Text fontSize='xs'>{savingState ? t('alert.autosave.saving') : t('alert.autosave.done')}</Text>
    </Flex>
  );
};

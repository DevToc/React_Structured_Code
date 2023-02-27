import { Flex, Text, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AccessibiltyIcon } from '../../../../../assets/icons/accessibility.svg';

export const AccessibilityCheckPrompt = ({ onSetAccessibilityView }: { onSetAccessibilityView: () => void }) => {
  const { t } = useTranslation('common_navbar');
  const testId = 'accessibility-check-prompt-button';

  return (
    <Flex
      flexDir='column'
      borderRadius='base'
      px={4}
      py={3}
      bg='yellow.100'
      w='100%'
      borderLeft={'4px solid var(--vg-colors-upgrade-blue-500)'}
    >
      <Flex flexDir='row' mb='1'>
        <AccessibiltyIcon style={{ width: '17px', height: '17px' }} />
        <Text ml={2} fontSize='xs' fontWeight='bold'>
          {t('modals.download.accessibility-prompt-header')}
        </Text>
      </Flex>
      <Text fontSize='xs'>{t('modals.download.accessibility-prompt-text')}</Text>
      <Button
        mt={1.5}
        fontWeight='semibold'
        size='xs'
        w='fit-content'
        variant='transparent-outline'
        onClick={onSetAccessibilityView}
        data-testid={testId}
      >
        {t('modals.download.accessibility-prompt-button')}
      </Button>
    </Flex>
  );
};

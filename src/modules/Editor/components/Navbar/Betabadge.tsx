import { ReactElement } from 'react';
import { Badge } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const BetaBadge = (): ReactElement => {
  const { t } = useTranslation('common_navbar');

  return (
    <Badge ml='12px' variant='solid' colorScheme='green' data-testid='betabadge'>
      {t('badge')}
    </Badge>
  );
};

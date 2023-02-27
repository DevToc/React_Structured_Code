import { Button } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { AltTextModalTrigger } from '../../AltTextModal/AltTextModalTrigger';

interface AltTextMenuProps {
  widgetId: string;
}

const ModalTrigger = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useTranslation('editor_toolbar_alt_text_menu', { useSuspense: false });

  return (
    <Button size='sm' onClick={onClick} fontWeight='semibold' variant='ghost' data-testid={'alttext-toolbar-button'}>
      {t('altTextMenu')}
    </Button>
  );
};

export const AltTextMenu = ({ widgetId }: AltTextMenuProps) => {
  return <AltTextModalTrigger widgetId={widgetId} trigger={<ModalTrigger />} />;
};

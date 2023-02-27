import { Button } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type UpgradeButtonProps = {
  handleClickUpgrade: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const UpgradeButton = ({ handleClickUpgrade }: UpgradeButtonProps) => {
  const { t } = useTranslation('common_navbar');

  return (
    <Button w='100%' onClick={handleClickUpgrade} variant={'upgrade'}>
      {t('modals.download.upgrade-download-button')}
    </Button>
  );
};

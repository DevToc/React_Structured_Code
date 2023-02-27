import { Flex, Link, Text } from '@chakra-ui/react';
import { ReactComponent as LockDownloadIcon } from 'assets/icons/lock_download.svg';
import { OptionTitleProps } from './DownloadModal.types';

export const OptionTitle = ({ children, upgradeDescription, shouldUpgrade, handleClickUpgrade }: OptionTitleProps) => {
  const lockDownloadTestId = 'lock-download-icon';

  return (
    <Flex alignItems={'center'} pb='2'>
      <Text fontSize='sm' fontWeight='semibold' mr='2'>
        {children}
      </Text>
      {shouldUpgrade && (
        <>
          <LockDownloadIcon data-testid={lockDownloadTestId} />
          <Link fontSize='sm' color='brand.500' fontWeight='semibold' ml='1' onClick={handleClickUpgrade}>
            {upgradeDescription}
          </Link>
        </>
      )}
    </Flex>
  );
};

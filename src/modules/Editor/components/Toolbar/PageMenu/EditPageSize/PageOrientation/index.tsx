import { ReactElement } from 'react';
import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PortraitIcon } from 'assets/icons/portrait_page.svg';
import { Orientation } from '../config';

interface PageOrientationProps {
  orientation: Orientation;
  onChange?: (orientation: Orientation) => void;
}

const PageOrientation = ({ orientation, onChange }: PageOrientationProps): ReactElement => {
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });
  const isPortrait = orientation === Orientation.portrait;

  const getIconColor = (isActive: boolean) =>
    isActive ? 'var(--vg-colors-upgrade-blue-500)' : 'var(--vg-colors-font-500)';
  const handlePortraitChange = () => onChange?.(Orientation.portrait);
  const handleLandscapeChange = () => onChange?.(Orientation.landscape);

  return (
    <Box>
      <Flex direction='row' gap='1'>
        <Tooltip hasArrow placement='bottom' label={t('pageSize.portraitButton.tooltip')} bg='black'>
          <IconButton
            onClick={handlePortraitChange}
            size='sm'
            aria-label={t('pageSize.portraitButton.ariaLabel')}
            bg='transparent'
            icon={<PortraitIcon stroke={getIconColor(isPortrait)} />}
          />
        </Tooltip>
        <Tooltip hasArrow placement='bottom' label={t('pageSize.landscapeButton.tooltip')} bg='black'>
          <IconButton
            onClick={handleLandscapeChange}
            size='sm'
            aria-label={t('pageSize.landscapeButton.ariaLabel')}
            bg='transparent'
            transform='scale(-1,1) rotate(-90deg)'
            icon={<PortraitIcon stroke={getIconColor(!isPortrait)} />}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
};

export { PageOrientation };

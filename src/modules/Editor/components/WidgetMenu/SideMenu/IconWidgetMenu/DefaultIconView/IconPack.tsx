import { useEffect } from 'react';
import { Flex, IconButton, Text, Button, Box } from '@chakra-ui/react';

import { IconColorOption } from 'types/icon.types';
import { usePaginatedIconSearch } from 'hooks/usePaginatedIconSearch';
import { ReactComponent as BackIcon } from 'assets/icons/chevron_left.svg';

import { IconPackData } from './IconView.types';
import { IconList } from '../IconList';

/**
 * ICON PACK COMPONENT
 *
 * Renders a paginated list of icons that belong to a specific icon pack.
 * Icons are retrieved from Algolia using the usePaginatedIconSearch hook.
 */
interface IconPackProps {
  iconPackData: IconPackData | null;
  colorOptions?: IconColorOption[];
  onExitView: () => void;
  onClickIconWidget: (iconId: string, viewBox: string) => void;
}

export const IconPack = ({ iconPackData, onExitView, onClickIconWidget, colorOptions }: IconPackProps) => {
  // Set filter by pack flag when doing paginated search
  const { hasMore, isLoadingMore, icons, onShowMore, searchIcons, clearSearch } = usePaginatedIconSearch({
    filterByIconPack: true,
    colorOptions,
  });

  // Update icon list when selected pack changes
  useEffect(() => {
    if (!iconPackData) {
      clearSearch();
      return;
    }

    searchIcons(iconPackData.id.toString());
  }, [iconPackData, searchIcons, clearSearch]);

  if (!iconPackData) {
    return null;
  }

  return (
    <Flex overflow={'auto'}>
      <Flex w={'full'} p={3} pr={0} overflow={'hidden'} direction={'column'}>
        <Flex alignItems={'center'} h={30}>
          <IconButton
            variant={'icon-btn-side-menu'}
            size={'xs'}
            icon={<BackIcon />}
            aria-label={'Go back to icon pack list'}
            onClick={onExitView}
            autoFocus={true}
          />
          <Text ml={2} fontSize='sm' color='font.500' fontWeight='semibold'>
            {iconPackData?.name}
          </Text>
        </Flex>

        <Box overflow={'auto'} flex={1}>
          <Box mt={4}>
            <IconList icons={icons} onClickIconWidget={onClickIconWidget} testId={'iconwidgetmenu-pack-icon-list'} />
          </Box>

          {/* Show more button */}
          {hasMore && (
            <Flex justify='center'>
              <Button isLoading={isLoadingMore} onClick={onShowMore} colorScheme='green' mt={4} size='sm'>
                Show More
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

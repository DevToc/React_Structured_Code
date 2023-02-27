import { Flex, Image } from '@chakra-ui/react';

import { STYLED_RESPONSIVE_TEXT_WIDGETS } from './ElementsMenu.config';

interface ElementThumbnailProps {
  index: number;
  onClick: (index: number) => void;
}

export const ElementThumbnail = ({ index, onClick }: ElementThumbnailProps) => {
  const styleData = STYLED_RESPONSIVE_TEXT_WIDGETS[index];

  const handleClick = () => {
    onClick?.(index);
  };

  if (!styleData) return null;

  const { thumbnail } = styleData;

  return (
    <Flex
      w={'full'}
      h={'full'}
      direction={'column'}
      gap={1}
      p={4}
      alignItems={'center'}
      justifyContent={'center'}
      as={'button'}
      border={'1px solid'}
      borderColor={'divider.gray'}
      borderRadius={'base'}
      onClick={handleClick}
      transitionDuration={'200ms'}
      _hover={{
        bg: 'hover.gray',
      }}
      data-testid={`elementsmenu-${index}-btn`}
    >
      <Image src={thumbnail.src} objectFit={'contain'} h={'full'} alt={thumbnail.altText} />
    </Flex>
  );
};

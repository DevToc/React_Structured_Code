import { Box, Divider, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import React, { memo, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { IconPackData } from './IconView.types';

/**
 * ICON PACK LIST COMPONENT
 *
 * Renders a list of icon pack previews
 */
interface IconPackListProps {
  packs: IconPackData[];
  onSelectPack: (iconPack: IconPackData) => void;
  show: boolean;
  testId: string;
}

export const IconPackList = memo(({ packs, onSelectPack, show, testId }: IconPackListProps) => {
  const packCardRefList = useRef<{ [value: number]: HTMLDivElement }>({});
  const style = !show ? { display: 'none' } : {};

  const setCardRef = (ref: Element | null, packIdx: number) => {
    if (!ref) return null;
    packCardRefList.current[packIdx] = ref as HTMLDivElement;
  };

  // On show, set focus to first
  useEffect(() => {
    if (show) {
      packCardRefList.current[0]?.focus();
    }
  }, [show]);

  return (
    <Flex direction={'column'} gap={4} sx={style} data-testid={testId}>
      {packs.map((data, idx) => (
        <IconPackCard
          iconPackData={data}
          key={data.name}
          onClick={onSelectPack}
          setCardRef={setCardRef}
          packIdx={idx}
        />
      ))}
    </Flex>
  );
});

interface IconPackCardProps {
  iconPackData: IconPackData;
  onClick: (iconPack: IconPackData) => void;
  packIdx: number;
  setCardRef: (ref: Element | null, packIdx: number) => void;
}

const IconPackCard = memo(({ iconPackData, onClick, setCardRef, packIdx }: IconPackCardProps) => {
  const setRef = (ref: Element | null) => setCardRef(ref, packIdx);
  const { displayIconIds, name } = iconPackData;

  const handleClickCard = () => {
    onClick(iconPackData);
  };

  return (
    <Box
      ref={setRef}
      borderRadius={'lg'}
      border={'1px solid'}
      borderColor={'gray.100'}
      overflow={'hidden'}
      role={'group'}
      cursor={'pointer'}
      onClick={handleClickCard}
      as={'button'}
    >
      <Grid
        gridTemplateColumns={`repeat(${displayIconIds.length / 2}, auto)`}
        p={3}
        columnGap={4}
        rowGap={2}
        transitionDuration={'200ms'}
        _groupHover={{ bg: 'hover.gray' }}
      >
        {displayIconIds.map((iconId) => (
          <GridItem key={iconId} h={50}>
            <Icon iconId={iconId} />
          </GridItem>
        ))}
      </Grid>
      <Divider />
      <Text fontSize={'xs'} p={3} color={'font.500'} textAlign={'left'}>
        {name}
      </Text>
    </Box>
  );
});

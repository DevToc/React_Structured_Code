import { ReactElement, useState, useEffect } from 'react';
import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

import { IconColorOption } from 'types/icon.types';
import { useIconPackLoader } from './useIconPackLoader';
import { IconPackList } from './IconPackList';
import { IconPackData } from './IconView.types';
import { IconPack } from './IconPack';

/**
 * Icon Pack View component
 *
 * Renders default icon view when no search query is present.
 * Will render a list of clickable icon pack previews.
 */
interface IconPackViewProps {
  onClickIconWidget: (iconId: string, viewBox: string) => void;
  show: boolean;
  colorOptions?: IconColorOption[];
}

export const IconPackView = ({
  onClickIconWidget,
  show,
  colorOptions = [IconColorOption.All, IconColorOption.Color, IconColorOption.Mono],
}: IconPackViewProps): ReactElement => {
  // Persist the icon pack view + prevent lag when clearing icon search
  const style = show ? {} : { display: 'none' };

  const { iconPackData } = useIconPackLoader();

  const [selectedPack, setSelectedPack] = useState<IconPackData | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const [filteredPacks, setFilteredPacks] = useState<{
    [IconColorOption.Color]: IconPackData[];
    [IconColorOption.Mono]: IconPackData[];
    [IconColorOption.All]: IconPackData[];
  }>({ [IconColorOption.Color]: [], [IconColorOption.Mono]: [], [IconColorOption.All]: [] });

  const handleClickPack = (iconPack: IconPackData) => {
    setSelectedPack(iconPack);
  };

  const onChangeTab = (index: number) => {
    setSelectedPack(null);
    setTabIndex(index);
  };

  const handleBack = () => {
    setSelectedPack(null);
  };

  // Icon pack data does not change once loaded, so only filter the icons once
  // instead of everytime a tab is changed
  useEffect(() => {
    const colourPacks = iconPackData.filter((pack) => !pack.isMono);
    const monoPacks = iconPackData.filter((pack) => pack.isMono);

    setFilteredPacks({
      [IconColorOption.Color]: colourPacks,
      [IconColorOption.Mono]: monoPacks,
      [IconColorOption.All]: iconPackData,
    });
  }, [iconPackData]);

  // if a non-mono pack is selected and the color option is changed to mono deselect the pack
  const isOnlyMono = colorOptions.length === 1 && colorOptions[0] === IconColorOption.Mono;
  if (selectedPack && !selectedPack.isMono && isOnlyMono) setSelectedPack(null);

  // reset tab index if it is out of bounds
  if (tabIndex >= colorOptions.length) setTabIndex(0);

  return (
    <Flex direction={'column'} overflow={'auto'} sx={style}>
      <Tabs
        display='flex'
        flexDir='column'
        flex='1'
        index={tabIndex}
        onChange={onChangeTab}
        overflow={'hidden'}
        minH={10}
        isLazy
        lazyBehavior={'keepMounted'}
      >
        <TabList h={10} data-testid={'icon-pack-style-tab-menu'}>
          {colorOptions.map((iconColorOption: IconColorOption) => (
            <Tab
              key={iconColorOption}
              fontSize='sm'
              fontWeight='semibold'
              textTransform='capitalize'
              _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}
            >
              {iconColorOption}
            </Tab>
          ))}
        </TabList>
        <TabPanels flex='1' overflow='auto'>
          {colorOptions.map((iconColorOption: IconColorOption) => (
            <TabPanel
              overflow={'auto'}
              key={iconColorOption}
              display={!selectedPack ? 'block' : 'none'}
              _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}
            >
              <IconPackList
                packs={filteredPacks[iconColorOption]}
                onSelectPack={handleClickPack}
                show={!selectedPack}
                testId={'iconwidgetmenu-icon-pack-list'}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      {
        <IconPack
          iconPackData={selectedPack}
          onExitView={handleBack}
          onClickIconWidget={onClickIconWidget}
          colorOptions={colorOptions}
        />
      }
    </Flex>
  );
};

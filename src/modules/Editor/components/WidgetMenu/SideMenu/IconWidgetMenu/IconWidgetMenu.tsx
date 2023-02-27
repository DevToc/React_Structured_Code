import { ReactElement, useState, FocusEvent } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Flex, Box, Button, Text, Spinner, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

import { IconColorOption } from 'types/icon.types';
import { usePaginatedIconSearch, PaginatedIconSearch } from 'hooks/usePaginatedIconSearch';
import { useAppSelector } from 'modules/Editor/store/hooks';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { SearchInput } from 'modules/common/components/SearchInput/SearchInput';
import { generateDefaultData } from 'widgets/IconWidget/IconWidget.helpers';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO } from 'utils/calculateInitialWidgetPos';
import { NewWidget } from 'widgets/Widget.types';
import { IconList } from './IconList';
import { IconPackView } from './DefaultIconView/IconPackView';

const SEARCH_LABEL = 'Search icons';
const CLEAR_BUTTON_LABEL = 'Clear icon search';

type OnClickIconWidget =
  | ActionCreatorWithPayload<NewWidget | NewWidget[], string>
  | ((widget: NewWidget | NewWidget[], viewBox: string) => void);

interface IconWidgetMenuProps {
  isIconWidgetMenuActive: boolean;
  onClickIconWidget: OnClickIconWidget;
  colorOptions?: IconColorOption[];
}

export const IconWidgetMenu = ({
  isIconWidgetMenuActive,
  onClickIconWidget,
  colorOptions,
}: IconWidgetMenuProps): ReactElement => {
  // persist icon menu state when switching sidebar tabs
  const display = isIconWidgetMenuActive ? '' : 'none';
  const paginatedIconSearch = usePaginatedIconSearch({ colorOptions });
  const { searchIcons, clearSearch, query } = paginatedIconSearch;

  const zoom = useAppSelector(selectZoom);
  const infographWidthPx = useAppSelector(selectInfographWidthPx);

  const handleClickIconWidget = (iconId: string, viewBox: string): void => {
    const initialTopPx = calculateInitialTopPx(zoom);
    const initialLeftPx = INITIAL_LEFTPX_RATIO * infographWidthPx;
    const widget = generateDefaultData(iconId, viewBox, initialTopPx, initialLeftPx);

    onClickIconWidget(widget, viewBox);
  };

  return (
    <Box display={display} h='full'>
      <Flex direction='column' h='full'>
        <Box p='4'>
          <SearchInput
            onSearch={searchIcons}
            clearSearch={clearSearch}
            label={SEARCH_LABEL}
            clearButtonLabel={CLEAR_BUTTON_LABEL}
          />
        </Box>
        {query && <IconSearch onClickIconWidget={onClickIconWidget} paginatedIconSearch={paginatedIconSearch} />}
        <IconPackView colorOptions={colorOptions} onClickIconWidget={handleClickIconWidget} show={!query} />
      </Flex>
    </Box>
  );
};

interface IconSearchProps {
  paginatedIconSearch: PaginatedIconSearch;
  onClickIconWidget: OnClickIconWidget;
}

const IconSearch = ({ paginatedIconSearch, onClickIconWidget }: IconSearchProps) => {
  const {
    hasMore,
    isLoadingInitialData,
    isLoadingMore,
    selectedColorOption,
    colorOptions,
    setSelectedColorOption,
    icons,
    onShowMore,
    query,
    hasNoResultsFound,
  } = paginatedIconSearch;
  const [focusTabPanel, setFocusTabPanel] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClickIconWidget = (iconId: string, viewBox: string): void => {
    const widget = generateDefaultData(iconId, viewBox);
    onClickIconWidget(widget, viewBox);
  };

  const hasIcons = !!(icons && icons.length);
  const showStyleTabs = !!((hasIcons || selectedColorOption !== IconColorOption.All) && query);

  const handleTabChange = (index: number) => {
    setSelectedColorOption(colorOptions[index]);
    setTabIndex(index);
  };

  const handleFocus = (e: FocusEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;
    setFocusTabPanel(true);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setFocusTabPanel(false);
  };

  // reset tab index if it is out of bounds
  if (tabIndex >= colorOptions.length) setTabIndex(0);

  return (
    <Flex direction='column' h='full' overflow={'auto'}>
      {showStyleTabs ? (
        <Tabs onChange={handleTabChange} index={tabIndex} display='flex' flexDir='column' flex='1' overflow='hidden'>
          <TabList h={10} data-testid='icon-style-tab-menu'>
            {colorOptions.map((colorOption: IconColorOption) => (
              <Tab
                key={colorOption}
                fontSize='sm'
                fontWeight='semibold'
                textTransform='capitalize'
                _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}
              >
                {colorOption}
              </Tab>
            ))}
          </TabList>
          <TabPanels flex='1' overflow='auto'>
            {colorOptions.map((colorOption: IconColorOption) => (
              <TabPanel
                key={colorOption}
                pr='0'
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  boxShadow: focusTabPanel ? 'inset var(--vg-shadows-outline)' : 'unset',
                }}
              >
                <IconList icons={icons} onClickIconWidget={handleClickIconWidget} />

                {/* Show more button */}
                {hasMore && (
                  <Flex justify='center'>
                    <Button isLoading={isLoadingMore} onClick={onShowMore} colorScheme='green' mt={4} size='sm'>
                      Show More
                    </Button>
                  </Flex>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : null}

      {/* Loading indicator */}
      {isLoadingInitialData && (
        <Spinner data-testid='icon-widgetmenu-spinner' alignSelf='center' color='var(--vg-colors-brand-500)' />
      )}

      {/* Error handler: NotFound */}
      {hasNoResultsFound && <NoIconsFound query={query} />}
    </Flex>
  );
};

interface NoIconsFoundProps {
  query: string;
}

const NoIconsFound = ({ query }: NoIconsFoundProps): ReactElement => (
  <Text p='4'>We didn't find any icons for {query}</Text>
);

import { ReactElement } from 'react';
import { Button, ButtonGroup, Popover, PopoverTrigger, PopoverContent, Text, Flex, useBoolean } from '@chakra-ui/react';

import { Keyboard } from 'modules/common/components/Keyboard';

import { moveWidgetInLayer } from 'modules/Editor/store/infographSlice';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';

import { WidgetDirection } from 'modules/Editor/store/infographSlice.types';

import { layerOptions } from './LayerMenu.config';

const label = 'Layer';

export const LayerMenu = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useBoolean(false);
  const activePageId = useAppSelector(selectActivePage);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const isOneWidget = activeWidgets.length === 1;
  const isDisabled = !isOneWidget;

  const moveWidget = (direction: WidgetDirection) => {
    const moveWidgetObj = {
      pageId: activePageId,
      widgetId: activeWidgets[0].groupId || activeWidgets[0].responsiveGroupId || activeWidgets[0].id,
      direction,
    };
    dispatch(moveWidgetInLayer(moveWidgetObj));
  };

  if (isOpen && isDisabled) setIsOpen.off();

  return (
    <Popover isOpen={isOpen} onClose={setIsOpen.off} placement='bottom-end'>
      <PopoverTrigger>
        <Button
          variant='icon-btn-toolbar-option'
          data-testid='widget-layer-menu-trigger-button'
          fontWeight='semibold'
          isDisabled={isDisabled}
          onClick={setIsOpen.toggle}
          isActive={isOpen}
          size='sm'
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent w='fit-content' boxShadow='md' padding={0} data-testid='widget-layer-menu-content'>
        <ButtonGroup gap={1} p={2} variant='outline' spacing='0' display='flex' size='sm' flexDir='column'>
          {layerOptions.map((layerOption, index) => {
            const onClick = () => moveWidget(layerOption.direction);
            return (
              <Button
                variant='ghost'
                key={index}
                display='flex'
                gap={3}
                onClick={onClick}
                sx={{
                  ':hover': {
                    borderRadius: 'var(--vg-radii-base)',
                  },
                }}
              >
                <Flex flex={1} gap={1} fontWeight='medium' alignItems='center'>
                  {layerOption.icon}
                  <Text align='left' color='var(--vg-colors-font-500)'>
                    {layerOption.label}
                  </Text>
                </Flex>
                <Flex>
                  <Keyboard
                    color='var(--vg-colors-font-300)'
                    shortcut={layerOption.shortcuts.others}
                    macOs={layerOption.shortcuts.macOs}
                  />
                </Flex>
              </Button>
            );
          })}
        </ButtonGroup>
      </PopoverContent>
    </Popover>
  );
};

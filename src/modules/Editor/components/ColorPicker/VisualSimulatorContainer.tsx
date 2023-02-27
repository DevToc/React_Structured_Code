import { useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { COLOR_MENU, VISUAL_SIMULATOR_TAB_OPENED } from 'constants/mixpanel';
import { ColorVisualIcon } from 'modules/common/components/ColorVisualIcon';
import { useAppDispatch } from 'modules/Editor/store';
import { setAccessibilityViewIndex } from 'modules/Editor/store/editorSettingsSlice';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';

const CONTAINER_WIDTH = '264px';
const CONTAINER_HEIGHT = '70px';

const VisualSimulatorContainer = () => {
  const dispatch = useAppDispatch();
  const openVisualSimulator = useCallback(() => {
    dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.SIMULATOR));

    Mixpanel.track(VISUAL_SIMULATOR_TAB_OPENED, {
      from: COLOR_MENU,
    });
  }, [dispatch]);

  return (
    <Box w='100%' p='3'>
      <Flex
        data-testid='colorpicker-visual-simulator'
        as='button'
        w={CONTAINER_WIDTH}
        h={CONTAINER_HEIGHT}
        m='auto'
        gap='4'
        p='3'
        justifyContent='center'
        alignItems='center'
        bg='gray.50'
        borderRadius='base'
        aria-label='Open Visual Simulator'
        _hover={{
          backgroundColor: 'black-alpha.200',
        }}
        onClick={openVisualSimulator}
      >
        <Box p='2' bg='white' borderRadius='.375rem'>
          <ColorVisualIcon size='1.725rem' />
        </Box>
        <Box textAlign='left'>
          <Text color='font.500' fontWeight='medium' fontSize='sm'>
            Visual Simulator
          </Text>
          <Text color='font.500' fontSize='xs'>
            See through the eyes of people with visual impairments.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export { VisualSimulatorContainer };

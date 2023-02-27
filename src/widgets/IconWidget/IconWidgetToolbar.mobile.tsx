import { ReactElement, Suspense, useMemo } from 'react';
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useWindowSize } from 'hooks/useWindowSize';

import { useWidget } from 'widgets/sdk';
import { useIcon } from 'hooks/useIcon';
import { ColorPickerInContext } from 'modules/Editor/components/ColorPicker';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { SliderNumberInput } from 'modules/common/components/Input/SliderNumberInput';
import { IconWidgetData } from './IconWidget.types';

import { ReactComponent as MirrorIcon } from 'assets/icons/switch.svg';
import { ReactComponent as FillIcon } from 'assets/icons/drop.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_circle.svg';

const COLOR_ICON_SIZE = 5;
const TRIGGER_BUTTON_SIZE = 8;

interface DefaultTriggerProps {
  onClick: () => void;
}
type IconStyle = 'fill' | 'border' | 'text';

interface Props extends DefaultTriggerProps {
  iconStyle: IconStyle;
  color: string;
}

export const IconWidgetToolbarMenuMobile = (): ReactElement => {
  const { iconId } = useWidget<IconWidgetData>();
  const { data: iconData } = useIcon(iconId);
  const { deviceWidth } = useWindowSize();

  const iconHasColorMenu = iconData && typeof iconData.color === 'number' && !iconData.color;

  return (
    <Flex w={deviceWidth - 15} p='10px' gap='8px' align='center' data-testid='basic-shape-widget-toolbar'>
      <IconMirrorMenu />
      {iconHasColorMenu && <IconColorMenu />}
      <AltTextMenuWrapper />
    </Flex>
  );
};

const AltTextMenuWrapper = () => {
  const { widgetId } = useWidget<IconWidgetData>();
  return (
    <Box //
      mr='5px'
      p='10px 10px'
      as='div'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box w='75px' as='div'>
        <AltTextMenu widgetId={widgetId} />
      </Box>
    </Box>
  );
};

const IconMirrorMenu = (): ReactElement | null => {
  const { isMirrored, updateWidget } = useWidget<IconWidgetData>();
  const onUpdateIconMirror = () => updateWidget({ isMirrored: !isMirrored });

  if (typeof isMirrored !== 'boolean') return null;

  return (
    <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IconButton
        mb='10px'
        onClick={onUpdateIconMirror}
        variant={'ghost'}
        isActive={isMirrored}
        size='sm'
        aria-label={'Mirror Icon'}
        icon={<MirrorIcon />}
      />
      <Box w='75px' as='div'>
        <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
          Mirror
        </Text>
      </Box>
    </Box>
  );
};

const IconColorMenu = (): ReactElement => {
  const { updateWidget, shapeFill, shapeColorOne, shapeColorTwo } = useWidget<IconWidgetData>();
  const { isOpen: isColorFillOpen, onToggle: toggleColorFill } = useDisclosure();
  const { isOpen: isFillColorOpen, onToggle: toggleFillColor } = useDisclosure();
  const { isOpen: isFillColorTwoOpen, onToggle: toggleFillColorTwo } = useDisclosure();

  const onUpdateShapeFill = (newShapeFill: number) => updateWidget({ shapeFill: newShapeFill });
  const onUpdateColorOne = (newShapeColorOne: string) => updateWidget({ shapeColorOne: newShapeColorOne });
  const onUpdateColorTwo = (newShapeColorTwo: string) => updateWidget({ shapeColorTwo: newShapeColorTwo });

  const colorFillTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleFillColor,
    }),
    [toggleFillColor],
  );

  const colorFillTwoTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleFillColorTwo,
    }),
    [toggleFillColorTwo],
  );

  const hasSecondaryColorFill = shapeFill > 0;

  return (
    <>
      <Box
        onClick={() => toggleColorFill()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Font Icon' icon={<FillIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Shape Fill %
          </Text>
        </Box>
      </Box>

      <Box
        onClick={() => toggleFillColor()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <DefaultTrigger iconStyle='fill' color={shapeColorOne} {...colorFillTriggerProps} />

        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Color One
          </Text>
        </Box>
      </Box>

      {hasSecondaryColorFill && (
        <Box
          onClick={() => toggleFillColorTwo()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <DefaultTrigger iconStyle='fill' color={shapeColorTwo} {...colorFillTwoTriggerProps} />

          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Fill Color Two
            </Text>
          </Box>
        </Box>
      )}

      <Drawer placement='bottom' onClose={toggleColorFill} isOpen={isColorFillOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Adjust Percentage</p>
              <CloseIcon onClick={toggleColorFill} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <FillPercentOption value={shapeFill} onChange={onUpdateShapeFill} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleFillColor} isOpen={isFillColorOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Shape Color</p>
              <CloseIcon onClick={toggleFillColor} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={shapeColorOne}
                label={'Shape Color'}
                onChange={onUpdateColorOne}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleFillColorTwo} isOpen={isFillColorTwoOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Shape Color Two</p>
              <CloseIcon onClick={toggleFillColorTwo} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={shapeColorTwo}
                label={'Shape Color Two'}
                onChange={onUpdateColorTwo}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const FillPercentOption = ({ value, onChange }: { value: number; onChange: (f: number) => void }) => {
  return (
    <SliderNumberInput
      title={'Shape Fill'}
      value={value}
      onChange={onChange}
      suffix={'%'}
      sliderWidth={120}
      containerProps={{ p: 2, pt: 3 }}
    />
  );
};

const DefaultTrigger = ({ iconStyle, color, ...defaultTriggerProps }: Props) => {
  const isBorder = iconStyle === 'border';
  return (
    <Flex
      w={TRIGGER_BUTTON_SIZE}
      h={TRIGGER_BUTTON_SIZE}
      mb='10px'
      borderRadius='5px'
      as='button'
      transition='opacity 0.2s'
      _focus={{
        boxShadow: 'var(--vg-shadows-outline)',
        outline: 'none',
      }}
      _hover={{ bg: 'hover.gray' }}
      justifyContent='center'
      alignItems='center'
      background='#dbdbdb'
      {...defaultTriggerProps}
    >
      <Flex
        w={COLOR_ICON_SIZE}
        h={COLOR_ICON_SIZE}
        borderRadius='sm'
        background={color}
        border='1px solid var(--vg-colors-black-alpha-500)'
        justifyContent='center'
        alignItems='center'
      >
        {isBorder && <Box w={2} h={2} bg='white' boxShadow='0px 0px 0px 1px var(--vg-colors-black-alpha-500) inset' />}
      </Flex>
    </Flex>
  );
};

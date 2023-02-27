import { Suspense, useMemo } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  Box,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useWindowSize } from 'hooks/useWindowSize';

import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectWidget } from 'modules/Editor/store/infographSelector';
import { updateWidget } from 'modules/Editor/store/infographSlice';

import { BasicShapeWidgetData } from 'widgets/BasicShapeWidget/BasicShapeWidget.types';
import { DEFAULT_BORDER_WIDTH } from 'widgets/BasicShapeWidget/BasicShapeWidget.config';
import { ComponentWidgetIdKeys, ResponsiveTextWidgetData } from './ResponsiveTextWidget.types';
import { ColorPickerInContext } from 'modules/Editor/components/ColorPicker';
import { useWidget } from 'widgets/sdk';

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

export const ResponsiveTextToolbarMobile = () => {
  const { deviceWidth } = useWindowSize();

  return (
    <Flex w={deviceWidth - 15} p='10px' gap='8px' align='center' data-testid='responsive-text-widget-toolbar'>
      <Fill />
      <BorderColorOption />
    </Flex>
  );
};

const Fill = () => {
  const dispatch = useAppDispatch();
  const { isOpen: isFillColorOpen, onToggle: toggleFillColor } = useDisclosure();
  const { componentWidgetIdMap } = useWidget<ResponsiveTextWidgetData>();
  const shapeWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.BackgroundShape];
  const shapeWidgetData = useAppSelector(selectWidget(shapeWidgetId)) as BasicShapeWidgetData;
  const { fillColor } = shapeWidgetData;

  const colorFillTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleFillColor,
    }),
    [toggleFillColor],
  );

  const onUpdatePrimaryFillColor = (newFillColor: string): void => {
    const widgetFillColor = { fillColor: [newFillColor] };
    if (fillColor[1]) widgetFillColor.fillColor.push(fillColor[1]);

    dispatch(
      updateWidget({
        widgetId: shapeWidgetId,
        widgetData: {
          fillColor: widgetFillColor.fillColor,
        },
      }),
    );
  };

  return (
    <>
      <Box
        onClick={() => toggleFillColor()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <DefaultTrigger iconStyle='fill' color={fillColor[0]} {...colorFillTriggerProps} />

        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Fill Color
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleFillColor} isOpen={isFillColorOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Background Color</p>
              <CloseIcon onClick={toggleFillColor} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={fillColor[0] ?? ''}
                label={'Background Color'}
                onChange={onUpdatePrimaryFillColor}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const BorderColorOption = () => {
  const dispatch = useAppDispatch();
  const { componentWidgetIdMap } = useWidget<ResponsiveTextWidgetData>();
  const shapeWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.BackgroundShape];
  const shapeWidgetData = useAppSelector(selectWidget(shapeWidgetId)) as BasicShapeWidgetData;
  const {
    border: { color, width },
  } = shapeWidgetData;
  const { isOpen: isBorderColorOpen, onToggle: toggleBorderColor } = useDisclosure();

  const borderColorTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleBorderColor,
    }),
    [toggleBorderColor],
  );

  const onUpdateBorderColor = (borderColor: string): void => {
    const newBorder = {
      color: borderColor,
      width: width === 0 ? DEFAULT_BORDER_WIDTH : undefined,
    };

    dispatch(
      updateWidget({
        widgetId: shapeWidgetId,
        widgetData: {
          border: newBorder,
        },
      }),
    );
  };

  return (
    <>
      <Box
        onClick={() => toggleBorderColor()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <DefaultTrigger iconStyle='border' color={color} {...borderColorTriggerProps} />

        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Border Color
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleBorderColor} isOpen={isBorderColorOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Border Color</p>
              <CloseIcon onClick={toggleBorderColor} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={color ?? ''}
                label={'Border Color'}
                onChange={onUpdateBorderColor}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
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

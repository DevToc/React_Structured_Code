import { Suspense } from 'react';

import {
  Box,
  ButtonGroup,
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

import { useWidget, useEditor } from 'widgets/sdk';
import { CROP_BUTTON_ID } from './ImageWidget.config';
import { ImageWidgetData } from './ImageWidget.types';
import { FRAME_SHAPE_LIST } from './Frame/frame.config';
import { FrameShape } from './Frame/frame.types';
import { isSquareFrame } from './Frame/frame';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { SliderNumberInput } from 'modules/common/components/Input/SliderNumberInput';

import { ReactComponent as CropIcon } from 'assets/icons/crop.svg';
import { ReactComponent as ImageFrameIcon } from 'assets/icons/rectangle.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_circle.svg';
import { ReactComponent as OpacityIcon } from 'assets/icons/opacity.svg';

interface FrameOptionMenuProps {
  value: FrameShape;
  onChange: (v: FrameShape) => void;
}

const cropLabel = 'Crop';

export const ImageWidgetToolbarMenuMobile = () => {
  return (
    <Flex gap='8px'>
      <FrameOptionMenu />
      <CropMenu />

      <OpacityOptionWrapper />
      <AltTextMenuWrapper />
    </Flex>
  );
};

const OpacityOption = ({ value, onChange }: { value: number; onChange: (f: number) => void }) => {
  return (
    <SliderNumberInput
      title={'Opacity'}
      value={Math.trunc(value * 100)}
      onChange={onChange}
      suffix={'%'}
      sliderWidth={100}
      containerProps={{ p: 2, pt: 3 }}
    />
  );
};

const OpacityOptionWrapper = () => {
  const { opacity = 1, updateWidget } = useWidget<ImageWidgetData>();
  const { isOpen: isOpacityOpen, onToggle: toggleOpacity } = useDisclosure();

  const onChangeOpacity = (newValue: number) => updateWidget({ opacity: newValue / 100 });

  return (
    <>
      <Box
        onClick={() => toggleOpacity()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Font Icon' icon={<OpacityIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Opacity
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleOpacity} isOpen={isOpacityOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Adjust Opacity</p>
              <CloseIcon onClick={toggleOpacity} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <OpacityOption value={opacity} onChange={onChangeOpacity} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const AltTextMenuWrapper = () => {
  const { widgetId } = useWidget<ImageWidgetData>();

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

const CropMenu = () => {
  const { isCropView, toggleCropView } = useEditor();

  return (
    <Box //
      mr='5px'
      p='10px 10px'
      as='div'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <IconButton
        mb='10px'
        id={CROP_BUTTON_ID}
        onClick={toggleCropView}
        size='sm'
        aria-label={cropLabel}
        icon={<CropIcon style={{ pointerEvents: 'none' }} />}
        isActive={isCropView}
      />

      <Box w='75px' as='div'>
        <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
          Crop
        </Text>
      </Box>
    </Box>
  );
};

const FrameOptionMenu = () => {
  const { updateWidget, widthPx, heightPx, crop, imageRect, frame: value } = useWidget<ImageWidgetData>();
  const { boundingBox } = useEditor();
  const { isOpen: isCropShapeOpen, onToggle: toggleCropShape } = useDisclosure();

  const onChangeFrame = (frame: FrameShape) => {
    if (isSquareFrame(frame)) {
      const isWidthLarger = widthPx >= heightPx;
      const squareSidePx = Math.min(widthPx, heightPx);

      let newCrop = { ...crop };
      // Update the crop position to the new square size
      if (isWidthLarger) newCrop.right = imageRect.widthPx - squareSidePx - crop.left;
      else newCrop.bottom = imageRect.heightPx - squareSidePx - crop.top;

      updateWidget({ widthPx: squareSidePx, heightPx: squareSidePx, crop: newCrop, frame });

      // Prevent widget bounding box to get out of sync if the widget is resized
      return setTimeout(() => boundingBox.updateRect(), 0);
    }

    return updateWidget({ frame });
  };

  return (
    <>
      <Box
        onClick={() => toggleCropShape()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton
          mb='10px'
          size='sm'
          aria-label='Font Icon'
          icon={<ImageFrameIcon style={{ pointerEvents: 'none' }} />}
        />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Crop Shape
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleCropShape} isOpen={isCropShapeOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Select Shape</p>
              <CloseIcon onClick={toggleCropShape} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <FrameOptionMenuMobile value={value} onChange={onChangeFrame} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const FrameOptionMenuMobile = ({ value = FrameShape.None, onChange }: FrameOptionMenuProps) => {
  return (
    <Box p={2}>
      <ButtonGroup gap='8px' variant='outline' spacing='0' display='flex' flexWrap='wrap' size='sm'>
        {FRAME_SHAPE_LIST.map((frameShape) => {
          const { label, value: frameValue, icon: Icon } = frameShape;
          const isActive = value === frameValue;
          const handleClick = () => onChange(frameValue);

          return (
            <IconButton isActive={isActive} onClick={handleClick} aria-label={label} key={frameValue} icon={<Icon />} />
          );
        })}
      </ButtonGroup>
    </Box>
  );
};

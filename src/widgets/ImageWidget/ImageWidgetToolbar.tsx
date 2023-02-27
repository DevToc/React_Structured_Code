import {
  Flex,
  IconButton,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Box,
  ButtonGroup,
} from '@chakra-ui/react';

import { useWidget, useEditor } from 'widgets/sdk';
import { CROP_BUTTON_ID } from './ImageWidget.config';
import { ImageWidgetData } from './ImageWidget.types';
import { FRAME_SHAPE_LIST } from './Frame/frame.config';
import { FrameShape } from './Frame/frame.types';
import { isSquareFrame } from './Frame/frame';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import OpacityOption from './toolbar/OpacityOption';

import { ReactComponent as CropIcon } from 'assets/icons/crop.svg';
import { ReactComponent as ImageFrameIcon } from 'assets/icons/rectangle.svg';

const openButtonLabel = 'Open Crop Shape Menu';
const tooltipLabel = 'Crop Shape';

export const ImageWidgetToolbarMenu = () => {
  const { widgetId } = useWidget<ImageWidgetData>();
  const { isCropView, toggleCropView } = useEditor();
  const cropLabel = 'Crop';

  return (
    <Flex gap='8px'>
      <FrameOptionMenu />
      <Tooltip hasArrow placement='bottom' label={cropLabel} bg='black'>
        <IconButton
          id={CROP_BUTTON_ID}
          onClick={toggleCropView}
          size='sm'
          aria-label={cropLabel}
          icon={<CropIcon style={{ pointerEvents: 'none' }} />}
          isActive={isCropView}
        />
      </Tooltip>
      <OpacityOption />
      <AltTextMenu widgetId={widgetId} />
    </Flex>
  );
};

const FrameOptionMenu = () => {
  const { updateWidget, widthPx, heightPx, crop, imageRect, frame: value } = useWidget<ImageWidgetData>();
  const { boundingBox } = useEditor();

  const FrameIcon = FRAME_SHAPE_LIST.find((frameShape) => frameShape.value === value)?.icon || ImageFrameIcon;

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
    <Tooltip hasArrow placement='bottom' label={tooltipLabel} bg='black'>
      <Box>
        <Popover placement='bottom' closeOnBlur={true} closeOnEsc={true}>
          <PopoverTrigger>
            <IconButton size='sm' aria-label={openButtonLabel} icon={<FrameIcon />} />
          </PopoverTrigger>
          <PopoverContent w='170px' boxShadow='md' padding='0'>
            <PopoverArrow />
            <Box p={2}>
              <ButtonGroup gap='8px' variant='outline' spacing='0' display='flex' flexWrap='wrap' size='sm'>
                {FRAME_SHAPE_LIST.map((frameShape) => {
                  const { label, value: frameValue, icon: Icon } = frameShape;
                  const isActive = value === frameValue;
                  const onClick = () => onChangeFrame(frameValue);

                  return (
                    <IconButton
                      isActive={isActive}
                      onClick={onClick}
                      aria-label={label}
                      key={frameValue}
                      icon={<Icon />}
                    />
                  );
                })}
              </ButtonGroup>
            </Box>
          </PopoverContent>
        </Popover>
      </Box>
    </Tooltip>
  );
};

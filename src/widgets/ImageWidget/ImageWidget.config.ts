import { HANDLE } from 'constants/bounding-box';
import { Widget } from 'types/widget.types';
import { ImageWidgetData } from './ImageWidget.types';
import { isSquareFrame } from './Frame/frame';

export const BOUNDING_BOX_CONFIG = {
  customHandle: (activeWidget: Widget) => {
    const imageWidgetData = activeWidget as ImageWidgetData;
    if (isSquareFrame(imageWidgetData.frame)) return HANDLE.CORNERS;
    return HANDLE.ALL;
  },
};

export const CROP_BUTTON_ID = 'crop-button';

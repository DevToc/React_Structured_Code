import { Crop } from '../ImageWidget.types';

export interface CropData {
  crop: Crop;
  position: {
    topPx: number;
    leftPx: number;
  } | null;
}

interface ImageData {
  url: string;
  crop: Crop;
  imageWidth: number;
  imageHeight: number;
  altText?: string;
}

export interface CropHandlerProps extends ImageData {
  isCropAspectRatioLocked: boolean;
  zoom: number;
  widgetBaseRef: HTMLElement;
  onCropOpen: () => void;
  onCropClose: (args: CropData) => void;
  closeCrop: () => void;
}

export interface CropAreaBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  position: 'css';
}

export interface ImageDragBounds {
  top: number;
  left: number;
}

export interface DraggableImageProps {
  imageData: ImageData;
  cropRef: React.RefObject<CropData>;
  areaTranslate: number[];
  setCropAreaBounds: (arg: CropAreaBounds) => void;
  imageDragBounds: ImageDragBounds | undefined;
  imageMoveableRef: any;
  zoom: number;
  dragTargetRef: React.RefObject<HTMLDivElement>;
  cropImageRef: React.RefObject<HTMLImageElement>;
  widgetBaseRef: HTMLElement;
  setIsDragging: (isDragging: boolean) => void;
}

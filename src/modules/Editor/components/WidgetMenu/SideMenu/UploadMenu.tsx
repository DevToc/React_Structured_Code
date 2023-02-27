import { ReactElement, useRef, useEffect, useCallback } from 'react';
import { Flex, Button, Spinner } from '@chakra-ui/react';

import { useScript, Status } from '../../../../../hooks/useScript';
import { generateDefaultData } from '../../../../../widgets/ImageWidget/ImageWidget.helpers';
import { selectInfographWidthPx, selectInfographHeightPx } from '../../../store/infographSelector';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { addNewWidget } from '../../../store';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO } from 'utils/calculateInitialWidgetPos';

interface UploadMenuProps {
  onComplete?: () => void;
}

export const UploadMenu = ({ onComplete }: UploadMenuProps): ReactElement => {
  const status = useScript(cloudinaryScriptSrc);

  return <Flex>{status === Status.Ready ? <CloudinaryUpload /> : <Spinner />}</Flex>;
};

interface UploadWidgetI {
  open?: () => {};
  close?: () => {};
}

interface UploadResult {
  event: string;
  info: {
    url: string;
    secure_url: string;
    width: number;
    height: number;
  };
}

// Temporary cloudinary image upload
const cloudinaryScriptSrc = 'https://widget.cloudinary.com/v2.0/global/all.js';
const cloudinaryConfig = {
  cloudName: 'djuo7blrj',
  uploadPreset: 'tsdt7gsx',
  clientAllowedFormats: ['webp', 'gif', 'jpeg', 'png'],
  sources: ['local'],
  maxFileSize: 5500000,
  maxFiles: 5,
  secure: true,
};

interface CloudinaryUploadProps {
  onComplete?: () => void;
}

const CloudinaryUpload = ({ onComplete }: CloudinaryUploadProps) => {
  const uploadWidget = useRef<UploadWidgetI>();
  const dispatch = useAppDispatch();
  const infographWidthPx = useAppSelector(selectInfographWidthPx);
  const infographHeightPx = useAppSelector(selectInfographHeightPx);
  const zoom = useAppSelector(selectZoom);

  const onUploadComplete = useCallback(
    (error: Error, result: UploadResult) => {
      if (!error && result && result.event === 'success') {
        const { secure_url, width, height } = result.info;
        const imageSize = { width, height };
        const infographSize = { width: infographWidthPx, height: infographHeightPx };

        const initialTopPx = calculateInitialTopPx(zoom);
        const initialLeftPx = INITIAL_LEFTPX_RATIO * infographWidthPx;
        const widget = generateDefaultData(secure_url, imageSize, infographSize, initialTopPx, initialLeftPx);
        dispatch(addNewWidget(widget));

        uploadWidget.current?.close?.();

        if (typeof onComplete === 'function') onComplete();
      }
    },
    [dispatch, infographHeightPx, infographWidthPx, onComplete, zoom],
  );

  useEffect(() => {
    uploadWidget.current = (window as any).cloudinary.createUploadWidget(cloudinaryConfig, onUploadComplete);
  }, [onUploadComplete]);

  const onOpenUploadWidget = () => uploadWidget.current?.open?.();

  return (
    <Flex p='16px'>
      <Button size='sm' colorScheme='brand' onClick={onOpenUploadWidget}>
        Upload Photo
      </Button>
    </Flex>
  );
};

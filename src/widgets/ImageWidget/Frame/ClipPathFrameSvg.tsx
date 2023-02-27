import { memo } from 'react';
import { VisuallyHidden } from '@chakra-ui/react';
import SVG from 'react-inlinesvg';

import { createSvgClipPathFrame } from './frame';
import { FrameShape } from './frame.types';

interface ClipPathFrameSvgProps {
  frame: FrameShape;
  id: string;
}

export const ClipPathFrameSvg = memo(({ frame, id }: ClipPathFrameSvgProps) => {
  const svgEl = createSvgClipPathFrame(frame, id);

  return (
    <VisuallyHidden>
      <SVG src={svgEl.outerHTML} />
    </VisuallyHidden>
  );
});

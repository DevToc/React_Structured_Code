import { CSSProperties, useMemo } from 'react';
import styled from '@emotion/styled';
import { AccessibleElement } from 'types/widget.types';
import { useWidget } from './useWidget';

interface TransparentImgProps {
  style?: CSSProperties;
}

// 1x1px transparent png image
const TRANSPARENT_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const StyledImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;

/**
 * TRANSPARENT IMAGE COMPONENT
 *
 * Renders a transparent image with alt text if specified
 */
export const TransparentImg = ({ style = {} }: TransparentImgProps) => {
  const { widgetId, altText, isDecorative } = useWidget<AccessibleElement>();
  /**
   * For generating multiple image object in the pdf file, It adds the widget ID in the data URI.
   * It's not going to affect to the browser's img render.
   */
  const dataURL = useMemo(() => {
    return `${TRANSPARENT_DATA_URI.slice(0, 14)}:${widgetId}${TRANSPARENT_DATA_URI.slice(14)}`;
  }, [widgetId]);

  const accessibleAttributes: { alt?: string } = {};

  if (altText || isDecorative) {
    accessibleAttributes['alt'] = isDecorative ? '' : altText;
  }

  if (!accessibleAttributes?.['alt']) return <></>;

  return <StyledImg src={dataURL} style={style} {...accessibleAttributes} />;
};

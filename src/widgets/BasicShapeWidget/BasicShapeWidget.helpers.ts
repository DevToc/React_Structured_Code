import { WidgetType } from '../../types/widget.types';
import { BasicShapeType, BasicShapeWidgetData, BorderStyle } from './BasicShapeWidget.types';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_FILL_COLOR } from './BasicShapeWidget.config';
import { VERSION } from './BasicShapeWidget.upgrade';

const DEFAULT_BORDER = {
  border: {
    color: DEFAULT_FILL_COLOR,
    width: 5,
    style: BorderStyle.Solid,
  },
};

const TRANSPARENT_BORDER = {
  border: {
    color: 'black',
    width: 0,
    style: BorderStyle.Solid,
  },
};

export const generateShapeStyle = (mirror: { isVertical?: boolean; isHorizontal?: boolean }) => {
  const style = { position: 'absolute' as 'absolute' };

  const { isHorizontal, isVertical } = mirror || {};
  const scaleX = isHorizontal ? -1 : 1;
  const scaleY = isVertical ? -1 : 1;

  if (isVertical || isHorizontal) {
    return {
      ...style,
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: 'center',
    };
  }
  return style;
};

/**
 * Generate default BasicShapeWidget data
 *
 * @param type {BasicShapeType} Shape type
 * @param isBorder if TRUE, will return border-only shape data (fill = 'none', border = default border), otherwise, will return fill-only data
 * @param options [optional] can specify any other attributes to be added to the widget data
 * @returns
 */
export const generateDefaultData = (
  type: BasicShapeType,
  isBorder = false,
  options: Partial<BasicShapeWidgetData> = {},
) => {
  const border = isBorder ? DEFAULT_BORDER : TRANSPARENT_BORDER;
  const fillColor = isBorder ? 'transparent' : DEFAULT_FILL_COLOR;

  return Object.assign({
    widgetType: WidgetType.BasicShape,
    widgetData: {
      version: VERSION,
      widthPx: DEFAULT_WIDTH,
      heightPx: DEFAULT_HEIGHT,
      topPx: 0,
      leftPx: 0,
      rotateDeg: 0,
      altText: '',
      isDecorative: true,

      // BasicShapeWidget properties
      fillColor: [fillColor],
      fillPercent: 0,
      mirror: {
        isHorizontal: false,
        isVertical: false,
      },
      type,
      ...border,
      ...(options && options),
    },
  });
};

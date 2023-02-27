import { SVGProps } from 'react';
import { WidgetId } from '../../../types/idTypes';
import { BorderStyle } from '../BasicShapeWidget.types';

interface ShapeProps extends SVGProps<SVGSVGElement> {
  widthPx: number;
  heightPx: number;
  border: {
    color: string;
    style: BorderStyle;
    width: number;
  };
  widgetId: WidgetId;
  fillColor: string | string[];
  fillPercent?: number;
  cornerRadius?: number;
}

interface ResizeShape {
  widthPx: number;
  heightPx: number;
  widgetId: WidgetId;
  borderWidth: number;
}

export type { ShapeProps, ResizeShape };

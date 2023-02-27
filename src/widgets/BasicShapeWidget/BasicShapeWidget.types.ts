import { AccessibleElement, Widget } from 'types/widget.types';

export const enum BasicShapeType {
  Rectangle = 'rectangle',
  Ellipse = 'ellipse',
  SemiCircle = 'semi-circle',
  Triangle = 'triangle',
  RightTriangle = 'right-triangle',
}

export const enum BorderStyle {
  Dotted = 'dotted',
  Dashed = 'dashed',
  Solid = 'solid',
}

interface BasicShapeWidgetData extends Widget, AccessibleElement {
  type: BasicShapeType;
  border: {
    color: string;
    width: number;
    style: BorderStyle;
  };
  fillColor: string[];
  fillPercent: number;
  cornerRadius?: number;

  // generic icon data
  mirror: {
    isVertical?: boolean;
    isHorizontal?: boolean;
  };
}

interface BasicShapeLayoutProps {
  dimension: {
    width: number;
    height: number;
  };
  includeAltTextImg?: boolean;
}

interface BasicShapeToolbarMenuProps {
  // widgetId: WidgetId;
}

export type { BasicShapeWidgetData, BasicShapeLayoutProps, BasicShapeToolbarMenuProps };

import { WidgetType } from 'types/widget.types';
import { ComponentWidgetIdKeys as ComponentKeys, ResponsiveTextWidgetData } from './ResponsiveTextWidget.types';

import { generateDefaultData as generateShapeData } from 'widgets/BasicShapeWidget/BasicShapeWidget.helpers';
import { generateDefaultData as generateTextData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { VERSION } from './ResponsiveTextWidget.upgrade';
import { BasicShapeType, BasicShapeWidgetData } from 'widgets/BasicShapeWidget/BasicShapeWidget.types';
import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';

type DefaultDataOverride = {
  parentDataOverride?: Partial<ResponsiveTextWidgetData>;
  shapeDataOverride?: Partial<BasicShapeWidgetData>;
  textDataOverride?: Partial<TextWidgetData>;
};

export const generateDefaultData = ({
  parentDataOverride,
  shapeDataOverride,
  textDataOverride,
}: DefaultDataOverride) => {
  return {
    version: VERSION,
    widgetType: WidgetType.ResponsiveText,
    widgetData: {
      widthPx: 150,
      heightPx: 116.78,
      topPx: 200,
      leftPx: 200,
      rotateDeg: 0,

      componentWidgetIdMap: {},
      memberWidgetIds: [],
      version: VERSION,

      ...parentDataOverride,
    },
    groupWidgets: [
      {
        // Basic shape widget
        ...generateShapeData(BasicShapeType.Rectangle, false, shapeDataOverride),
        componentKey: ComponentKeys.BackgroundShape,
      },
      {
        // Text widget
        ...generateTextData('paragraph', 'i am a text widget in a responsive group :)', false, textDataOverride),
        componentKey: ComponentKeys.Text,
      },
    ],
    isResponsiveGroup: true,
  };
};

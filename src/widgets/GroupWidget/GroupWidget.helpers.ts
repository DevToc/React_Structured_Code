import { WidgetType } from '../../types/widget.types';
import { VERSION } from './GroupWidget.upgrade';

export const generateDefaultData = () => {
  return {
    widgetType: WidgetType.Group,
    widgetData: {
      version: VERSION,
      memberWidgetIds: [],
      rotateDeg: 0,
      topPx: 0,
      leftPx: 0,
      widthPx: 0,
      heightPx: 0,
    },
  };
};

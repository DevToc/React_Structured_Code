import { WidgetType } from 'types/widget.types';
import {
  FontStyleOption,
  FontWeightOption,
  LabelTextStyle,
  LabelTextWidgetData,
  TextDecorationOption,
} from './LabelTextWidget.types';
import { VERSION } from './LabelTextWidget.upgrade';

type DefaultDataOptions = {
  metricOptions?: Partial<LabelTextWidgetData>;
  styleOptions?: Partial<LabelTextStyle>;
};

export const generateDefaultData = (options?: DefaultDataOptions) => {
  return {
    widgetType: WidgetType.LabelText,
    widgetData: {
      version: VERSION,
      widthPx: 100,
      heightPx: 37.5,
      topPx: 0,
      leftPx: 0,
      rotateDeg: 0,

      // metric text data
      value: '50',
      suffix: '%',
      isNumeric: true,
      style: {
        fontWeight: FontWeightOption.Normal,
        fontStyle: FontStyleOption.Normal,
        textDecoration: TextDecorationOption.None,
        fontSize: 25,
        fontFamily: 'Inter',
        color: '#000',
        ...options?.styleOptions,
      },
      ...options?.metricOptions,
    },
  };
};

import { Widget } from 'types/widget.types';

export enum FontWeightOption {
  Normal = 'normal',
  Bold = 'bold',
}

export enum TextDecorationOption {
  None = 'none',
  Underline = 'underline',
}

export enum FontStyleOption {
  Normal = 'normal',
  Italic = 'italic',
}

type LabelTextStyle = {
  fontWeight: FontWeightOption;
  fontStyle: FontStyleOption;
  textDecoration: TextDecorationOption;
  fontSize: number;
  fontFamily: string;
  color: string;
};

interface LabelTextWidgetData extends Widget {
  value: string;
  suffix?: string;

  style: LabelTextStyle;
  isNumeric: boolean;

  // TEMP - boolean to determine whether the font size can be updated via toolbar
  hasFontSizeOption?: boolean;
}

export type { LabelTextWidgetData, LabelTextStyle };

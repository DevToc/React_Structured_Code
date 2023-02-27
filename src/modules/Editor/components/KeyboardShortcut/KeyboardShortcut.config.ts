import { WidgetType } from '../../../../types/widget.types';
import { Key } from '../../../../constants/keyboard';
import { KEYBOARD_CONFIG as TEXT_KEYBOARD_CONFIG } from '../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.config';
import { KEYBOARD_CONFIG as LINE_KEYBOARD_CONFIG } from '../../../../widgets/LineWidget/LineWidget.config';

export interface KeyboardOvverride {
  // exclude all global keyboard shortcuts while widget is selected
  all?: boolean;
  // exclude specific global keyboard shortcuts while widget is selected
  excludeSpecific?: Key[];
}

type WidgetShortcutConfig = {
  [key in WidgetType]?: KeyboardOvverride;
};

export const WIDGET_SHORTCUT_CONFIG: WidgetShortcutConfig = {
  [WidgetType.Text]: TEXT_KEYBOARD_CONFIG,
  [WidgetType.Line]: LINE_KEYBOARD_CONFIG,
};

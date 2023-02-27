import { WidgetType } from '../../../../types/widget.types';
import { WIDGET_SHORTCUT_CONFIG, KeyboardOvverride } from './KeyboardShortcut.config';

export const hasCustomWidgetKeyOverride = (key: number, activeWidgetType: WidgetType | undefined): boolean => {
  if (!activeWidgetType) return false;
  if (!WIDGET_SHORTCUT_CONFIG?.[activeWidgetType]) return false;

  const { all, excludeSpecific } = WIDGET_SHORTCUT_CONFIG[activeWidgetType] as KeyboardOvverride;

  if (all) return true;
  if (excludeSpecific && excludeSpecific.includes(key)) return true;

  return false;
};

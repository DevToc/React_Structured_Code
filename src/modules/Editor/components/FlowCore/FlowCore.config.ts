import { WidgetType } from 'types/widget.types';

export const MUTATION_OBSERVER_CONFIG = {
  attributes: true,
  attributeFilter: ['style'],
  childList: false,
  subtree: false,
};

export const MUTATION_OBSERVER_CONFIG_WITH_SUBTREE = {
  ...MUTATION_OBSERVER_CONFIG,
  childList: true,
  subtree: true,
  characterDataOldValue: true,
};

export const RESPONSIVE_WIDGET_LIST = [WidgetType.ResponsiveText, WidgetType.StatChart];
export const OBSERVING_SUBTREE_WIDGET_LIST = [WidgetType.Table, WidgetType.Text, ...RESPONSIVE_WIDGET_LIST];

/**
 * NodeCreatorModal config
 */
export const PADDING_PX = 30;
export const BUTTON_GRID_PX = 60;
export const BUTTON_GRID_GAP = 4;
export const BUTTON_GRID_WIDGET_PADDING_PX = 5;
export const BUTTON_GRID_WIDGET_PX = BUTTON_GRID_PX - BUTTON_GRID_WIDGET_PADDING_PX * 2;

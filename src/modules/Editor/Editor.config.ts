export interface ZoomOption {
  label: string;
  value: number;
}

export const ZOOM_OPTIONS: ZoomOption[] = [
  { label: '25%', value: 0.25 },
  { label: '40%', value: 0.4 },
  { label: '60%', value: 0.6 },
  { label: '80%', value: 0.8 },
  { label: '100%', value: 1 },
  { label: '120%', value: 1.2 },
  { label: '140%', value: 1.4 },
];

export enum IgnoreEventElement {
  INPUT = 'INPUT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
}

export enum IgnoreEventRole {
  switch = 'switch',
  slider = 'slider',
  radio = 'radio',
  range = 'range',
  tab = 'tab',
}

export const PAGE_CONTAINER_CLASSNAME = 'page-container';
export const EDITOR_TOOLBAR_ID = 'editor-toolbar-menu';
export const EDITOR_ACTIVE_PAGE_FOCUS_ID = 'editor-active-page-focus-id';

// TODO: The current export needs to be optimized for the design with many pages
// Limit it to 50 based on the metric and until we optimize the export
export const MAXIMUM_PAGE_LIMIT = 50;

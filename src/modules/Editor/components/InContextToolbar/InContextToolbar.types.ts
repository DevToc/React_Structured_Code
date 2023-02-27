import { FunctionComponent, SVGProps } from 'react';

export enum WIDGET_MENU_OPTIONS {
  NONE = '',
  TEXT = 'widget-menu-text',
  ICONS = 'widget-menu-icons',
  UPLOAD = 'widget-menu-upload',
  SMART = 'widget-menu-smart',
  SHAPES = 'widget-menu-shapes',
  CHARTS = 'widget-menu-charts',
}

export interface SidebarItem {
  label: string;
  title: string;
  id: WIDGET_MENU_OPTIONS;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface BottombarItem {
  label: string;
  title: string;
  id: WIDGET_MENU_OPTIONS;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

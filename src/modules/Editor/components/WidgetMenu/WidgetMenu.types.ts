import { FunctionComponent, SVGProps } from 'react';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';

export interface SidebarItem {
  label: string;
  title: string;
  id: WIDGET_MENU_OPTIONS;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

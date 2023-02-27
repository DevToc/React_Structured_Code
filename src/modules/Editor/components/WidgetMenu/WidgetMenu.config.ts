import { ReactComponent as TextIcon } from 'assets/icons/widgetmenu_text.svg';
import { ReactComponent as UploadIcon } from 'assets/icons/widgetmenu_uploads.svg';
// import { ReactComponent as SmartIcon } from 'assets/icons/zap.svg'; // Hide
import { ReactComponent as ShapeIcon } from 'assets/icons/widgetmenu_shapes.svg';
import { ReactComponent as IconsIcon } from 'assets/icons/widgetmenu_icons.svg';
import { ReactComponent as ChartIcon } from 'assets/icons/widgetmenu_charts.svg';
import { ReactComponent as ElementsIcon } from 'assets/icons/widgetmenu_elements.svg';

import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';

import { SidebarItem } from './WidgetMenu.types';

export const SIDEBAR_WIDTH = 80;
export const SIDEBAR_HEIGHT_MOBILE = 66;
export const SIDEMENU_WIDTH = 352;

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Text', id: WIDGET_MENU_OPTIONS.TEXT, icon: TextIcon, title: 'Text' },
  { label: 'Shapes', id: WIDGET_MENU_OPTIONS.SHAPES, icon: ShapeIcon, title: 'Shapes and Lines' },
  { label: 'Icons', id: WIDGET_MENU_OPTIONS.ICONS, icon: IconsIcon, title: 'Icon Search' },
  { label: 'Uploads', id: WIDGET_MENU_OPTIONS.UPLOAD, icon: UploadIcon, title: 'Image Uploads' },
  { label: 'Charts', id: WIDGET_MENU_OPTIONS.CHARTS, icon: ChartIcon, title: 'Charts' },
  // { label: 'Smart', id: WIDGET_MENU_OPTIONS.SMART, icon: SmartIcon, title: 'Smart' }, // Hide for now
  { label: 'Elements', id: WIDGET_MENU_OPTIONS.ELEMENTS, icon: ElementsIcon, title: 'Elements' },
];

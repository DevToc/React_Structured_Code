// TODO: [JB] Add script to create resources before building.
// Then, the resourcesToBackend plugin will create the backend using the generated resources.
import EN_APP from 'locales/en/app.json';
import ES_APP from 'locales/es/app.json';
import FR_APP from 'locales/fr/app.json';
import EN_COMMON_NAVBAR from 'modules/Editor/components/Navbar/locales/en/navbar.json';
import ES_COMMON_NAVBAR from 'modules/Editor/components/Navbar/locales/es/navbar.json';
import FR_COMMON_NAVBAR from 'modules/Editor/components/Navbar/locales/fr/navbar.json';
import EN_EDITOR_WIDGETMENU from 'modules/Editor/components/WidgetMenu/locales/en/widgetMenu.json';
import ES_EDITOR_WIDGETMENU from 'modules/Editor/components/WidgetMenu/locales/es/widgetMenu.json';
import FR_EDITOR_WIDGETMENU from 'modules/Editor/components/WidgetMenu/locales/fr/widgetMenu.json';
import EN_EDITOR_SPREADSHEET from 'modules/Editor/components/Spreadsheet/locales/en/spreadsheet.json';
import ES_EDITOR_SPREADSHEET from 'modules/Editor/components/Spreadsheet/locales/es/spreadsheet.json';
import FR_EDITOR_SPREADSHEET from 'modules/Editor/components/Spreadsheet/locales/fr/spreadsheet.json';
import EN_EDITOR_TOOLBAR from 'modules/Editor/components/Toolbar/locales/en/toolbar.json';
import ES_EDITOR_TOOLBAR from 'modules/Editor/components/Toolbar/locales/es/toolbar.json';
import FR_EDITOR_TOOLBAR from 'modules/Editor/components/Toolbar/locales/fr/toolbar.json';
import EN_EDITOR_TOOLBAR_ALTTEXTMENU from 'modules/Editor/components/Toolbar/AltTextMenu/locales/en/altTextMenu.json';
import ES_EDITOR_TOOLBAR_ALTTEXTMENU from 'modules/Editor/components/Toolbar/AltTextMenu/locales/es/altTextMenu.json';
import FR_EDITOR_TOOLBAR_ALTTEXTMENU from 'modules/Editor/components/Toolbar/AltTextMenu/locales/fr/altTextMenu.json';
import EN_EDITOR_COLOR_PICKER from 'modules/Editor/components/ColorPicker/locales/en/colorPicker.json';
import ES_EDITOR_COLOR_PICKER from 'modules/Editor/components/ColorPicker/locales/es/colorPicker.json';
import FR_EDITOR_COLOR_PICKER from 'modules/Editor/components/ColorPicker/locales/fr/colorPicker.json';
import {
  EN_EDITOR_ACCESSIBILITY_MENU,
  ES_EDITOR_ACCESSIBILITY_MENU,
  FR_EDITOR_ACCESSIBILITY_MENU,
} from 'modules/Editor/components/AccessibilityManager/locales';
import {
  EN_EDITOR_TOOLBAR_PAGE_MENU,
  ES_EDITOR_TOOLBAR_PAGE_MENU,
  FR_EDITOR_TOOLBAR_PAGE_MENU,
} from 'modules/Editor/components/Toolbar/PageMenu/locales';
import {
  EN_EDITOR_SIDE_MENU_SETTINGS,
  ES_EDITOR_SIDE_MENU_SETTINGS,
  FR_EDITOR_SIDE_MENU_SETTINGS,
} from 'modules/Editor/components/SideMenuSettings/locales';
import {
  EN_EDITOR_PAGE_MANAGER,
  ES_EDITOR_PAGE_MANAGER,
  FR_EDITOR_PAGE_MANAGER,
} from 'modules/Editor/components/PageManager/locales';
import EN_EDITOR_FLOWMODE from 'modules/Editor/components/FlowCore/locales/en/flowmode.json';
import ES_EDITOR_FLOWMODE from 'modules/Editor/components/FlowCore/locales/en/flowmode.json';
import FR_EDITOR_FLOWMODE from 'modules/Editor/components/FlowCore/locales/en/flowmode.json';
import { EN_WIDGET_TOOLBAR } from 'widgets/locales/en/widgetToolbar';
import { ES_WIDGET_TOOLBAR } from 'widgets/locales/es/widgetToolbar';
import { FR_WIDGET_TOOLBAR } from 'widgets/locales/fr/widgetToolbar';

// Map resources
export const resources = {
  en: {
    app: EN_APP,
    common_navbar: EN_COMMON_NAVBAR,
    editor_widgetmenu: EN_EDITOR_WIDGETMENU,
    editor_spreadsheet: EN_EDITOR_SPREADSHEET,
    editor_toolbar: EN_EDITOR_TOOLBAR,
    editor_widget_toolbar: EN_WIDGET_TOOLBAR,
    editor_toolbar_alt_text_menu: EN_EDITOR_TOOLBAR_ALTTEXTMENU,
    editor_toolbar_page_menu: EN_EDITOR_TOOLBAR_PAGE_MENU,
    editor_accessibility_menu: EN_EDITOR_ACCESSIBILITY_MENU,
    editor_color_picker: EN_EDITOR_COLOR_PICKER,
    editor_side_menu_settings: EN_EDITOR_SIDE_MENU_SETTINGS,
    editor_page_manager: EN_EDITOR_PAGE_MANAGER,
    editor_flowmode: EN_EDITOR_FLOWMODE,
  },
  es: {
    app: ES_APP,
    common_navbar: ES_COMMON_NAVBAR,
    editor_widgetmenu: ES_EDITOR_WIDGETMENU,
    editor_spreadsheet: ES_EDITOR_SPREADSHEET,
    editor_toolbar: ES_EDITOR_TOOLBAR,
    editor_widget_toolbar: ES_WIDGET_TOOLBAR,
    editor_toolbar_alt_text_menu: ES_EDITOR_TOOLBAR_ALTTEXTMENU,
    editor_toolbar_page_menu: ES_EDITOR_TOOLBAR_PAGE_MENU,
    editor_accessibility_menu: ES_EDITOR_ACCESSIBILITY_MENU,
    editor_color_picker: ES_EDITOR_COLOR_PICKER,
    editor_side_menu_settings: ES_EDITOR_SIDE_MENU_SETTINGS,
    editor_page_manager: ES_EDITOR_PAGE_MANAGER,
    editor_flowmode: ES_EDITOR_FLOWMODE,
  },
  fr: {
    app: FR_APP,
    common_navbar: FR_COMMON_NAVBAR,
    editor_widgetmenu: FR_EDITOR_WIDGETMENU,
    editor_spreadsheet: FR_EDITOR_SPREADSHEET,
    editor_toolbar: FR_EDITOR_TOOLBAR,
    editor_widget_toolbar: FR_WIDGET_TOOLBAR,
    editor_toolbar_alt_text_menu: FR_EDITOR_TOOLBAR_ALTTEXTMENU,
    editor_toolbar_page_menu: FR_EDITOR_TOOLBAR_PAGE_MENU,
    editor_accessibility_menu: FR_EDITOR_ACCESSIBILITY_MENU,
    editor_color_picker: FR_EDITOR_COLOR_PICKER,
    editor_side_menu_settings: FR_EDITOR_SIDE_MENU_SETTINGS,
    editor_page_manager: FR_EDITOR_PAGE_MANAGER,
    editor_flowmode: FR_EDITOR_FLOWMODE,
  },
} as const;

export default resources;

import WidgetVersionManager from './WidgetVersionManager';
import { widgetVersionConfig } from './WidgetVersionManager.config';

// initialize and register all widget controllers
// separate file to keep the WidgetVersionManager decoupled from the widget controllers
// so that it can be tested independently
const widgetVersionManager = WidgetVersionManager.getInstance();
widgetVersionManager.init(widgetVersionConfig);

export default widgetVersionManager;

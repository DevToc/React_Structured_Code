import { Widget } from 'types/widget.types';
import { ImageWidgetData } from './ImageWidget.types';

// the latest version of the widget
export const VERSION = 2;

class UpgradeV2 {
  version = 2;
  upgrade(widget: Widget) {
    const imageWidget = widget as ImageWidgetData;
    imageWidget.opacity = 1;
  }
}

// Add VersionControllers here that implement the WidgetVersionController interface
export const imageWidgetVersionControllers = [new UpgradeV2()];

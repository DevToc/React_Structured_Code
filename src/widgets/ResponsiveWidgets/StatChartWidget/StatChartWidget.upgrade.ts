import { WidgetVersionController } from 'widgets/WidgetVersionManager/WidgetVersionManager.types';
import { WidgetMap } from 'widgets/Widget.types';

// the latest version of the widget
export const VERSION = 2;

export class UpgradeV2 {
  version = 2;
  upgrade(widget: any, memberWidgets: WidgetMap) {
    switch (widget.type) {
      case 'Donut':
      case 'HalfDonut':
      case 'ProgressBar':
        const iconGridWidgetId = widget.componentWidgetIdMap.iconGrid;
        // some old widgets may not have an iconGrid
        if (iconGridWidgetId && memberWidgets[iconGridWidgetId]) memberWidgets[iconGridWidgetId].isHidden = true;
        break;
      case 'Icon':
        const chartWidgetId = widget.componentWidgetIdMap.chart;
        memberWidgets[chartWidgetId].isHidden = true;

        if (!widget.metricTextEnabled) {
          const metricTextWidgetId = widget.componentWidgetIdMap.metricText;
          memberWidgets[metricTextWidgetId].isHidden = true;
        }
    }
  }
}

// Add VersionControllers here that implement the WidgetVersionController interface
export const statChartWidgetVersionControllers: WidgetVersionController[] = [new UpgradeV2()];

import { WidgetVersionController } from 'widgets/WidgetVersionManager/WidgetVersionManager.types';

// the latest version of the widget
export const VERSION = 6;

class UpgradeV2 {
  version = 2;
  upgrade(widget: any) {
    widget.generalOptions.innerSize = 0;
    widget.generalOptions.borderWidth = Math.min(widget.generalOptions.borderWidth, 5);
  }
}

class UpgradeV3 {
  version = 3;
  upgrade(widget: any) {
    widget.generalOptions.innerSize = 0;
    widget.generalOptions.borderWidth = Math.min(widget.generalOptions.borderWidth, 5);
    widget.yAxis = {
      style: {
        lineColor: '#000000',
        lineWidth: 1,
      },
      labelStyle: {
        color: '#000',
      },
    };
    widget.xAxis = {
      style: {
        lineColor: '#000000',
        lineWidth: 1,
      },
      labelStyle: {
        color: '#000',
      },
    };
    widget.grid = {
      style: {
        lineColor: '#e6e6e6',
      },
    };
  }
}

class UpgradeV4 {
  version = 4;
  upgrade(widget: any) {
    widget.patterns = {
      enabled: false,
      list: [],
    };
  }
}

class UpgradeV5 {
  version = 5;
  upgrade(widget: any) {
    const textSettings = {
      fontSize: '12px',
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    };

    widget.yAxis.labelStyle = { ...textSettings, ...widget.yAxis.labelStyle };
    widget.xAxis.labelStyle = { ...textSettings, ...widget.xAxis.labelStyle };
    widget.legend.labelStyle = { ...textSettings, ...widget.legend.labelStyle };
    widget.dataLabels.style = { ...textSettings, ...widget.dataLabels.style };
    widget.xAxis.title = widget.xAxis.title || { text: '', style: {} };
    widget.xAxis.title.style = { ...textSettings, fontWeight: 'bold', ...widget.xAxis.title.style };
    widget.yAxis.title = widget.yAxis.title || { text: '', style: {} };
    widget.yAxis.title.style = { ...widget.xAxis.title.style };
  }
}

class UpgradeV6 {
  version = 6;
  upgrade(widget: any) {
    widget.dataLabels.enabled = true;
  }
}

// Add VersionControllers here that implement the WidgetVersionController interface
export const pieChartWidgetVersionControllers: WidgetVersionController[] = [
  new UpgradeV2(),
  new UpgradeV3(),
  new UpgradeV4(),
  new UpgradeV5(),
  new UpgradeV6(),
];

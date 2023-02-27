import { WidgetType } from '../../types/widget.types';
import { WidgetVersionConfig } from './WidgetVersionManager.types';

// widget controllers & versions
import { imageWidgetVersionControllers, VERSION as imageWidgetVersion } from '../ImageWidget/ImageWidget.upgrade';
import {
  textWidgetVersionControllers,
  VERSION as textWidgetVersion,
} from '../TextBasedWidgets/TextWidget/TextWidget.upgrade';
import {
  tableWidgetVersionControllers,
  VERSION as tableWidgetVersion,
} from '../TextBasedWidgets/TableWidget/TableWidget.upgrade';
import { iconWidgetVersionControllers, VERSION as iconWidgetVersion } from '../IconWidget/IconWidget.upgrade';
import { lineWidgetVersionControllers, VERSION as lineWidgetVersion } from '../LineWidget/LineWidget.upgrade';
import {
  basicShapeWidgetVersionControllers,
  VERSION as basicShapeWidgetVersion,
} from '../BasicShapeWidget/BasicShapeWidget.upgrade';
import {
  barChartWidgetVersionControllers,
  VERSION as barChartWidgetVersion,
} from '../ChartWidgets/BarChartWidget/BarChartWidget.upgrade';
import {
  columnChartWidgetVersionControllers,
  VERSION as columnChartWidgetVersion,
} from '../ChartWidgets/ColumnChartWidget/ColumnChartWidget.upgrade';
import {
  lineChartWidgetVersionControllers,
  VERSION as lineChartWidgetVersion,
} from '../ChartWidgets/LineChartWidget/LineChartWidget.upgrade';
import {
  pieChartWidgetVersionControllers,
  VERSION as pieChartWidgetVersion,
} from '../ChartWidgets/PieChartWidget/PieChartWidget.upgrade';
import { groupWidgetVersionControllers, VERSION as groupWidgetVersion } from '../GroupWidget/GroupWidget.upgrade';
import {
  stackedBarChartWidgetVersionControllers,
  VERSION as stackedBarChartWidgetVersion,
} from '../ChartWidgets/StackedBar/StackedBarChartWidget.upgrade';
import {
  stackedColumnChartWidgetVersionControllers,
  VERSION as stackedColumnChartWidgetVersion,
} from '../ChartWidgets/StackedColumn/StackedColumnChartWidget.upgrade';
import {
  progressChartWidgetVersionControllers,
  VERSION as progressChartWidgetVersion,
} from 'widgets/ProgressChartWidget/ProgressChartWidget.upgrade';
import {
  statChartWidgetVersionControllers,
  VERSION as statChartWigetVersion,
} from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.upgrade';
import {
  areaChartWidgetVersionControllers,
  VERSION as areaChartWidgetVersion,
} from 'widgets/ChartWidgets/Area/AreaChartWidget.upgrade';
import {
  stackedAreaChartWidgetVersionControllers,
  VERSION as stackedAreaChartWidgetVersion,
} from 'widgets/ChartWidgets/StackedArea/StackedAreaChartWidget.upgrade';
import {
  responsiveTextWidgetVersionControllers,
  VERSION as responsiveTextWidgetVersion,
} from 'widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidget.upgrade';
import {
  labelTextWidgetVersionControllers,
  VERSION as labelTextWidgetVersion,
} from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.upgrade';

export const widgetVersionConfig: WidgetVersionConfig = {
  [WidgetType.Image]: {
    controllers: imageWidgetVersionControllers,
    latestVersion: imageWidgetVersion,
  },
  [WidgetType.Text]: {
    controllers: textWidgetVersionControllers,
    latestVersion: textWidgetVersion,
  },
  [WidgetType.Table]: {
    controllers: tableWidgetVersionControllers,
    latestVersion: tableWidgetVersion,
  },
  [WidgetType.Icon]: {
    controllers: iconWidgetVersionControllers,
    latestVersion: iconWidgetVersion,
  },
  [WidgetType.Line]: {
    controllers: lineWidgetVersionControllers,
    latestVersion: lineWidgetVersion,
  },
  [WidgetType.BasicShape]: {
    controllers: basicShapeWidgetVersionControllers,
    latestVersion: basicShapeWidgetVersion,
  },
  [WidgetType.BarChart]: {
    controllers: barChartWidgetVersionControllers,
    latestVersion: barChartWidgetVersion,
  },
  [WidgetType.ColumnChart]: {
    controllers: columnChartWidgetVersionControllers,
    latestVersion: columnChartWidgetVersion,
  },
  [WidgetType.LineChart]: {
    controllers: lineChartWidgetVersionControllers,
    latestVersion: lineChartWidgetVersion,
  },
  [WidgetType.PieChart]: {
    controllers: pieChartWidgetVersionControllers,
    latestVersion: pieChartWidgetVersion,
  },
  [WidgetType.Group]: {
    controllers: groupWidgetVersionControllers,
    latestVersion: groupWidgetVersion,
  },
  [WidgetType.StackedBarChart]: {
    controllers: stackedBarChartWidgetVersionControllers,
    latestVersion: stackedBarChartWidgetVersion,
  },
  [WidgetType.StackedColumnChart]: {
    controllers: stackedColumnChartWidgetVersionControllers,
    latestVersion: stackedColumnChartWidgetVersion,
  },
  [WidgetType.ProgressChart]: {
    controllers: progressChartWidgetVersionControllers,
    latestVersion: progressChartWidgetVersion,
  },
  [WidgetType.StatChart]: {
    controllers: statChartWidgetVersionControllers,
    latestVersion: statChartWigetVersion,
  },
  [WidgetType.AreaChart]: {
    controllers: areaChartWidgetVersionControllers,
    latestVersion: areaChartWidgetVersion,
  },
  [WidgetType.StackedAreaChart]: {
    controllers: stackedAreaChartWidgetVersionControllers,
    latestVersion: stackedAreaChartWidgetVersion,
  },
  [WidgetType.ResponsiveText]: {
    controllers: responsiveTextWidgetVersionControllers,
    latestVersion: responsiveTextWidgetVersion,
  },
  [WidgetType.LabelText]: {
    controllers: labelTextWidgetVersionControllers,
    latestVersion: labelTextWidgetVersion,
  },
};

import { Dispatch, createContext, FunctionComponent } from 'react';
import { ReactComponent as TextIcon } from 'assets/icons/a11ymenu_text.svg';
import { ReactComponent as ImageIcon } from 'assets/icons/a11ymenu_image.svg';
import { ReactComponent as ShapeIcon } from 'assets/icons/a11ymenu_shape.svg';
import { ReactComponent as IconsIcon } from 'assets/icons/a11ymenu_icon.svg';
import { ReactComponent as LineIcon } from 'assets/icons/a11ymenu_line.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/a11ymenu_arrow.svg';
import { ReactComponent as AreaChartIcon } from 'assets/icons/a11ymenu_area_chart.svg';
import { ReactComponent as BarChartIcon } from 'assets/icons/a11ymenu_bar_chart.svg';
import { ReactComponent as ColumnChartIcon } from 'assets/icons/a11ymenu_column_chart.svg';
import { ReactComponent as LineChartIcon } from 'assets/icons/a11ymenu_line_chart.svg';
import { ReactComponent as StackedBarChartIcon } from 'assets/icons/a11ymenu_stackedbar_chart.svg';
import { ReactComponent as StackedColumnChartIcon } from 'assets/icons/a11ymenu_stackedcolumn_chart.svg';
import { ReactComponent as PieChartIcon } from 'assets/icons/a11ymenu_pie_chart.svg';
import { ReactComponent as TableIcon } from 'assets/icons/a11ymenu_table.svg';
import { ReactComponent as StatDonutIcon } from 'assets/icons/a11ymenu_statdonut.svg';
import { ReactComponent as StatHalfDonutIcon } from 'assets/icons/a11ymenu_stathalfdonut.svg';
import { ReactComponent as StatProgressBarIcon } from 'assets/icons/a11ymenu_statbar.svg';
import { ReactComponent as StatIconIcon } from 'assets/icons/a11ymenu_staticon.svg';
import { WidgetType } from 'types/widget.types';
import { AccessibilitySettingsState, CheckerActions } from './AccessibilityManager.types';
import { StatChartType } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.types';

const PAGE_ITEM_TESTID_PREFIX = 'ally-menu-page-item';
const WIDGET_ITEM_TESTID_PREFIX = 'ally-menu-widget-item';

const DEFAULT_LABEL = 'Missing alt text';

const ACCESSIBILITY_MENU_WIDTH = 384;
const TABLIST_HEADER_HEIGHT = 48;
const CHECKER_HEADER_HEIGHT = 48;

enum LineWidgetArrowType {
  arrow = 'arrow',
}

type WidgetIconMap = {
  [index in WidgetType | LineWidgetArrowType | StatChartType]: FunctionComponent;
};

const WIDGET_ICON_MAP: Partial<WidgetIconMap> = {
  [WidgetType.BasicShape]: ShapeIcon,
  [WidgetType.Icon]: IconsIcon,
  [WidgetType.Text]: TextIcon,
  [WidgetType.Image]: ImageIcon,
  [WidgetType.Line]: LineIcon,
  [LineWidgetArrowType.arrow]: ArrowIcon,
  [WidgetType.Table]: TableIcon,
  [WidgetType.PieChart]: PieChartIcon,
  [WidgetType.LineChart]: LineChartIcon,
  [WidgetType.ColumnChart]: ColumnChartIcon,
  [WidgetType.BarChart]: BarChartIcon,
  [WidgetType.StackedBarChart]: StackedBarChartIcon,
  [WidgetType.StackedColumnChart]: StackedColumnChartIcon,
  [WidgetType.AreaChart]: AreaChartIcon,
  [WidgetType.StackedAreaChart]: AreaChartIcon,
  [WidgetType.ResponsiveText]: TextIcon,
  [StatChartType.Donut]: StatDonutIcon,
  [StatChartType.HalfDonut]: StatHalfDonutIcon,
  [StatChartType.ProgressBar]: StatProgressBarIcon,
  [StatChartType.Icon]: StatIconIcon,
};

const initAccessibilitySettingsState = {
  showChecker: false,
  isInProgress: false,
  checkers: {
    documentLanguage: {
      isMarkAsResolved: false,
      requireManualCheck: true,
    },
    documentTitle: {
      isMarkAsResolved: false,
      requireManualCheck: true,
    },
    alternativeText: {
      isMarkAsResolved: false,
      requireManualCheck: true,
      invalidWidgets: [],
    },
    imageTexts: {
      isMarkAsResolved: false,
      requireManualCheck: true,
    },
    logicalReadingOrder: {
      isMarkAsResolved: false,
      requireManualCheck: true,
    },
    headings: {
      isMarkAsResolved: false,
      requireManualCheck: true,
    },
    colorContrast: {
      isMarkAsResolved: false,
      requireManualCheck: false,
    },
    useOfColor: {
      isMarkAsResolved: false,
      requireManualCheck: true,
    },
    links: {
      isMarkAsResolved: false,
      requireManualCheck: false,
      invalidWidgets: [],
    },
    tables: {
      isMarkAsResolved: false,
      requireManualCheck: false,
    },
    textSize: {
      isMarkAsResolved: false,
      requireManualCheck: false,
      invalidWidgets: [],
    },
  },
};

const AccessibilitySettingsContext = createContext<{
  state: AccessibilitySettingsState;
  dispatch: Dispatch<CheckerActions>;
}>({ state: initAccessibilitySettingsState, dispatch: () => undefined });

export type { WidgetIconMap };
export {
  LineWidgetArrowType,
  initAccessibilitySettingsState,
  AccessibilitySettingsContext,
  ACCESSIBILITY_MENU_WIDTH,
  TABLIST_HEADER_HEIGHT,
  CHECKER_HEADER_HEIGHT,
  DEFAULT_LABEL,
  WIDGET_ICON_MAP,
  PAGE_ITEM_TESTID_PREFIX,
  WIDGET_ITEM_TESTID_PREFIX,
};

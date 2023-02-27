import { WidgetType } from 'types/widget.types';
import Highcharts, { DashStyleValue } from 'highcharts';

export type HighChartsWidgetTypes =
  | WidgetType.PieChart
  | WidgetType.LineChart
  | WidgetType.ColumnChart
  | WidgetType.BarChart
  | WidgetType.StackedColumnChart
  | WidgetType.StackedBarChart
  | WidgetType.AreaChart
  | WidgetType.StackedAreaChart;

export interface HighchartsOptions extends Highcharts.Options {
  keyCustom?: number;
}

export const ALLOWED_PATTERN_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;
export const ENABLED_PATTERN_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 14] as const;

export type PATTERN_ID = typeof ALLOWED_PATTERN_IDS[number];

export const ALLOWED_DASH_TYPES = [
  'ShortDash',
  'ShortDot',
  'ShortDashDot',
  'ShortDashDotDot',
  'Dot',
  'Dash',
  'LongDash',
  'DashDot',
  'LongDashDot',
  'LongDashDotDot',
] as const;

type DataTableChartWidgetPatternList = {
  [key in PATTERN_ID]?: DataTableChartWidgetPattern;
};

export interface DataTableChartWidgetPattern {
  highchartsDefaultPatternIndex?: number;
  invertColors?: boolean; // Some patterns want to apply white to the pattern itself and the color as the background.
  path?: {
    d: string;
    strokeWidth?: number;
  };
  transform?: string;
  width?: number;
  height?: number;
  opacity?: number;
  dashStyle?: DashStyleValue;
}

export const BACKUP_PATTERN = {
  // Highcharts Default Pattern No. 0
  path: {
    d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
    strokeWidth: 2,
  },
  transform: 'scale(1.4 1.4)',
  width: 5,
  height: 5,
  dashStyle: ALLOWED_DASH_TYPES[0],
  invertColors: true,
};

export const PATTERNS: DataTableChartWidgetPatternList = {
  0: {
    // Highcharts Default Pattern No. 0
    path: {
      d: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
      strokeWidth: 2,
    },
    transform: 'scale(1.4 1.4)',
    width: 5,
    height: 5,
    dashStyle: ALLOWED_DASH_TYPES[0],
    invertColors: true,
  },
  1: {
    // Highcharts Default Pattern No. 1
    path: {
      d: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
    },
    transform: 'scale(1.4 1.4)',
    width: 5,
    height: 5,
    dashStyle: ALLOWED_DASH_TYPES[1],
    invertColors: true,
  },
  2: {
    // Highcharts Default Pattern No. 2
    path: {
      d: 'M 2 0 L 2 5 M 4 0 L 4 5',
    },
    transform: 'scale(1.4 1.4)',
    width: 5,
    height: 5,
    dashStyle: ALLOWED_DASH_TYPES[2],
    invertColors: true,
  },
  3: {
    // Highcharts Default Pattern No. 3
    path: {
      d: 'M 0 2 L 5 2 M 0 4 L 5 4',
    },
    transform: 'scale(1.4 1.4)',
    width: 5,
    height: 5,
    dashStyle: ALLOWED_DASH_TYPES[3],
    invertColors: true,
  },
  4: {
    // Highcharts Default Pattern No. 4
    path: {
      d: 'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5',
      strokeWidth: 2,
    },
    width: 5,
    height: 5,
    transform: 'scale(1.4 1.4)',
    dashStyle: ALLOWED_DASH_TYPES[4],
    invertColors: true,
  },
  5: {
    // Highcharts Default Pattern No. 5
    path: {
      d: 'M 0 0 L 5 10 L 10 0',
    },
    transform: 'scale(1.4 1.4)',
    width: 10,
    height: 10,
    dashStyle: ALLOWED_DASH_TYPES[5],
    invertColors: true,
  },
  6: {
    // Highcharts Default Pattern No. 6
    path: {
      d: 'M 3 3 L 8 3 L 8 8 L 3 8 Z',
    },
    width: 10,
    height: 10,
    dashStyle: ALLOWED_DASH_TYPES[6],
    invertColors: true,
  },
  7: {
    // Highcharts Default Pattern No. 7
    path: {
      d: 'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0',
    },
    width: 10,
    height: 10,
    dashStyle: ALLOWED_DASH_TYPES[7],
    invertColors: true,
  },
  8: {
    // Highcharts Default Pattern No. 8
    path: {
      d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
    },
    width: 10,
    height: 10,
    dashStyle: ALLOWED_DASH_TYPES[8],
    invertColors: true,
  },
  9: {
    // Highcharts Default Pattern No. 9
    path: {
      d: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
    },
    width: 10,
    height: 10,
    dashStyle: ALLOWED_DASH_TYPES[9],
    invertColors: true,
  },
  // Custom
  10: {
    // Crosses
    invertColors: true,
    path: {
      d: 'M0,19.3l1.42-1.42.7.7L.7,20H0ZM0,.7,1.42,2.12l.7-.72L.7,0H0ZM19.3,20l-1.42-1.42.7-.7L20,19.3V20ZM20,.7,18.58,2.12l-.7-.7L19.3,0H20ZM10,9.28l1.42-1.4.72.7L10.72,10l1.42,1.42-.72.72L10,10.72,8.58,12.14l-.72-.72L9.28,10,7.86,8.58l.72-.72Z',
      strokeWidth: 1,
    },
    opacity: 0.5,
    width: 20,
    height: 20,
    dashStyle: ALLOWED_DASH_TYPES[0],
  },
  11: {
    // Clouds
    path: {
      d: 'M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z',
      strokeWidth: 2,
    },
    transform: 'scale(0.7 0.7)',
    opacity: 0.5,
    invertColors: true,
    width: 56,
    height: 28,
    dashStyle: ALLOWED_DASH_TYPES[1],
  },
  12: {
    // Bathroom floor
    invertColors: true,
    path: {
      d: 'M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z',
      strokeWidth: 1,
    },
    opacity: 0.25,
    transform: 'scale(0.3 0.3)',
    width: 80,
    height: 80,
    dashStyle: ALLOWED_DASH_TYPES[2],
  },
  13: {
    // Falling triangles
    invertColors: true,
    path: {
      d: 'M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z',
      strokeWidth: 1,
    },
    transform: 'scale(0.5 0.5)',
    opacity: 0.5,
    width: 36,
    height: 72,
    dashStyle: ALLOWED_DASH_TYPES[3],
  },
  14: {
    // Morphing diamonds
    invertColors: true,
    path: {
      d: 'M54.627417,1.33226763e-15 L55.4558441,0.828427125 L54.0416306,2.24264069 L51.7989899,-1.44328993e-15 L54.627417,7.10542736e-15 L54.627417,1.33226763e-15 Z M5.372583,-5.55111512e-16 L4.54415588,0.828427125 L5.95836944,2.24264069 L8.20101013,-1.44328993e-15 L5.372583,-7.77156117e-16 L5.372583,-5.55111512e-16 Z M48.9705627,6.32827124e-15 L52.627417,3.65685425 L51.2132034,5.07106781 L46.1421356,-1.44328993e-15 L48.9705627,5.21804822e-15 L48.9705627,6.32827124e-15 Z M11.0294373,-1.44328993e-15 L7.372583,3.65685425 L8.78679656,5.07106781 L13.8578644,1.22124533e-15 L11.0294373,-3.33066907e-16 L11.0294373,-1.44328993e-15 Z M43.3137085,2.10942375e-15 L49.7989899,6.48528137 L48.3847763,7.89949494 L40.4852814,2.10942375e-15 L43.3137085,-1.44328993e-15 L43.3137085,2.10942375e-15 Z M16.6862915,3.33066907e-16 L10.2010101,6.48528137 L11.6152237,7.89949494 L19.5147186,-3.33066907e-16 L16.6862915,-1.44328993e-15 L16.6862915,3.33066907e-16 Z M37.6568542,2.55351296e-15 L46.9705627,9.3137085 L45.5563492,10.7279221 L34.8284271,-5.55111512e-16 L37.6568542,-1.44328993e-15 L37.6568542,2.55351296e-15 Z M22.3431458,5.55111512e-16 L13.0294373,9.3137085 L14.4436508,10.7279221 L25.1715729,-1.11022302e-16 L22.3431458,-1.44328993e-15 L22.3431458,5.55111512e-16 Z M32,-3.33066907e-16 L44.1421356,12.1421356 L42.7279221,13.5563492 L30,0.828427125 L17.2720779,13.5563492 L15.8578644,12.1421356 L28,-3.33066907e-16 L32,-1.44328993e-15 L32,-3.33066907e-16 Z M0.284271247,-1.44328993e-15 L28.2842712,28 L26.8700577,29.4142136 L-2.15508222e-16,2.54415588 L-2.15508222e-16,4.71844785e-16 L0.284271247,4.71844785e-16 L0.284271247,-1.44328993e-15 Z M1.80408836e-15,5.372583 L25.4558441,30.8284271 L24.0416306,32.2426407 L3.33720546e-15,8.20101013 L-2.15508222e-16,5.372583 L1.80408836e-15,5.372583 Z M-2.15508222e-16,11.0294373 L22.627417,33.6568542 L21.2132034,35.0710678 L4.80878765e-15,13.8578644 L1.25607397e-15,11.0294373 L-2.15508222e-16,11.0294373 Z M-2.15508222e-16,16.6862915 L19.7989899,36.4852814 L18.3847763,37.8994949 L7.73346434e-15,19.5147186 L6.28036983e-16,16.6862915 L-2.15508222e-16,16.6862915 Z M1.66860273e-15,22.3431458 L16.9705627,39.3137085 L15.5563492,40.7279221 L-2.15508222e-16,25.1715729 L-2.15508222e-16,22.3431458 L1.66860273e-15,22.3431458 Z M-2.15508222e-16,28 L14.1421356,42.1421356 L12.7279221,43.5563492 L-2.15508222e-16,30.8284271 L-2.15508222e-16,28 L-2.15508222e-16,28 Z M-2.15508222e-16,33.6568542 L11.3137085,44.9705627 L9.89949494,46.3847763 L5.20282872e-16,36.4852814 L5.20282872e-16,33.6568542 L-2.15508222e-16,33.6568542 Z M-2.15508222e-16,39.3137085 L8.48528137,47.7989899 L7.07106781,49.2132034 L3.55271368e-15,42.1421356 L3.55271368e-15,39.3137085 L-2.15508222e-16,39.3137085 Z M-2.15508222e-16,44.9705627 L5.65685425,50.627417 L4.24264069,52.0416306 L3.55271368e-15,47.7989899 L2.66453526e-15,44.9705627 L-2.15508222e-16,44.9705627 Z M-2.15508222e-16,50.627417 L2.82842712,53.4558441 L1.41421356,54.8700577 L2.48058749e-15,53.4558441 L2.48058749e-15,50.627417 L-2.15508222e-16,50.627417 Z M54.627417,60 L30,35.372583 L5.372583,60 L8.20101013,60 L30,38.2010101 L51.7989899,60 L54.627417,60 L54.627417,60 Z M48.9705627,60 L30,41.0294373 L11.0294373,60 L13.8578644,60 L30,43.8578644 L46.1421356,60 L48.9705627,60 L48.9705627,60 Z M43.3137085,60 L30,46.6862915 L16.6862915,60 L19.5147186,60 L30,49.5147186 L40.4852814,60 L43.3137085,60 L43.3137085,60 Z M37.6568542,60 L30,52.3431458 L22.3431458,60 L25.1715729,60 L30,55.1715729 L34.8284271,60 L37.6568542,60 L37.6568542,60 Z M32,60 L30,58 L28,60 L32,60 L32,60 Z M59.7157288,3.33066907e-16 L31.7157288,28 L33.1299423,29.4142136 L60,2.54415588 L60,-1.44328993e-15 L59.7157288,-1.44328993e-15 L59.7157288,3.33066907e-16 Z M60,5.372583 L34.5441559,30.8284271 L35.9583694,32.2426407 L60,8.20101013 L60,5.372583 L60,5.372583 Z M60,11.0294373 L37.372583,33.6568542 L38.7867966,35.0710678 L60,13.8578644 L60,11.0294373 L60,11.0294373 Z M60,16.6862915 L40.2010101,36.4852814 L41.6152237,37.8994949 L60,19.5147186 L60,16.6862915 L60,16.6862915 Z M60,22.3431458 L43.0294373,39.3137085 L44.4436508,40.7279221 L60,25.1715729 L60,22.3431458 L60,22.3431458 Z M60,28 L45.8578644,42.1421356 L47.2720779,43.5563492 L60,30.8284271 L60,28 L60,28 Z M60,33.6568542 L48.6862915,44.9705627 L50.1005051,46.3847763 L60,36.4852814 L60,33.6568542 L60,33.6568542 Z M60,39.3137085 L51.5147186,47.7989899 L52.9289322,49.2132034 L60,42.1421356 L60,39.3137085 L60,39.3137085 Z M60,44.9705627 L54.3431458,50.627417 L55.7573593,52.0416306 L60,47.7989899 L60,44.9705627 L60,44.9705627 Z M60,50.627417 L57.1715729,53.4558441 L58.5857864,54.8700577 L60,53.4558441 L60,50.627417 L60,50.627417 Z M39.8994949,16.3847763 L41.3137085,14.9705627 L30,3.65685425 L18.6862915,14.9705627 L20.1005051,16.3847763 L30,6.48528137 L39.8994949,16.3847763 L39.8994949,16.3847763 Z M37.0710678,19.2132034 L38.4852814,17.7989899 L30,9.3137085 L21.5147186,17.7989899 L22.9289322,19.2132034 L30,12.1421356 L37.0710678,19.2132034 L37.0710678,19.2132034 Z M34.2426407,22.0416306 L35.6568542,20.627417 L30,14.9705627 L24.3431458,20.627417 L25.7573593,22.0416306 L30,17.7989899 L34.2426407,22.0416306 L34.2426407,22.0416306 Z M31.4142136,24.8700577 L32.8284271,23.4558441 L30,20.627417 L27.1715729,23.4558441 L28.5857864,24.8700577 L30,23.4558441 L31.4142136,24.8700577 L31.4142136,24.8700577 Z M56.8700577,59.4142136 L58.2842712,58 L30,29.7157288 L1.71572875,58 L3.12994231,59.4142136 L30,32.5441559 L56.8700577,59.4142136 L56.8700577,59.4142136 Z',
      strokeWidth: 1,
    },
    transform: 'scale(2 2)',
    opacity: 0.5,
    width: 60,
    height: 60,
    dashStyle: ALLOWED_DASH_TYPES[3],
  },
  15: {
    // Overlapping diamonds
    invertColors: true,
    path: {
      d: 'M48,28 L48,24 L36,12 L24,24 L12,12 L0,24 L0,28 L0,28 L4,32 L0,36 L0,40 L12,52 L24,40 L36,52 L48,40 L48,36 L44,32 L48,28 L48,28 Z M8,32 L2,26 L12,16 L22,26 L16,32 L22,38 L12,48 L2,38 L8,32 L8,32 L8,32 L8,32 L8,32 L8,32 Z M20,32 L24,28 L28,32 L24,36 L20,32 L20,32 L20,32 L20,32 L20,32 L20,32 Z M32,32 L26,26 L36,16 L46,26 L40,32 L46,38 L36,48 L26,38 L32,32 L32,32 L32,32 L32,32 L32,32 L32,32 Z M0,16 L10,6 L4,0 L8,0 L12,4 L16,0 L20,0 L14,6 L24,16 L34,6 L28,0 L32,0 L36,4 L40,0 L44,0 L38,6 L48,16 L48,20 L36,8 L24,20 L12,8 L0,20 L0,16 L0,16 L0,16 L0,16 L0,16 L0,16 Z M0,48 L10,58 L4,64 L8,64 L12,60 L16,64 L20,64 L14,58 L24,48 L34,58 L28,64 L32,64 L36,60 L40,64 L44,64 L38,58 L48,48 L48,44 L36,56 L24,44 L12,56 L0,44 L0,48 L0,48 L0,48 L0,48 L0,48 L0,48 Z',
      strokeWidth: 1,
    },
    opacity: 0.35,
    width: 48,
    height: 64,
    dashStyle: ALLOWED_DASH_TYPES[4],
  },
  16: {
    // Rain
    invertColors: true,
    path: {
      d: 'M4,0.990777969 C4,0.443586406 4.44386482,0 5,0 C5.55228475,0 6,0.45097518 6,0.990777969 L6,5.00922203 C6,5.55641359 5.55613518,6 5,6 C4.44771525,6 4,5.54902482 4,5.00922203 L4,0.990777969 Z M10,8.99077797 C10,8.44358641 10.4438648,8 11,8 C11.5522847,8 12,8.45097518 12,8.99077797 L12,13.009222 C12,13.5564136 11.5561352,14 11,14 C10.4477153,14 10,13.5490248 10,13.009222 L10,8.99077797 Z',
      strokeWidth: 1,
    },
    opacity: 0.25,
    width: 12,
    height: 16,
    dashStyle: ALLOWED_DASH_TYPES[5],
  },
  17: {
    // Squares
    invertColors: true,
    path: {
      d: 'M6 18h12V6H6v12zM4 4h16v16H4V4z',
      strokeWidth: 1,
    },
    transform: 'scale(0.5 0.5)',
    opacity: 0.3,
    width: 32,
    height: 32,
    dashStyle: ALLOWED_DASH_TYPES[6],
  },
  18: {
    // Texture
    invertColors: true,
    path: {
      d: 'M1 3h1v1H1V3zm2-2h1v1H3V1z',
      strokeWidth: 1,
    },
    transform: 'scale(3 3)',
    opacity: 0.25,
    width: 4,
    height: 4,
    dashStyle: ALLOWED_DASH_TYPES[7],
  },
  19: {
    // Wiggle
    invertColors: true,
    path: {
      d: 'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z',
      strokeWidth: 1,
    },
    opacity: 0.4,
    width: 52,
    height: 26,
    dashStyle: ALLOWED_DASH_TYPES[8],
  },
  20: {
    // Zig zag
    invertColors: true,
    path: {
      d: 'M2.84217094e-14,6.17157288 L6.17157288,0 L11.8284271,0 L0,11.8284271 L2.84217094e-14,6.17157288 L2.84217094e-14,6.17157288 Z M40,11.8284271 L28.1715729,0 L33.8284271,3.55271368e-15 L40,6.17157288 L40,11.8284271 L40,11.8284271 Z M6.17157288,12 L18.1715729,0 L21.8284271,0 L33.8284271,12 L28.1715729,12 L20,3.82842712 L11.8284271,12 L6.17157288,12 L6.17157288,12 Z M18.1715729,12 L20,10.1715729 L21.8284271,12 L18.1715729,12 L18.1715729,12 Z',
      strokeWidth: 1,
    },
    opacity: 0.3,
    width: 40,
    height: 12,
    dashStyle: ALLOWED_DASH_TYPES[9],
  },
};

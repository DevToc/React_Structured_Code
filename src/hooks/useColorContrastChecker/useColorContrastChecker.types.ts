import { Colord, RgbColor, RgbaColor } from 'colord';

type Rect = {
  xPx: number;
  yPx: number;
  widthPx: number;
  heightPx: number;
};

type Config = {
  pageId: string;
  widgetId: string;
  targetPage: HTMLDivElement | null;
  targetColor: string;
  targetRect: Rect;
  targetFontSize?: number;
  targetFontWeight?: string;
  pageWidthPx: number;
  pageHeightPx: number;
  enabledFilter?: boolean;
  enabledTextFilter?: boolean;
};

type CalculateScore = () => void;

type SetOptions = (arg: Config) => void;

type ResetScore = () => void;

type ScoreType = {
  score: string;
  accuracy: number;
  widgetId: string;
  pageId: string;
  ratio: number;
};

type Ratio = {
  hex: string;
  ratio: number;
  rgb: RgbColor | RgbaColor;
};

type Score = {
  hex: string;
  ratio: number;
  score: string;
  accuracy?: number;
};

type Options = {
  pageId: string;
  widgetId: string;
  targetPageRef: HTMLDivElement | null;
  color: Colord;
  rect: Rect;
  fontSize: number | null;
  fontWeight: string | null;
  pageWidthPx: number;
  pageHeightPx: number;
  enabledFilter?: boolean;
  enabledTextFilter?: boolean;
};

type UseColorContrastCheckerProps = [ScoreType[], CalculateScore, SetOptions, ResetScore];

type ResultScore = {
  pageId: string;
  widgetId: string;
  score: string;
  ratio: number;
  accuracy: number;
};

export type {
  Rect,
  Config,
  CalculateScore,
  SetOptions,
  ScoreType,
  ResetScore,
  Options,
  UseColorContrastCheckerProps,
  ResultScore,
  Ratio,
  Score,
};

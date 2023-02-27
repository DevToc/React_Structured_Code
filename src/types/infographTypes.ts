import { InfographId, PageId, WidgetId } from './idTypes';
import { Page } from './pageTypes';
import { Widget } from './widget.types';
import { AllWidgetData } from '../widgets/Widget.types';
import { PaperType } from './paper.types';
import type { Color } from './basic.types';

// Using iso639-1 code to be compatible with PDF exports
// Reference: https://www.w3.org/TR/WCAG20-TECHS/PDF16.html
type Language = {
  iso639_1_Code: string;
  displayName: string;
};

type PageSize = {
  widthPx: number;
  heightPx: number;
  paperType: PaperType;
};

type PagesMap = {
  [index: PageId]: Page;
};

type WidgetsMap = {
  [index: WidgetId]: Widget | AllWidgetData;
};

type PageToWidgetsMap = {
  [index: PageId]: { widgetId: WidgetId; widgetData: Widget | AllWidgetData }[];
};

interface InfographState {
  id: InfographId;
  title: string;
  size: PageSize;
  language: Language;
  colorSwatch: Color[];
  pageOrder: PageId[];
  pages: PagesMap;
  widgets: WidgetsMap;
}

export type { InfographState, PageSize, WidgetsMap, PagesMap, Language, PageToWidgetsMap, Color };

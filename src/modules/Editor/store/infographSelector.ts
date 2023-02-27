import { createSelector } from '@reduxjs/toolkit';

import { InfographState, Language, PageSize, PageToWidgetsMap, Color } from 'types/infographTypes';
import { PageId, WidgetId } from 'types/idTypes';
import { AccessibleElement, Widget } from 'types/widget.types';
import { TreeNode } from 'types/structuredContentTypes';

import { findFontsInPage } from './infographSlice.helpers';
import { RootState } from './store';
import { getLeafNodes } from '../components/AccessibilityManager/AccessibilityManager.helpers';
import { getPageWidgetIds } from 'widgets/Widget.helpers';
import { MAXIMUM_PAGE_LIMIT } from '../Editor.config';
import { AllWidgetData } from 'widgets/Widget.types';

const selectInfographId = (state: RootState) => state.infograph.id;
const selectInfograph = (state: RootState): InfographState => state.infograph;
const selectPageOrder = (state: RootState): PageId[] => state.infograph.pageOrder;
const selectPage = (pageId: PageId) => (state: RootState) => state.infograph.pages[pageId];
const selectWidget = (widgetId: WidgetId) => (state: RootState) => state.infograph.widgets[widgetId];
const selectIsWidgetLocked = (widgetId: WidgetId) => (state: RootState) => state.infograph.widgets[widgetId]?.isLocked;
const selectAltText = (widgetId: WidgetId) => (state: RootState) =>
  (state.infograph.widgets[widgetId] as AccessibleElement)?.altText;
const selectIsDecorative = (widgetId: WidgetId) => (state: RootState) =>
  (state.infograph.widgets[widgetId] as AccessibleElement)?.isDecorative;
const selectWidgets = (state: RootState) => state.infograph.widgets;
const selectInfographWidthPx = (state: RootState): number => state.infograph.size.widthPx;
const selectInfographHeightPx = (state: RootState): number => state.infograph.size.heightPx;
const selectInfographSize = (state: RootState): PageSize => state.infograph.size;
const selectInfographTitle = (state: RootState): string => state.infograph.title;
const selectLanguage = (state: RootState): Language => state.infograph.language;
const selectColorSwatch = (state: RootState): Color[] => state.infograph.colorSwatch;
const selectHasReachedPageLimit = (state: RootState): boolean => state.infograph.pageOrder.length >= MAXIMUM_PAGE_LIMIT;
const selectWidgetProperty =
  <WidgetData extends AllWidgetData & Widget, Key extends keyof WidgetData>(widgetId: WidgetId, property: Key) =>
  (state: RootState): WidgetData[Key] | undefined =>
    (state.infograph.widgets[widgetId] as WidgetData)?.[property];

const selectPageToWidgetMap = createSelector(selectInfograph, (state: InfographState) => {
  const pageToWidgetMap: PageToWidgetsMap = {};
  const pages = state.pages;
  const pageOrder = state.pageOrder;

  for (const pageId of pageOrder) {
    const page = pages[pageId];
    const allPageWidgetIds = getPageWidgetIds(page, state.widgets);

    if (allPageWidgetIds && allPageWidgetIds.length > 0) {
      pageToWidgetMap[pageId] = allPageWidgetIds.map((widgetId) => ({
        widgetId,
        widgetData: state.widgets[widgetId],
      }));
    }
  }

  return pageToWidgetMap;
});

/**
 * Select a pageId to widget data map - widgets are ordered by reading order
 * using the accessibility tree.
 */
const selectPageToWidgetMapByReadingOrder = createSelector(selectInfograph, (state: InfographState) => {
  const pageToWidgetMap: PageToWidgetsMap = {};
  const pages = state.pages;
  const pageOrder = state.pageOrder;
  const widgets = state.widgets;

  for (const pageId of pageOrder) {
    const { widgetStructureTree } = pages[pageId];
    const widgetIds = widgetStructureTree ? getLeafNodes(widgetStructureTree as TreeNode) : [];

    if (widgetIds && widgetIds.length > 0) {
      pageToWidgetMap[pageId] = widgetIds.map((widgetId) => ({
        widgetId,
        widgetData: widgets[widgetId],
      }));
    }
  }

  return pageToWidgetMap;
});

const selectPageBackground =
  (pageId: PageId) =>
  (state: RootState): string => {
    if (pageId && state.infograph.pages[pageId]) return state.infograph.pages[pageId].background;
    return '';
  };

const selectPageFonts = (pageId: PageId) =>
  // TODO: See if we can do findFonts somewhere else
  createSelector(selectInfograph, (infograph: InfographState): string[] => {
    return findFontsInPage(infograph, pageId);
  });

const selectPageStructureTree =
  (pageId: PageId) =>
  (state: RootState): TreeNode | undefined => {
    if (pageId && state.infograph.pages[pageId]) return state.infograph.pages[pageId].widgetStructureTree as TreeNode;
  };

export {
  selectInfographId,
  selectInfograph,
  selectPageOrder,
  selectPage,
  selectWidget,
  selectWidgets,
  selectIsWidgetLocked,
  selectAltText,
  selectIsDecorative,
  selectInfographWidthPx,
  selectInfographHeightPx,
  selectInfographSize,
  selectInfographTitle,
  selectPageBackground,
  selectPageFonts,
  selectLanguage,
  selectPageStructureTree,
  selectPageToWidgetMap,
  selectColorSwatch,
  selectPageToWidgetMapByReadingOrder,
  selectHasReachedPageLimit,
  selectWidgetProperty,
};

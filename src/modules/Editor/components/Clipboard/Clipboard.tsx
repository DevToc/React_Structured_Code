import { useState, useEffect, useCallback } from 'react';

import { useEventListener } from '../../../../hooks/useEventListener';
import { selectWidgets, selectPage } from '../../store/infographSelector';
import { addToWidgetClipboard } from '../../store/widgetControlSlice';
import {
  selectActiveWidgetIds,
  selectHasActiveWidget,
  selectWidgetClipboard,
  selectActiveWidgets,
} from '../../store/widgetSelector';
import { addToPageClipboard } from '../../store/pageControlSlice';
import { selectActivePage, selectPageClipboard } from '../../store/pageSelector';
import { selectIsSlideView, selectHasKeyboardIgnore } from '../../store/selectEditorSettings';
import { addNewWidget, useAppDispatch, useAppSelector, duplicatePage } from '../../store';
import { generateDefaultData as defaultTextData } from '../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { generateDefaultData as defaultTableData } from '../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.helpers';
import { clearBrowserClipboard, createCopyWidgets, parseCopyWidgets, createCopyPage } from './Clipboard.helpers';
import { shouldIgnoreEventTarget } from '../../Editor.helpers';

// handles global clipboard events in the editor for copying and pasting widgets / text / files / links...
export const Clipboard = () => {
  const [hasPastedWidget, setHasPastedWidget] = useState(false);
  const dispatch = useAppDispatch();

  const widgetClipboard = useAppSelector(selectWidgetClipboard);
  const widgets = useAppSelector(selectWidgets);
  const hasActiveWidget = useAppSelector(selectHasActiveWidget);
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const hasKeyboardIgnore = useAppSelector(selectHasKeyboardIgnore);

  const pageClipboard = useAppSelector(selectPageClipboard);
  const isSlideView = useAppSelector(selectIsSlideView);
  const activePageId = useAppSelector(selectActivePage);
  const activePage = useAppSelector(selectPage(activePageId));

  const onAddWidgetToClipboard = useCallback(() => {
    const copyWidgets = createCopyWidgets(activeWidgets, widgets, activePageId);
    dispatch(addToWidgetClipboard(copyWidgets));
  }, [activePageId, dispatch, widgets, activeWidgets]);

  const onAddPageToClipboard = () => {
    const copyPage = createCopyPage(activePage, widgets);
    dispatch(addToPageClipboard(copyPage));
  };

  const onAddWidgetFromClipboard = () => {
    const widgets = parseCopyWidgets(widgetClipboard, activePageId);
    dispatch(addNewWidget(widgets));
    setHasPastedWidget(true);
  };

  const onAddPageFromClipboard = () => {
    const [pageCopy] = pageClipboard;
    dispatch(duplicatePage({ insertAfterId: activePageId, pageClipboard: pageCopy }));
  };

  const clearWidgetClipboard = () => dispatch(addToWidgetClipboard([]));
  const clearPageClipboard = () => dispatch(addToPageClipboard([]));

  const replaceClipboardWithPastedWidgets = () => {
    if (hasPastedWidget) {
      onAddWidgetToClipboard();
      setHasPastedWidget(false);
    }
  };

  useEffect(replaceClipboardWithPastedWidgets, [activeWidgetIds, onAddWidgetToClipboard, hasPastedWidget]);

  const addPastedTextAsWidget = (pastedText: string) =>
    dispatch(addNewWidget(defaultTextData('paragraph', pastedText)));

  const addPastedTableAsWidget = (pastedHtml: string) => dispatch(addNewWidget(defaultTableData(pastedHtml)));

  const onCopy = (e: ClipboardEvent | Event) => {
    const event = e as ClipboardEvent;

    const target = event.target as HTMLElement;
    if (shouldIgnoreEventTarget(target)) return;
    if (hasKeyboardIgnore) return;

    const copiedText = event?.clipboardData?.getData('Text');
    if (copiedText) return;

    clearBrowserClipboard();

    if (hasActiveWidget) {
      clearPageClipboard();
      return onAddWidgetToClipboard();
    }
    if (isSlideView) {
      clearWidgetClipboard();
      return onAddPageToClipboard();
    }
  };

  // TODO handle paste for: images / icons (svg) / spreadsheet tables / links
  const onPaste = (e: ClipboardEvent | Event) => {
    const event = e as ClipboardEvent;

    const target = event.target as HTMLElement;
    if (shouldIgnoreEventTarget(target)) return;
    if (hasKeyboardIgnore) return;

    const pastedText = event?.clipboardData?.getData('Text');
    const pastedHtml = event.clipboardData?.getData('text/html');
    if (pastedHtml?.match('</table>')) return addPastedTableAsWidget(pastedHtml);
    if (pastedText) return addPastedTextAsWidget(pastedText);

    clearBrowserClipboard();

    const hasWidgetClipboard = !!widgetClipboard.length;
    if (hasWidgetClipboard) return onAddWidgetFromClipboard();

    const hasPageClipboard = !!pageClipboard.length;
    if (hasPageClipboard && isSlideView) return onAddPageFromClipboard();
  };

  useEventListener('paste', onPaste);
  useEventListener('copy', onCopy);

  return <></>;
};

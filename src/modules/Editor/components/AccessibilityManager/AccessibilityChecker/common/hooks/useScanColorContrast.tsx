import { colord } from 'colord';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSWRConfig } from 'swr';

import { useColorContrastChecker } from '../../../../../../../hooks/useColorContrastChecker';
import { TreeNode } from '../../../../../../../types/structuredContentTypes';
import { WidgetType } from '../../../../../../../types/widget.types';
import { IconWidgetData } from '../../../../../../../widgets/IconWidget/IconWidget.types';
import { TextWidgetData } from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import {
  getFirstCharacterTextMarks,
  getFontStyleFromTextMarks,
} from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { useAppSelector } from '../../../../../store';
import { selectInfograph, selectInfographSize, selectPageOrder } from '../../../../../store/infographSelector';
import { getLeafNodes } from '../../../AccessibilityManager.helpers';
import { AccessibilityCheckers, AllCheckerState } from '../../../AccessibilityManager.types';
import { updateChecker } from '../../checker.actions';
import { useAccessibilityChecker } from '../../checker.hooks';
import { getWidgetTypeFromId } from '../../../../../../../widgets/Widget.helpers';
import { getDominantTextStyleByColor } from '../../../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.helpers';
import {
  ComponentWidgetIdKeys,
  ResponsiveTextWidgetData,
} from 'widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidget.types';

/**
 * Widget type that can use for color contrast check
 */
const contrastableWidgetTypes = [WidgetType.Text, WidgetType.Table, WidgetType.Icon, WidgetType.ResponsiveText];

enum ScanState {
  Idle = 'idle',
  Scanning = 'scanning',
}
/**
 * Hook to perform colour contrast check when scanColorContrast is called
 * Will update the accessibility checker state with the new widget list
 *
 * @returns { scanColorContrast }
 */
export const useScanColorContrast = (thumbnailRefs?: Array<HTMLDivElement | null>) => {
  const { dispatch } = useAccessibilityChecker();
  const { cache } = useSWRConfig();

  const [score, calculateScore, setOptions] = useColorContrastChecker();
  const scanState = useRef(ScanState.Idle);
  const pageIds = useAppSelector(selectPageOrder);
  const infograph = useAppSelector(selectInfograph);
  const pageSize = useAppSelector(selectInfographSize);

  // TODO can use readingOrderWidgetMap to do the same thing
  const targetWidgetList = useMemo(() => {
    const result = pageIds.map((pageId) => {
      const widgetStructureTree = infograph.pages[pageId].widgetStructureTree;
      if (!widgetStructureTree) return [];
      const widgetIds = widgetStructureTree ? getLeafNodes(widgetStructureTree as TreeNode) : [];

      return widgetIds.filter((id) => contrastableWidgetTypes.includes(getWidgetTypeFromId(id)));
    });

    return result;
  }, [pageIds, infograph]);

  // Set options for all target widgets, and calculate the score by calling the calculateScore function.
  const scanColorContrast = useCallback(() => {
    if (!thumbnailRefs) return;
    if (!setOptions) return;

    targetWidgetList.forEach((widgetsByPage, pageIndex) => {
      const pageId = pageIds[pageIndex];
      widgetsByPage.forEach((widgetId) => {
        const widgetType = getWidgetTypeFromId(widgetId);

        switch (widgetType) {
          case WidgetType.Text: {
            const widgetData = infograph.widgets[widgetId] as TextWidgetData;
            const textMarks = getFirstCharacterTextMarks(widgetData?.proseMirrorData);

            if (!textMarks) return;

            const { fontColor, fontSize, isBold } = getFontStyleFromTextMarks(textMarks);

            setOptions({
              pageId,
              widgetId,
              targetPage: thumbnailRefs[pageIndex],
              targetColor: colord(fontColor).toHex(),
              targetRect: {
                xPx: widgetData.leftPx,
                yPx: widgetData.topPx,
                widthPx: widgetData.widthPx,
                heightPx: widgetData.heightPx,
              },
              pageWidthPx: pageSize.widthPx,
              pageHeightPx: pageSize.heightPx,
              targetFontSize: fontSize,
              targetFontWeight: isBold ? 'bold' : undefined,
            });

            break;
          }

          case WidgetType.Table: {
            const widgetData = infograph.widgets[widgetId] as TextWidgetData;
            const textStyle = getDominantTextStyleByColor(widgetData?.proseMirrorData);

            if (!textStyle?.color || !textStyle?.fontSize) return;

            setOptions({
              pageId,
              widgetId,
              targetPage: thumbnailRefs[pageIndex],
              // TODO: pass multi target colors
              targetColor: colord(textStyle.color).toHex(),
              targetRect: {
                xPx: widgetData.leftPx,
                yPx: widgetData.topPx,
                widthPx: widgetData.widthPx,
                heightPx: widgetData.heightPx,
              },
              pageWidthPx: pageSize.widthPx,
              pageHeightPx: pageSize.heightPx,
              targetFontSize: textStyle.fontSize,
              targetFontWeight: undefined,

              /**
               * These two options will remove its text content and preserve table structure on page thumbnail
               */
              enabledFilter: false,
              enabledTextFilter: true,
            });

            break;
          }

          case WidgetType.Icon: {
            const widgetData = infograph.widgets[widgetId] as IconWidgetData;

            // Skip non-essential graphics
            if (widgetData.isDecorative) return;

            const iconColor = widgetData.shapeColorOne;
            const iconCacheData = cache.get(widgetData.iconId);

            // Only mono icons are allowed to use.
            const isMono = iconCacheData && iconCacheData?.color === 0;
            if (!isMono) return;

            setOptions({
              pageId,
              widgetId,
              targetPage: thumbnailRefs[pageIndex],
              targetColor: colord(iconColor).toHex(),
              targetRect: {
                xPx: widgetData.leftPx,
                yPx: widgetData.topPx,
                widthPx: widgetData.widthPx,
                heightPx: widgetData.heightPx,
              },
              pageWidthPx: pageSize.widthPx,
              pageHeightPx: pageSize.heightPx,
            });

            break;
          }
          case WidgetType.ResponsiveText: {
            const widgetData = infograph.widgets[widgetId] as ResponsiveTextWidgetData;
            const { componentWidgetIdMap } = widgetData;

            const textWidgetId = componentWidgetIdMap?.[ComponentWidgetIdKeys.Text];
            const textWData = infograph.widgets[textWidgetId] as TextWidgetData;

            if (!textWData) return;
            const textMarks = getFirstCharacterTextMarks(textWData.proseMirrorData);

            if (!textMarks) return;

            const { fontColor, fontSize, isBold } = getFontStyleFromTextMarks(textMarks);

            setOptions({
              pageId,
              widgetId: textWidgetId,
              targetPage: thumbnailRefs[pageIndex],
              targetColor: colord(fontColor).toHex(),
              targetRect: {
                xPx: widgetData.leftPx,
                yPx: widgetData.topPx,
                widthPx: textWData.widthPx,
                heightPx: textWData.heightPx,
              },
              pageWidthPx: pageSize.widthPx,
              pageHeightPx: pageSize.heightPx,
              targetFontSize: fontSize,
              targetFontWeight: isBold ? 'bold' : undefined,
            });

            break;
          }
          default:
            break;
        }
      });
    });
    if (!calculateScore) return;
    scanState.current = ScanState.Scanning;
    calculateScore();
  }, [calculateScore, setOptions, targetWidgetList, infograph.widgets, pageIds, pageSize, cache, thumbnailRefs]);

  useEffect(() => {
    // we only want to update the checker after scanColorContrast() has been called
    if (scanState.current === ScanState.Idle) return;
    scanState.current = ScanState.Idle;

    const totalInsufficientWidgets = score.filter((data) => data?.score?.indexOf('AA') !== 0);
    const newList = totalInsufficientWidgets.map((data) => ({ pageId: data.pageId, widgetId: data.widgetId }));

    const invalidWidgets = newList;
    const isMarkAsResolved = totalInsufficientWidgets.length === 0;

    dispatch(updateChecker<AllCheckerState>(AccessibilityCheckers.colorContrast, { isMarkAsResolved, invalidWidgets }));
  }, [score, dispatch]);

  return {
    scanColorContrast,
  };
};

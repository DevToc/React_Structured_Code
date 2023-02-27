import { useCallback } from 'react';
import {
  CustomOnResize,
  CustomOnResizeEnd,
  CustomOnResizeStart,
  CustomOnRotateStart,
  CustomOnDrag,
  CustomOnDragEnd,
} from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { parseStrictNumber } from 'utils/number';
import { useWidget } from 'widgets/sdk';
import { WidgetState } from '../common/TextBasedWidgets.types';
import { modifyAllFontSizes } from '../common/TextBasedWidgets.helpers';
import { EditorStateWithTableColumn, UseTableBoundingBoxProps, TableWidgetData } from './TableWidget.types';
import { getTableData } from './TableWidget.helpers';
import { CELL_MIN_WIDTH } from './TableWidget.config';
import { JSONContent } from '@tiptap/core';

export const useTableBoundingBox = ({
  editor,
  setWidgetState,
  isWidgetSelected,
  dispatchUpdateWidget,
}: UseTableBoundingBoxProps) => {
  const { rotateDeg, widthPx, proseMirrorData } = useWidget<TableWidgetData>();

  const customOnResizeStart = useCallback(
    ({ event, onResizeStart, isGroup }: CustomOnResizeStart) => {
      if (isGroup) setWidgetState(WidgetState.Active);
      onResizeStart(event);

      const isResizeFromTyping = !event.inputEvent;
      if (!isResizeFromTyping && !isGroup) setWidgetState(WidgetState.Active);

      if (editor) {
        const { cellPositions, numCols } = getTableData(editor.view.state.doc);
        const originalColumnRatios = cellPositions.slice(0, numCols).map((pos) => {
          const node = editor.view.state.doc.nodeAt(pos);
          return node?.attrs.colwidth?.[0] / event.target.clientWidth;
        });
        editor.storage.columnResizing.columnRatios = originalColumnRatios;
        editor.storage.columnResizing.startX = event.clientX;
        editor.storage.columnResizing.box = event.target.getBoundingClientRect();
      }
    },
    [setWidgetState, editor],
  );

  const customOnResize = useCallback(
    ({ event, smartGuide, frameMap, isGroup }: CustomOnResize) => {
      if (editor) {
        const { numCols } = getTableData(editor.view.state.doc);
        if (event.width < numCols * CELL_MIN_WIDTH) return;
      }
      const target = event.target;

      const frame = frameMap.get(target);
      const [x, y] = event.drag.beforeTranslate;

      const isKeyboard = !event.inputEvent;
      const isRotated = Math.abs(rotateDeg) > 1;

      // TODO: SmartGuide match snapping for rotation and group
      if (isRotated || isKeyboard || isGroup) {
        frame.translate = [x, y];

        target.style.transform = `translate(${x}px, ${y}px) rotate(${rotateDeg}deg)`;

        if (isGroup) {
          const ratio = target.clientWidth / widthPx;
          const newContent = modifyAllFontSizes(proseMirrorData as JSONContent, ratio, { round: true });
          editor?.commands.setContent(newContent);
        }

        return;
      }

      const snapPosition = smartGuide.match({ e: event, frame });
      let translation = parseStrictNumber(snapPosition.x as number) || frame.translate[0];

      if (editor) {
        const tr = editor.view.state.tr;
        const dispatch = editor.view.dispatch;

        const { cellPositions, numCols } = getTableData(editor.view.state.doc);
        const { columnRatios, startX, box } = editor.storage.columnResizing;
        const { width, left, right } = box;

        cellPositions.forEach((pos, index) => {
          const cell = editor.view.state.doc.nodeAt(pos);
          const attrs = cell?.attrs;
          const columnRatio = columnRatios[index % numCols];

          if (columnRatio) {
            const newWidth = columnRatio * (width + event.direction[0] * (event.clientX - startX));
            const newAttrs = { ...attrs, colwidth: [newWidth < CELL_MIN_WIDTH ? CELL_MIN_WIDTH : newWidth] };
            tr.setNodeMarkup(pos, null, newAttrs);
          }
        });
        dispatch(tr);

        if (event.direction[0] < 0) {
          const maxTranslation = width - numCols * CELL_MIN_WIDTH;
          translation = translation > maxTranslation ? maxTranslation : translation;
          if (left + translation + event.width > right) translation = right - event.width - startX;
        }
      }

      frame.translate = [translation, 0];

      // keep y fixed to re-size text downwards
      // TODO: It needs more calculation for the rotated widget.
      const fixedY = 0;
      target.style.transform = `translate(${frame.translate[0]}px, ${fixedY}px)`;
    },
    [rotateDeg, proseMirrorData, widthPx, editor],
  );
  const customOnResizeEnd = useCallback(
    ({ event, isGroup, onResizeEnd }: CustomOnResizeEnd) => {
      if (editor) {
        editor.storage.columnResizing.columnRatios = null;
        editor.storage.columnResizing.startX = null;
        editor.storage.columnResizing.box = null;
      }
      event.target.style.width = 'fit-content';
      // column content in the proseMirrorData is updated in onResize
      onResizeEnd(event, { proseMirrorData: editor?.getJSON() });
    },
    [editor],
  );
  const customOnRotateStart = useCallback(
    ({ event, onRotateStart }: CustomOnRotateStart) => {
      onRotateStart(event);
      setWidgetState(WidgetState.Active);
    },
    [setWidgetState],
  );

  const customOnDrag = useCallback(
    ({ event, onDrag }: CustomOnDrag) => {
      const state = editor?.view.state as EditorStateWithTableColumn;
      if (!state.tableColumnResizing$?.dragging) onDrag(event);
    },
    [editor?.view.state],
  );

  const customOnDragEnd = useCallback(
    ({ event, onDragEnd, smartGuide }: CustomOnDragEnd) => {
      const state = editor?.view.state as EditorStateWithTableColumn;
      const columnResizeActive = state?.tableColumnResizing$?.activeHandle !== -1;

      // the table was resized by dragging a column handle
      if (columnResizeActive) {
        dispatchUpdateWidget();
        smartGuide?.hide();
        return;
      }

      if (isWidgetSelected) setWidgetState(WidgetState.Active);

      onDragEnd(event);
    },
    [editor, isWidgetSelected, setWidgetState, dispatchUpdateWidget],
  );

  return { customOnResizeStart, customOnResize, customOnResizeEnd, customOnDrag, customOnDragEnd, customOnRotateStart };
};

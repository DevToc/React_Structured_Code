import { Extension } from '@tiptap/core';
import { columnResizing } from '@_ueberdosis/prosemirror-tables';
import { EditorStateWithTableColumn } from 'widgets/TextBasedWidgets/TableWidget/TableWidget.types';
interface ColumnResizingOptions {
  lastColumnResizable: boolean;
  cellMinWidth: number;
}

const EXTENSION_NAME = 'columnResizing';

export const ColumnResizing = Extension.create<ColumnResizingOptions>({
  name: EXTENSION_NAME,

  addOptions() {
    return {
      lastColumnResizable: true,
      cellMinWidth: 25,
    };
  },

  addProseMirrorPlugins() {
    const resizing = columnResizing({
      // @ts-ignore (incorrect type)
      lastColumnResizable: this.options.lastColumnResizable,
      cellMinWidth: this.options.cellMinWidth,
    });
    return [resizing];
  },

  addStorage() {
    return {
      columnRatios: null,
      startX: null,
      box: null,
    };
  },

  // set initial table width in extension storage
  onTransaction() {
    const state = this.editor.state as EditorStateWithTableColumn;
    const isResizing: boolean = !!state?.tableColumnResizing$?.dragging;
    const cellSelectionBox: HTMLElement | null = this.editor.view.dom.querySelector('.cellSelectionBox');

    if (isResizing && cellSelectionBox) {
      cellSelectionBox.style.display = 'none';
      return;
    }
  },
});

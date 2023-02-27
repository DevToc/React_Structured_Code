import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { SelectionBox } from './views/SelectionBox';

const CELL_SELECTION_NAME = 'cellSelection';
export const CELL_SELECTION_KEY = new PluginKey(CELL_SELECTION_NAME);

export const cellSelectionPlugin = () => {
  return new Plugin({
    view(editorView) {
      return new SelectionBox(editorView);
    },
    key: CELL_SELECTION_KEY,
  });
};

export const CellSelection = Extension.create({
  name: CELL_SELECTION_NAME,

  addProseMirrorPlugins() {
    const selectionPlugin = cellSelectionPlugin();
    return [selectionPlugin];
  },
});

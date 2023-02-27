import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

interface EmptyTextStyleOptions {}

const EXTENSION_NAME = 'emptyTextStyle';

const isEmptyStorageMark = <T>(mark: T) => mark === null || mark === undefined;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [EXTENSION_NAME]: {
      applyEmptyTextStyle: () => ReturnType;
    };
  }
}

export const EmptyTextStyle = Extension.create<EmptyTextStyleOptions>({
  name: EXTENSION_NAME,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(EXTENSION_NAME),
        appendTransaction: (trs, oldState, newState) => {
          if (trs.length !== 1 || !this.editor?.isFocused) return;

          // Apply storeMarks when both oldState and newState have empty doc
          if (newState.doc.textContent.length === 0 && oldState.doc.textContent.length === 0) {
            let newTr = newState.tr;
            if (oldState.storedMarks?.length && isEmptyStorageMark(trs[0].storedMarks)) {
              newTr.setStoredMarks([]);
              oldState.storedMarks?.forEach((mark) => newTr.addStoredMark(mark));

              // Set oldState storedMarks to editor.storage.emptyTextStyle
              this.editor.storage.emptyTextStyle.storedMarks = oldState.storedMarks;
            } else {
              newTr.setStoredMarks(trs[0].storedMarks);
            }

            return newTr;
          }

          return;
        },
      }),
    ];
  },

  addCommands() {
    return {
      applyEmptyTextStyle:
        () =>
        ({ state, dispatch }) => {
          if (!dispatch) return false;
          if (state.doc.textContent.length === 0) {
            const { emptyTextStyle } = this.editor.storage;
            if (emptyTextStyle?.storedMarks?.length) {
              return dispatch(state.tr.setStoredMarks(emptyTextStyle.storedMarks));
            }

            return false;
          }
        },
    };
  },
});

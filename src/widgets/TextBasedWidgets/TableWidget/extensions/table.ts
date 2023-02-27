import { Editor } from '@tiptap/core';
import Table from '@tiptap/extension-table';
import { TextSelection } from 'prosemirror-state';
import {
  updateAllCellBorderStyle,
  updateColumnAttrsLeft,
  updateColumnAttrsRight,
  updateRowAttrsBelow,
  updateRowAttrsAbove,
} from '../TableWidget.helpers';

const selectAll = ({ editor }: { editor: Editor }) => {
  const { state } = editor.view;
  const { selection } = state;
  const { doc } = state;

  if (selection instanceof TextSelection) {
    // text selection
    const { $from } = selection;
    const textStart = $from.pos - $from.parentOffset;
    const textLength = $from.parent.textContent.length;
    return editor.commands.setTextSelection({ from: textStart, to: textStart + textLength });
  } else {
    // cell selection
    let lastCellPos = 2;
    doc.descendants((node, pos) => {
      if (node.type.name === 'tableCell') lastCellPos = pos;
    });
    return editor.commands.setCellSelection({ headCell: 2, anchorCell: lastCellPos });
  }
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tables: {
      /**
       * Update all cell border style as current selected cell
       */
      updateAllCellBorderStyle: () => ReturnType;

      /**
       * Apply current selected column cells attr to the right
       */
      updateColumnAttrsRight: () => ReturnType;

      /**
       * Apply current selected column cells attr to the left
       */
      updateColumnAttrsLeft: () => ReturnType;

      /**
       * Apply current selected column cells attr to the right
       */
      updateRowAttrsBelow: () => ReturnType;

      /**
       * Apply current selected column cells attr to the left
       */
      updateRowAttrsAbove: () => ReturnType;
    };
  }
}

export const CustomTable = Table.extend({
  addKeyboardShortcuts() {
    return {
      // Use line breaks instead of creating new paragraphs on new line for title and heading nodes
      Enter: () =>
        (this.editor.isActive('title') || this.editor.isActive('heading')) && this.editor.commands.setHardBreak(),

      Tab: () => {
        if (this.editor.commands.goToNextCell()) return true;
        if (!this.editor.can().addRowAfter()) return false;

        return this.editor.chain().addRowAfter().goToNextCell().run();
      },

      'Shift-Tab': () => this.editor.commands.goToPreviousCell(),
      'Mod-a': selectAll,
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      updateAllCellBorderStyle:
        () =>
        ({ state, tr, dispatch }) => {
          if (!dispatch) return false;
          updateAllCellBorderStyle(state, tr, dispatch);
          return true;
        },

      updateColumnAttrsRight:
        () =>
        ({ state, tr, dispatch }) => {
          if (!dispatch) return false;
          updateColumnAttrsRight(state, tr, dispatch);
          return true;
        },

      updateColumnAttrsLeft:
        () =>
        ({ state, tr, dispatch }) => {
          if (!dispatch) return false;
          updateColumnAttrsLeft(state, tr, dispatch);
          return true;
        },

      updateRowAttrsBelow:
        () =>
        ({ state, tr, dispatch }) => {
          if (!dispatch) return false;
          updateRowAttrsBelow(state, tr, dispatch);
          return true;
        },

      updateRowAttrsAbove:
        () =>
        ({ state, tr, dispatch }) => {
          if (!dispatch) return false;
          updateRowAttrsAbove(state, tr, dispatch);
          return true;
        },
    };
  },
});

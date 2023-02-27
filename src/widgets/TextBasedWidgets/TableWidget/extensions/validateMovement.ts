import { Editor, Extension } from '@tiptap/core';

enum Direction {
  Left = 'left',
  Right = 'right',
}

/*
  Prosemirror table content always starts at position 4 since each html tag counts as 1 position.
  Similarly, the last content position is 4 positions away from the end of the document.

  For example the letter "c" below is at position 4, the letter "t" is at position 10 since the document length is 14.
  T = Table, R = Row, C = Cell, P = Paragraph

  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14
  T  R  C  P  c  o  n  t  e  n  t  P  C  R  T

  <table>
    <tr>
      <td>
        <p>
          content
        </p>
      </td>
    </tr>
  </table>
*/
const CONTENT_DEPTH = 4;

const validateMovement = ({ editor }: { editor: Editor }, direction: string) => {
  const tableSize = editor.view.state.doc.child(0).nodeSize;
  const selection = editor.view.state.selection;

  const atTableStart = selection?.from <= CONTENT_DEPTH || selection?.to <= CONTENT_DEPTH;
  const atTableEnd = selection?.from >= tableSize - CONTENT_DEPTH || selection?.to >= tableSize - CONTENT_DEPTH;

  const exitingTableBounds =
    (atTableEnd && direction === Direction.Right) || (atTableStart && direction === Direction.Left);

  if (exitingTableBounds) return true;

  return false;
};

/**
 * Since we set the table as the top node, we only need to handle the movement of the cursor
 * for the left and right arrow keys.
 *
 * TODO: Need to handle Tab keypresses for different scenarios.
 */
export const ValidateMovement = Extension.create({
  addKeyboardShortcuts() {
    return {
      ArrowLeft: () => validateMovement(this, Direction.Left),
      ArrowRight: () => validateMovement(this, Direction.Right),
    };
  },
});

import { Selection, TextSelection } from 'prosemirror-state';
import { CellSelection } from '@_ueberdosis/prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { getEditorZoom } from 'widgets/sdk';
import { EditorStateWithTableColumn } from '../../TableWidget.types';

export class SelectionBox {
  selectionBox: HTMLElement;
  widget: HTMLElement;

  private defaultSelectionStyle = {
    background: 'rgba(0, 115, 230, 0.2)',
  };

  constructor(view: EditorView) {
    this.selectionBox = document.createElement('div');
    this.selectionBox.classList.add('cellSelectionBox');
    this.selectionBox.style.position = 'absolute';
    this.selectionBox.style.outline = '1.5px solid var(--vg-colors-upgrade-blue-500)';
    this.selectionBox.style.outlineOffset = '-1.5px';
    this.selectionBox.style.pointerEvents = 'none';
    this.selectionBox.style.zIndex = '2';

    this.widget = view.dom;
    this.update(view);
  }

  update(view: EditorView) {
    const selection = view.state.selection;
    const columnResizingMeta = (view?.state as EditorStateWithTableColumn)?.tableColumnResizing$;

    // Selection box should not be visible when column resizing is active
    const isColumnResizeActive = columnResizingMeta?.dragging;

    if (!selection || !view.hasFocus() || isColumnResizeActive) {
      this.selectionBox.style.display = 'none';
      return;
    }

    // Selection box should be appended to the parent of the table widget
    // Appending it to the table editor clashes with the column resize and update will go into a infinite loop
    if (this.widget.childElementCount === 1) this.widget.parentElement?.append(this.selectionBox);

    let selectedCells = [];

    this.toggleSelectionStyle(selection);
    if (selection instanceof CellSelection) {
      selectedCells = [...this.widget.querySelectorAll('.selectedCell')].map((x) => {
        const rect = x.getBoundingClientRect();
        const { left, top, right, bottom } = rect;
        return {
          cell: x,
          left,
          top,
          right,
          bottom,
        };
      });
    } else if (selection instanceof TextSelection) {
      const { from } = selection;
      const node = view.domAtPos(from)?.node;
      const cell = node ? node.parentElement?.closest('td') || node.parentElement?.closest('th') : null;

      if (cell) {
        const cellRect = cell.getBoundingClientRect();
        const { left, top, right, bottom } = cellRect;
        selectedCells.push({
          cell,
          left,
          top,
          right,
          bottom,
        });
      }
    }

    if (!selectedCells.length) {
      this.selectionBox.style.display = 'none';
    } else {
      const furthestLeft = Math.min(...selectedCells.map((x) => x.left));
      const furthestTop = Math.min(...selectedCells.map((x) => x.top));
      const furthestRight = Math.max(...selectedCells.map((x) => x.right));
      const furthestBottom = Math.max(...selectedCells.map((x) => x.bottom));

      const width = furthestRight - furthestLeft;
      const height = furthestBottom - furthestTop;

      const { left: widgetLeft, top: widgetTop } = this.widget.getBoundingClientRect();
      const zoom = getEditorZoom();

      if (furthestTop < widgetTop) {
        this.selectionBox.style.top = `${0}px`;
        this.selectionBox.style.height = `${(height + furthestTop - widgetTop) / zoom}px`;
      } else {
        this.selectionBox.style.top = `${(furthestTop - widgetTop) / zoom}px`;
        this.selectionBox.style.height = `${height / zoom}px`;
      }
      this.selectionBox.style.left = `${(furthestLeft - widgetLeft) / zoom}px`;
      this.selectionBox.style.width = `${width / zoom}px`;
      this.selectionBox.style.display = 'block';
    }
  }

  toggleSelectionStyle(selection: Selection) {
    this.selectionBox.style.background =
      selection instanceof CellSelection ? this.defaultSelectionStyle.background : 'none';
  }

  destroy() {
    this.selectionBox.remove();
  }
}

import TableCell from '@tiptap/extension-table-cell';
import { mergeAttributes } from '@tiptap/core';
import { DEFAULT_COL_WIDTH } from '../TableWidget.helpers';

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: [DEFAULT_COL_WIDTH],
        parseHTML: (element) => {
          let value = [DEFAULT_COL_WIDTH];
          const colwidth = element.getAttribute('colwidth');

          if (colwidth) {
            value = [parseInt(colwidth, 10)];
          } else {
            const colgroup = element.closest('table')?.querySelector('colgroup');
            const row = element.parentElement;
            const columnIndex = !!row && Array.from(row?.children).indexOf(element);
            if (colgroup && (columnIndex || columnIndex === 0)) {
              const column = colgroup.children[columnIndex] as HTMLElement;
              const width = column.style.width || column.getAttribute('width');
              if (width) value = [parseInt(width, 10)];
            }
          }

          return value;
        },
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => {
          const background = element.style.backgroundColor || null;

          return background;
        },
      },
      borderColor: {
        default: null,
        parseHTML: (element) => {
          const borderColor = element.style.borderColor || null;

          return borderColor;
        },
      },
      borderWidth: {
        default: null,
        parseHTML: (element) => {
          const borderWidth = element.style.borderWidth || null;

          return borderWidth;
        },
      },
      verticalAlignment: {
        default: 'top',
        parseHTML: (element) => {
          const verticalAlignment = element.style.verticalAlign || null;

          return verticalAlignment;
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const attributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const style = `background-color:${attributes.backgroundColor}; border-color:${attributes.borderColor}; border-width:${attributes.borderWidth}; vertical-align:${attributes.verticalAlignment};`;

    return ['td', { ...attributes, style }, 0];
  },
});

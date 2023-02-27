import { Attributes, Editor, findParentNodeClosestToPos, JSONContent } from '@tiptap/core';
import { Node as ProseMirrorNode, Attrs, NodeType, Slice, Mark } from 'prosemirror-model';
import { EditorState, Selection, TextSelection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  // @ts-ignore (incorrect type)
  handlePaste as proseMirrorHandlePaste,
  // @ts-ignore (incorrect type)
  __pastedCells,
  selectedRect,
  CellSelection,
  cellAround,
} from '@_ueberdosis/prosemirror-tables';
import { joinBackward as _joinBackward } from 'prosemirror-commands';

import { TableMap } from '@_ueberdosis/prosemirror-tables';
import { WidgetType } from '../../../types/widget.types';
import { CellAttributes } from './TableWidget.types';
import { VERSION } from './TableWidget.upgrade';
import { parseStrictNumber } from '../../../utils/number';
import { TEXT_TAG_TO_STYLES_MAP } from '../common/TextBasedWidgets.config';
import { TextWidgetTag } from '../common/TextBasedWidgets.types';
import { getNearestMarks } from '../common/TextBasedWidgets.helpers';

type TextStyle = {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
};

const TABLE_EXT_NAME = 'table';
const TABLE_HEADER_EXT_NAME = 'tableHeader';
const TABLE_CELL_EXT_NAME = 'tableCell';
export const DEFAULT_COL_WIDTH = 80;

/**
 * Return minimum default text data
 *
 * @returns  default text widget data
 */
export const generateDefaultData = (content?: JSONContent | string) => {
  let width = 621;
  let height = 182.17;

  if (typeof content === 'string') {
    const colgroup = content.match(/<colgroup>.*?<\/colgroup>/g)?.[0];
    const topRow = content.match(/<tr.*?>.*?<\/tr>/g)?.[0];
    const numCols = topRow?.match(/<td.*?<\/td>|<th.*?<\/th>/g)?.length;

    if (colgroup && !content.match(/colwidth="\d+"/)) {
      const colwidths = colgroup.match(/width="\d+"/g);
      const widths = colwidths?.map((colwidth) => parseFloat(colwidth.replace(/width="|"/g, '')));
      width = widths?.slice(0, numCols).reduce((prev, cur) => prev + cur) || width;

      const rows = content.match(/<tr.*?>.*?<\/tr>/g);
      const newRows: string[] = [];
      rows?.forEach((row) => {
        const cells = row.match(/<td.*?<\/td>|<th.*?<\/th>/g);
        const newCells: string[] = [];
        cells?.forEach((cell, index) => {
          const cellType = cell.slice(0, 3);
          newCells.push(`${cellType} colwidth="${widths?.[index] || 80}" ${cell.slice(3, cell.length)}`);
        });
        row = row.replace(/<td.*<\/td>|<th.*<\/th>/g, newCells.join(''));
        newRows.push(row);
      });
      const newTableBody = newRows.join('');
      content = content.replace(/<tbody.*?<\/tbody>/, `<tbody>${newTableBody}</tbody>`);
    } else if (content.match(/colwidth="\d+"/)) {
      const colwidths = content.match(/colwidth="\d+"/g);
      const widths = colwidths?.map((colwidth) => parseFloat(colwidth.replace(/colwidth="|"/g, '')));
      width = widths?.slice(0, numCols).reduce((prev, cur) => prev + cur) || width;
    }

    height = 0;
  }

  return {
    widgetType: WidgetType.Table,
    widgetData: {
      version: VERSION,
      topPx: 10,
      leftPx: 20,
      widthPx: width,
      heightPx: height,
      rotateDeg: 0,
      proseMirrorData: content || {
        type: 'doc',
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableHeader',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [295],
                      backgroundColor: 'rgba(0, 82, 163, 1)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'center',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '16px',
                                  color: 'rgb(255, 255, 255)',
                                },
                              },
                            ],
                            text: 'Milestone',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableHeader',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [93],
                      backgroundColor: 'rgba(0, 82, 163, 1)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'center',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '16px',
                                  color: 'rgb(255, 255, 255)',
                                },
                              },
                            ],
                            text: 'Status',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableHeader',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [120],
                      backgroundColor: 'rgba(0, 82, 163, 1)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'center',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '16px',
                                  color: 'rgb(255, 255, 255)',
                                },
                              },
                            ],
                            text: 'Expected',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableHeader',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [112],
                      backgroundColor: 'rgba(0, 82, 163, 1)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'center',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '16px',
                                  color: 'rgb(255, 255, 255)',
                                },
                              },
                            ],
                            text: 'Actual',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [295],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Server Cost and Performance Analysis',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [93],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Complete',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [120],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Week 3',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [112],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Week 2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [295],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Electricity and Utility Infrastructure Upgrade',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [93],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'In Progress',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [120],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Week 20',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [112],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'TBD',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [295],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Materials Purchasing',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [93],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'In Progress',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [120],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Week 30',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [112],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'TBD',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [295],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Installation and Validation',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [93],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Not Started',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [120],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Week 38',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [112],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'TBD',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [295],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Implementation',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [93],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Not Started',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [120],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'Week 40',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    attrs: {
                      colspan: 1,
                      rowspan: 1,
                      colwidth: [112],
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderColor: 'rgba(204, 204, 204, 1)',
                      borderWidth: '1px',
                    },
                    content: [
                      {
                        type: 'paragraph',
                        attrs: {
                          lineHeight: '1.2',
                          textAlign: 'left',
                        },
                        content: [
                          {
                            type: 'text',
                            marks: [
                              {
                                type: 'textStyle',
                                attrs: {
                                  fontFamily: 'Inter',
                                  fontSize: '12px',
                                  color: 'rgba(43, 43, 53, 1)',
                                },
                              },
                            ],
                            text: 'TBD',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
};

/**
 * Find all text content node and return in flat array
 *
 * @param node - A prosemirror content node
 * @returns
 */
const getAllTextContents = (node: JSONContent): JSONContent[] => {
  const contents: JSONContent[] = [];

  /**
   * Internal helper to find text content node recursively
   *
   * @param content - Content node in json format
   * @returns
   */
  const findText = (content: JSONContent): void => {
    if (Array.isArray(content?.content) && content?.content.length) {
      return content?.content.forEach(findText);
    }

    if (content?.type === 'text') contents.push(content);
  };

  findText(node);

  return contents;
};

/**
 * This is greedy fast check. The highest in use color will be set as dominant color.
 * Later on, we can improve this by filtering most length text contents.
 *
 * @param node
 * @returns
 */
const getDominantTextStyleByColor = (node: JSONContent): TextStyle | undefined => {
  const styles = new Map<string, Array<Record<string, any>>>();
  const textContents = getAllTextContents(node);

  textContents?.forEach(({ marks }) => {
    marks?.forEach((mark) => {
      if (mark?.type !== 'textStyle') return;

      if (mark?.attrs?.color?.length) {
        const style = styles.get(mark.attrs.color);
        const record = {
          fontFamily: mark.attrs?.fontFamily,
          fontSize: parseStrictNumber(mark.attrs?.fontSize),
          color: mark.attrs?.color,
        };

        if (Array.isArray(style) && style.length) {
          // Add to existing lists
          style.push(record);
        } else {
          // Add new record if not exist
          styles.set(mark.attrs.color, [record]);
        }
      }
    });
  });

  /**
   * Sort map by frequent color count.
   * This can be improved by
   */
  const result = [...styles.values()].sort((a, b) => a.length - b.length).pop();

  return result?.shift();
};

/**
 * Get table cell position information. This can be used with TableMap for more complex computation
 *
 * @param doc - Prosemirror document node
 * @returns
 */
const getTableData = (doc: ProseMirrorNode): { cellPositions: number[]; numRows: number; numCols: number } => {
  const cellPositions = [] as number[];
  let numRows = 0;

  doc.descendants((node: ProseMirrorNode, pos: number) => {
    const { name } = node.type;
    if (name === 'tableRow') numRows++;
    if (name === TABLE_CELL_EXT_NAME || name === TABLE_HEADER_EXT_NAME) cellPositions.push(pos);
  });

  const numCols = cellPositions.length / numRows;

  return {
    cellPositions,
    numRows,
    numCols,
  };
};

/**
 * Get selected table node from document
 *
 * @param selection - A prosemirror selection instance
 * @returns
 */
const getClosestTable = (selection: Selection): ReturnType<typeof findParentNodeClosestToPos> =>
  findParentNodeClosestToPos(selection.$anchor, (node: ProseMirrorNode) => node.type.name === TABLE_EXT_NAME);

/**
 * Get selected closest cell node
 *
 * @param selection - A prosemirror selection instance
 * @returns
 */
const getClosestCell = (selection: Selection): ReturnType<typeof findParentNodeClosestToPos> =>
  findParentNodeClosestToPos(selection.$anchor, (node: ProseMirrorNode) => {
    return node.type.name === TABLE_CELL_EXT_NAME || node.type.name === TABLE_HEADER_EXT_NAME;
  });

/**
 * Get selected closest cell node attributes if exists
 *
 * @param selection - A prosemirror selection instance
 * @returns
 */
const getClosestCellAttributes = (selection: Selection): Attributes => {
  const cellNode = getClosestCell(selection);
  return cellNode?.node?.attrs ?? {};
};

/**
 * Apply giving border style to all table cells. If no style provides in the arguments,
 * it will choose current selection nearest cell node style instead.
 *
 * @param editor - A tiptap editor instance
 * @param style - A style attributes
 */
const updateAllCellBorderStyle = (
  state: EditorState,
  tr: Transaction,
  dispatch: (tr: Transaction) => void,
  style?: Attributes,
) => {
  if (!dispatch) return;

  const { selection, doc } = state;
  const { borderWidth, borderColor } = (style ?? getClosestCellAttributes(selection)) as CellAttributes;

  doc.descendants((node: ProseMirrorNode, pos) => {
    if (node.type.name === TABLE_CELL_EXT_NAME || node.type.name === TABLE_HEADER_EXT_NAME) {
      if (node.attrs?.borderWidth !== borderWidth || node.attrs?.borderColor !== borderColor) {
        tr.setNodeMarkup(pos, null, { borderWidth, borderColor });
      }
    }
  });

  dispatch(tr);
};

enum Direction {
  /**
   * In prosemirror direction control, -1 means to left/above
   */
  before = -1,

  /**
   * In prosemirror direction control, 1 means to right/below
   */
  after = 1,
}

enum Orientation {
  horizontal = 'horiz',
  vertical = 'vert',
}

/**
 * Check whether giving node is table cell node or not
 *
 * @param node - A prosemirror node
 * @returns
 */
const isCellNode = (node?: ProseMirrorNode) =>
  node && [TABLE_CELL_EXT_NAME, TABLE_HEADER_EXT_NAME].some((name) => node.type.name === name);

/**
 * Apply current selection column style attributes to next column on left or right
 *
 * @param state - Prosemirror state
 * @param tr - Prosemirror transaction
 * @param dispatch - Prosemirror transaction dispatch caller
 * @param direction -
 * @returns
 */
const updateCellAttrs = (
  state: EditorState,
  tr: Transaction,
  dispatch: (tr: Transaction) => void,
  direction: Direction,
  orientation: Orientation,
) => {
  if (!dispatch) return;

  const { selection } = state;
  const { node: tableNode } = getClosestTable(selection) ?? {};
  const { pos: cellPos } = getClosestCell(selection) ?? {};

  if (!tableNode || typeof cellPos !== 'number') return;

  const tableMap = TableMap.get(tableNode);
  const mapCellPos = cellPos - 1;

  if (!tableMap.map.includes(mapCellPos)) return;

  try {
    // left column count from selected cell column
    const cellIndex = tableMap.map.indexOf(mapCellPos);
    const row = Math.floor(cellIndex / tableMap.width);
    const col = cellIndex % tableMap.width;
    const isColumn = orientation === Orientation.horizontal;

    const addingAxis = orientation === Orientation.horizontal ? tableMap.height : tableMap.width;

    for (let index = 0; index < addingAxis; index++) {
      const position: [number, number] = isColumn ? [index, col] : [row, index];
      const sourceCellPos = tableMap.positionAt(...position, tableNode);
      const sourceCellNode = state.doc.nodeAt(sourceCellPos + 1);

      if (!sourceCellNode || !isCellNode(sourceCellNode)) continue;

      const nextCellPos = tableMap.nextCell(sourceCellPos, orientation, direction);
      const nextCellNode = state.doc.nodeAt(nextCellPos + 1);

      if (!nextCellNode || !isCellNode(nextCellNode)) continue;

      // Copy source node attributes to target column node
      tr.setNodeMarkup(nextCellPos + 1, null, { ...sourceCellNode?.attrs });
    }

    dispatch(tr);
  } catch (error) {
    // Safe to ignore error if update fails
    console.warn(error);
  }
};

const updateColumnAttrsLeft = (state: EditorState, tr: Transaction, dispatch: (tr: Transaction) => void) =>
  updateCellAttrs(state, tr, dispatch, Direction.before, Orientation.horizontal);
const updateColumnAttrsRight = (state: EditorState, tr: Transaction, dispatch: (tr: Transaction) => void) =>
  updateCellAttrs(state, tr, dispatch, Direction.after, Orientation.horizontal);
const updateRowAttrsBelow = (state: EditorState, tr: Transaction, dispatch: (tr: Transaction) => void) =>
  updateCellAttrs(state, tr, dispatch, Direction.after, Orientation.vertical);
const updateRowAttrsAbove = (state: EditorState, tr: Transaction, dispatch: (tr: Transaction) => void) =>
  updateCellAttrs(state, tr, dispatch, Direction.before, Orientation.vertical);

/**
 * Recursively extracts a list of marks and attributes from text and paragraph nodes in the given node
 * @param node node to scan
 * @returns styles and attributes
 */
const getStyleData = (node: ProseMirrorNode | null): { paragraphAttrs: Attrs; marks: readonly Mark[] } => {
  let marks: readonly Mark[] = [];
  let paragraphAttrs: Attrs = {};

  if (!node?.firstChild) return { marks, paragraphAttrs };

  const childNode = node.firstChild;
  if (childNode?.type.name === 'paragraph') {
    paragraphAttrs = childNode.attrs;
    const grandchildNode = childNode.firstChild;
    if (grandchildNode) marks = grandchildNode.marks;
    return { paragraphAttrs, marks };
  } else {
    return getStyleData(childNode);
  }
};

/**
 * Handles paste events for copied text content in tables
 * @param view the editor view
 * @param e the paste event
 * @param slice the content to be pasted
 * @returns
 */
const handleTextPaste = (view: EditorView, e: ClipboardEvent, slice: Slice) => {
  const { numCols } = getTableData(view.state.doc);
  const originalStyles: {
    index: number;
    currentRow: number;
    currentColumn: number;
    cellAttrs: Attrs;
    paragraphAttrs: Attrs;
    marks: readonly Mark[];
    type: NodeType;
  }[] = [];
  const originalSelectionBox = selectedRect(view.state);

  const fillMissingAttributes = (node: ProseMirrorNode) => {
    if (node.isText) {
      node.marks.forEach((mark) => {
        if (mark.type.name === 'textStyle') {
          const { fontSize, fontFamily, color } = mark.attrs;
          const paragraphStyles = TEXT_TAG_TO_STYLES_MAP[TextWidgetTag.Paragraph];
          const newAttrs = {
            fontSize: fontSize || paragraphStyles.fontSize,
            fontFamily: fontFamily || paragraphStyles.fontFamily,
            color: color || paragraphStyles.color,
          };

          (mark.attrs as Attrs) = newAttrs;
        }
      });
    } else {
      node.content.forEach((child) => fillMissingAttributes(child));
    }
  };

  slice.content.forEach((node) => fillMissingAttributes(node));

  originalSelectionBox.map.map.forEach((pos, index) => {
    const { left, top, right, bottom, tableStart } = originalSelectionBox;
    const currentColumn = index % numCols;
    const currentRow = Math.floor(index / numCols);

    // ignore cells that are outside of the selection
    if (currentColumn < left || currentColumn >= right || currentRow < top || currentRow >= bottom) return;

    const cell = view.state.doc.nodeAt(pos + tableStart);

    if (cell) {
      const type = cell.type;
      const { backgroundColor, borderColor, borderWidth } = cell.attrs;
      const cellAttrs = {
        backgroundColor,
        borderColor,
        borderWidth,
      };
      const paragraph = cell.firstChild;
      const paragraphAttrs = paragraph?.attrs || [];
      const marks = paragraph?.firstChild?.marks || [];

      originalStyles.push({
        index,
        currentRow,
        currentColumn,
        cellAttrs,
        paragraphAttrs,
        marks,
        type,
      });
    }
  });

  const result = proseMirrorHandlePaste(view, e, slice);

  if (result) {
    const tr = view.state.tr;
    const newSelectionBox = selectedRect(view.state);

    newSelectionBox.map.map.forEach((pos, index) => {
      const { left, top, right, bottom, tableStart } = newSelectionBox;
      const currentCol = index % numCols;
      const currentRow = Math.floor(index / numCols);

      // ignore cells that are outside of the selection
      if (currentCol < left || currentCol >= right || currentRow < top || currentRow >= bottom) return;

      const styles = originalStyles.find((style) => style.index === index);
      const cellPos = pos + tableStart;
      const cell = view.state.doc.nodeAt(cellPos);

      if (styles && cell) {
        const { cellAttrs, paragraphAttrs, type } = styles;
        let { marks } = styles;
        tr.setNodeMarkup(cellPos, type, Object.assign({}, cell.attrs, cellAttrs));

        cell.descendants((node, nodePos) => {
          const absolutePosition = nodePos + cellPos + tableStart;
          if (node.type.name === 'paragraph') {
            tr.setNodeMarkup(absolutePosition, null, paragraphAttrs);
          }
          if (node.isText) {
            if (!marks.length) {
              const originalRowStyles = originalStyles.filter((style) => style.currentRow === currentRow);
              marks =
                originalRowStyles[originalSelectionBox.map.width - 1]?.marks ||
                getNearestMarks(view.state, absolutePosition);
            }
            if (marks.length) {
              tr.removeMark(absolutePosition, absolutePosition + node.textContent.length);
              marks.forEach((mark) => {
                tr.addMark(absolutePosition, absolutePosition + node.textContent.length, mark);
              });
            }
          }
        });
      }
    });

    // Remove intermediate history step from transaction to avoid double undo
    tr.setMeta('addToHistory', false);
    view.dispatch(tr);
  }

  return result;
};

/**
 * Handles the paste event by applying the expected styles and attributes to the clipboard
 * @param view the editor view
 * @param e the paste event
 * @param slice the content to be pasted
 */
const handlePaste = (view: EditorView, e: ClipboardEvent, slice: Slice) => {
  const cells = __pastedCells(slice);
  const { cellPositions, numCols } = getTableData(view.state.doc);

  // if no cells in clipboard, paste text only
  if (!cells) return handleTextPaste(view, e, slice);

  const pastedWidth = cells?.width || 1;
  const pastedHeight = cells?.height || 1;

  // if currently selecting cells, ignore that and set to a TextSelection of the first cell
  const selection = view.state.selection;
  if (selection instanceof CellSelection) {
    const { $anchorCell, $headCell } = selection;
    const startingCellPos = $anchorCell.pos > $headCell.pos ? $headCell.pos : $anchorCell.pos;
    const newSelection = TextSelection.create(view.state.doc, startingCellPos + 2);
    view.dispatch(view.state.tr.setSelection(newSelection));
  }

  const originalSelectionBox = selectedRect(view.state);
  const { width: originalWidth, height: originalHeight } = originalSelectionBox.map;

  const cell = cellAround(view.state.selection.$from);
  const cellIndex = cellPositions.findIndex((pos) => pos === cell.pos) || 0;
  const pastingRow = Math.floor(cellIndex / numCols);
  const pastingColumn = cellIndex % numCols;

  const originalStyles: {
    pos: number;
    currentRow: number;
    currentColumn: number;
    cellAttrs: Attrs;
    paragraphAttrs: Attrs;
    marks: readonly Mark[];
    type: NodeType;
  }[] = [];

  // get all the original styles of the cells, paragraphs and text to be pasted on
  cellPositions.forEach((pos, index) => {
    const currentRow = Math.floor(index / numCols);
    const currentColumn = index % numCols;
    if (currentRow < pastingRow || currentRow >= pastingRow + pastedHeight) return;
    if (currentColumn < pastingColumn || currentColumn >= pastingColumn + pastedWidth) return;

    const cell = view.state.doc.nodeAt(pos);
    if (!cell) return;

    const { backgroundColor, borderColor, borderWidth } = cell.attrs;
    const cellAttrs = {
      backgroundColor,
      borderColor,
      borderWidth,
    };
    const { marks, paragraphAttrs } = getStyleData(cell);
    const type = cell?.type;

    originalStyles.push({
      pos,
      currentRow,
      currentColumn,
      cellAttrs,
      paragraphAttrs,
      marks,
      type,
    });
  });

  // update the slice to be pasted with the original styles
  if (!!originalStyles.length) {
    let index = 0;
    let table: Slice | ProseMirrorNode = slice;

    if (slice.content.firstChild?.type.name === 'table') table = slice.content.firstChild;

    table.content.forEach((row, rowPos, rowIndex) => {
      row.content.forEach((cell, cellPos, cellIndex) => {
        const tableIndex = pastingColumn + cellIndex;
        if (tableIndex >= originalWidth) return;

        const styles = originalStyles[index];
        if (!styles) return;

        const { cellAttrs, paragraphAttrs, type } = styles;

        (cell.attrs as Attrs) = Object.assign({}, cell.attrs, cellAttrs);
        (cell.type as NodeType) = type;

        cell.content.forEach((paragraph) => {
          (paragraph.attrs as Attrs) = paragraphAttrs;

          paragraph.content.forEach((text) => {
            let { marks, pos } = styles;
            if (!marks.length) {
              marks = getNearestMarks(view.state, pos);
            }
            if (marks.length) (text.marks as readonly Mark[]) = marks;
          });
        });

        index++;
      });
    });
  }

  const result = proseMirrorHandlePaste(view, e, slice);

  if (result) {
    let newSelectionBox = selectedRect(view.state);
    // if there's more columns in the table after the paste, copy and apply styles from the cells to the left
    if (newSelectionBox.map.width !== originalWidth) {
      const tr = view.state.tr;
      const { tableStart } = newSelectionBox;
      const { map: newMap, width: newWidth } = newSelectionBox.map;

      view.state.doc.content.forEach((table) => {
        table.content.forEach((row, rowOffset, rowIndex) => {
          // ignore newly added rows
          if (rowIndex >= originalHeight) return;

          const rightMostColumnIndex = originalWidth - 1 < 0 ? 0 : originalWidth - 1;
          const rightMostCell = row.child(rightMostColumnIndex);
          const { backgroundColor, borderColor, borderWidth } = rightMostCell.attrs;
          const rightMostAttrs = {
            backgroundColor,
            borderColor,
            borderWidth,
          };
          // const rightMostAttrs = rightMostCell.attrs;
          const rightMostType = rightMostCell.type;
          const styles = getStyleData(rightMostCell);
          const { paragraphAttrs } = styles;
          let marks = styles.marks;

          row.content.forEach((cell, cellOffset, columnIndex) => {
            // only check newly added columns
            if (columnIndex < originalWidth) return;
            const cellPos = newMap[rowIndex * newWidth + columnIndex] + tableStart;

            // copy styles from previous cell in row and apply to new columns
            tr.setNodeMarkup(cellPos, rightMostType, Object.assign({}, cell.attrs, rightMostAttrs));

            let newMarks = marks;
            cell.descendants((node, pos) => {
              const absolutePosition = pos + cellPos + tableStart;
              if (node.type.name === 'paragraph') {
                tr.setNodeMarkup(absolutePosition, null, paragraphAttrs);
              }
              if (node.isText) {
                if (!newMarks.length) {
                  const originalRowStyles = originalStyles.filter((style) => style.currentRow === rowIndex);
                  newMarks =
                    originalRowStyles[originalWidth - 1]?.marks || getNearestMarks(view.state, absolutePosition);
                }
                tr.removeMark(absolutePosition, absolutePosition + node.textContent.length);
                newMarks.forEach((mark) => {
                  tr.addMark(absolutePosition, absolutePosition + node.textContent.length, mark);
                });
              }
            });
          });
        });
      });

      // Remove intermediate history step from transaction to avoid double undo
      tr.setMeta('addToHistory', false);
      view.dispatch(tr);
    }

    newSelectionBox = selectedRect(view.state);
    // if there's more rows in the table after the paste, copy and apply styles from the cells above
    if (newSelectionBox.map.height !== originalHeight) {
      const tr = view.state.tr;
      const { tableStart } = newSelectionBox;
      const { map: newMap, width: newWidth } = newSelectionBox.map;
      const attrsAbove: JSONContent[] = [];

      view.state.doc.content.forEach((table) => {
        table.content.forEach((row, rowOffset, rowIndex) => {
          // only check newly added rows
          if (rowIndex < originalHeight) return;

          row.content.forEach((cell, columnOffset, columnIndex) => {
            // copy styles of cells above and apply to new cells
            const bottomRowIndex = originalHeight - 1 < 0 ? 0 : originalHeight - 1;
            const bottomMostCell = table.child(bottomRowIndex).content.child(columnIndex);
            const { backgroundColor, borderColor, borderWidth } = bottomMostCell.attrs;
            const bottomMostAttrs = attrsAbove[columnIndex] || {
              backgroundColor,
              borderColor,
              borderWidth,
            };
            // const bottomMostAttrs = attrsAbove[columnIndex] || bottomMostCell.attrs;
            const bottomMostType = bottomMostCell.type;
            const styles = getStyleData(bottomMostCell);
            const { paragraphAttrs } = styles;
            let marks = styles.marks;

            const cellPos = newMap[rowIndex * newWidth + columnIndex] + tableStart;

            // copy styles from previous cell in row and apply to new columns
            tr.setNodeMarkup(cellPos, bottomMostType, Object.assign({}, cell.attrs, bottomMostAttrs));

            let newMarks = marks;
            cell.descendants((node, pos) => {
              const absolutePosition = pos + cellPos + tableStart;
              if (node.type.name === 'paragraph') {
                tr.setNodeMarkup(absolutePosition, null, paragraphAttrs);
              }
              if (node.isText) {
                if (!newMarks.length) {
                  const originalRowStyles = originalStyles.filter((style) => style.currentRow === rowIndex);
                  newMarks =
                    originalRowStyles[originalWidth - 1]?.marks || getNearestMarks(view.state, absolutePosition);
                }
                tr.removeMark(absolutePosition, absolutePosition + node.textContent.length);
                newMarks.forEach((mark) => {
                  tr.addMark(absolutePosition, absolutePosition + node.textContent.length, mark);
                });
              }
            });
            if (!attrsAbove[columnIndex]) attrsAbove[columnIndex] = bottomMostAttrs;
          });
        });
      });

      // Remove intermediate history step from transaction to avoid double undo
      tr.setMeta('addToHistory', false);
      view.dispatch(tr);
    }

    return true;
  } else {
    return false;
  }
};

/**
 * Checks whether a given node is a list or other type of block
 * @param {object} node the node to be checked
 */
const isList = (editor: Editor, node: ProseMirrorNode) => {
  return node.type === editor.schema.nodes.bulletList || node.type === editor.schema.nodes.orderedList;
};

/**
 * Wraps the current selection in a list of the given type
 * @param type the type of list
 * @param from the position to check from
 * @param selection the entire selection
 */
const wrapInList = (editor: Editor, type: NodeType, from: number, selection: Selection, offset: number = 0) => {
  const LIST_ITEM_TYPE = editor.schema.nodes.listItem;
  let newPos = from;

  const originalTableSize = editor.view.state.doc.child(0).nodeSize;

  editor.view.state.doc.nodesBetween(from, selection.to + offset, (node, pos) => {
    if (newPos !== from) return;

    // if different list type, switch it to the given type
    if (isList(editor, node) && node.type !== type) {
      const $pos = editor.view.state.doc.resolve(pos);
      const { tr } = editor.view.state;
      tr.setNodeMarkup(pos, type);
      editor.view.dispatch(tr);
      if ($pos.nodeBefore?.type === type) {
        editor
          .chain()
          .setTextSelection(pos + 1)
          .joinBackward()
          .run();
        newPos = pos;
      }
    } else if (node.type.name === 'paragraph') {
      const $pos = editor.view.state.doc.resolve(pos);
      // if the paragraph is already in a list, ignore it
      if ($pos.parent.type === LIST_ITEM_TYPE) return;

      // if there's a list of the same type before, join this list item to it, otherwise wrap it in its own list
      wrapSingleItemInList(editor, type, $pos.pos, $pos.nodeBefore?.type === type);
      newPos = pos;
    }
  });

  const newTableSize = editor.view.state.doc.child(0).nodeSize;
  const newOffset = offset + (newTableSize - originalTableSize);

  if (newPos !== from) wrapInList(editor, type, newPos, selection, newOffset);
};

const liftListItem = (editor: Editor, pos: number) => {
  const LIST_ITEM_TYPE = editor.schema.nodes.listItem;
  editor
    .chain()
    .setTextSelection({ from: pos, to: pos + 1 })
    .liftListItem(LIST_ITEM_TYPE)
    .run();
};
const wrapSingleItemInList = (editor: Editor, type: NodeType, pos: number, joinBackward: boolean = false) => {
  editor
    .chain()
    .setTextSelection({ from: pos, to: pos + 1 })
    .wrapInList(type)
    .command(({ state, dispatch }) => {
      if (joinBackward) return _joinBackward(state, dispatch);
      return false;
    })
    .run();
};

/**
 * Toggles a list type on/off or switches one list type to another
 * @param {NodeType} type the type of list to toggle
 */
const doToggleList = (editor: Editor, type: NodeType, toList: boolean = false) => {
  const LIST_ITEM_TYPE = editor.schema.nodes.listItem;
  const { state } = editor.view;
  const { selection, doc } = state;

  // if there are any nodes that aren't in a list, wrap them in lists and ignore the other nodes
  doc.nodesBetween(selection.from, selection.to, (node, pos) => {
    if (node.type.name === 'paragraph') {
      const $pos = doc.resolve(pos);
      if ($pos.parent.type === LIST_ITEM_TYPE) return;
      toList = true;
    }
  });

  if (toList) {
    wrapInList(editor, type, selection.from, selection);
  } else {
    // if selection is collapsed
    if (selection instanceof TextSelection && selection.$cursor) {
      // find the nearest parent list from cursor position
      const $cursor = selection.$cursor;
      let parentList: ProseMirrorNode = $cursor.node($cursor.depth);
      let listItem: ProseMirrorNode = $cursor.node($cursor.depth);
      let textNodePos = $cursor.pos - $cursor.parentOffset;
      let listDepth, listItemDepth;
      for (listDepth = $cursor.depth - 1; listDepth >= 1 && !isList(editor, parentList); listDepth--) {
        parentList = $cursor.node(listDepth);
      }
      for (listItemDepth = $cursor.depth - 1; listItemDepth >= 1 && listItem.type !== LIST_ITEM_TYPE; listItemDepth--) {
        listItem = $cursor.node(listItemDepth);
      }

      let listPos = -1;
      editor.view.state.doc.descendants((node, pos) => {
        if (node === parentList) listPos = pos;
      });

      // switch the parent list to the new type, or lift all its items out of it
      if (isList(editor, parentList) && parentList.type !== type) {
        if (listDepth >= 4 || listItem.childCount > 1) {
          const { tr } = editor.view.state;
          tr.setNodeMarkup(listPos, type);
          editor.view.dispatch(tr);
        } else {
          liftListItem(editor, textNodePos);
          wrapSingleItemInList(editor, type, textNodePos);
        }
      } else {
        liftListItem(editor, textNodePos);
      }
    } else {
      let offset = 0;
      editor.view.state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
        const originalDocSize = editor.view.state.doc.nodeSize;
        if (node.type.name === 'paragraph') {
          const $node = editor.view.state.doc.resolve(pos + offset);

          let parentList: ProseMirrorNode = $node.node($node.depth);
          let listDepth;
          for (listDepth = $node.depth - 1; listDepth >= 1 && !isList(editor, parentList); listDepth--) {
            parentList = $node.node(listDepth);
          }
          let listPos = 0;
          editor.view.state.doc.descendants((node, pos) => {
            if (node === parentList) listPos = pos;
          });
          // switch the list to the new type, or lift all its items out of it
          if (isList(editor, parentList) && parentList.type !== type) {
            if (listDepth >= 4 || $node.parent.childCount > 1) {
              const { tr } = editor.view.state;
              tr.setNodeMarkup(listPos + offset, type);
              editor.view.dispatch(tr);

              if ($node.nodeBefore?.type === type) {
                editor
                  .chain()
                  .setTextSelection(pos + offset + 1)
                  .joinBackward()
                  .run();
              }
            } else {
              liftListItem(editor, pos + offset);
              wrapSingleItemInList(editor, type, pos + offset);

              const $parent = editor.view.state.doc.resolve(pos);
              if ($parent.nodeBefore?.type === type) {
                editor
                  .chain()
                  .setTextSelection(pos + offset + 1)
                  .joinBackward()
                  .run();
              }
            }
          } else {
            liftListItem(editor, pos + offset);

            const $parent = editor.view.state.doc.resolve(pos);
            if ($parent.nodeBefore?.type === type) {
              editor
                .chain()
                .setTextSelection(pos + offset + 1)
                .joinBackward()
                .run();
            }
          }
        }
        const newDocSize = editor.view.state.doc.nodeSize;
        offset = offset + (newDocSize - originalDocSize);
      });
    }
  }
};

/**
 * Toggles a list type on/off or switches one list type to another
 * @param {NodeType} type the type of list to toggle
 */
const toggleList = (editor: Editor, type: NodeType) => {
  if (editor.view.state.selection instanceof CellSelection) {
    const LIST_ITEM_TYPE = editor.schema.nodes.listItem;
    const originalSelectionBox = selectedRect(editor.view.state);
    const selectedCellPositions: number[] = originalSelectionBox.map.cellsInRect(originalSelectionBox);
    const selectedCellIndices = selectedCellPositions.map((cellPos) =>
      originalSelectionBox.map.map.findIndex((pos) => pos === cellPos),
    );

    let toList = false;
    const textPositions: { cellPos: number; from: number; to: number }[] = [];

    selectedCellIndices.forEach((index) => {
      const selectionBox = selectedRect(editor.view.state);
      const currentCellPos = selectionBox.map.map[index] + selectionBox.tableStart;
      const cell = editor.view.state.doc.nodeAt(currentCellPos);
      let firstTextPos = -1;
      let lastTextPos = -1;

      // find the first and last text positions
      cell?.descendants((node: ProseMirrorNode, pos: number) => {
        if (node.isText && firstTextPos < 0) firstTextPos = pos;
        if (node.isText) lastTextPos = pos + node.nodeSize;
      });

      // if no text in cell, continue to next cell
      if (firstTextPos < 0) return;

      cell?.nodesBetween(firstTextPos, lastTextPos, (node, pos) => {
        if (node.type.name === 'paragraph') {
          const $pos = cell.resolve(pos);
          if ($pos.parent.type === LIST_ITEM_TYPE) return;
          toList = true;
        }
      });

      textPositions.push({ cellPos: currentCellPos, from: firstTextPos, to: lastTextPos });
    });

    let offset = 1;
    textPositions.forEach((position) => {
      const originalTableSize = editor.view.state.doc.child(0).nodeSize;
      const { cellPos, from, to } = position;
      // update selection to the text in this cell, and proceed with list toggle
      const newSelection = TextSelection.create(editor.view.state.doc, from + cellPos + offset, to + cellPos + offset);
      const tr = editor.view.state.tr;
      tr.setSelection(newSelection);
      tr.setMeta('addToHistory', false);

      editor.view.dispatch(tr);
      doToggleList(editor, type, toList);
      const newTableSize = editor.view.state.doc.child(0).nodeSize;
      offset = offset + (newTableSize - originalTableSize);
    });

    // reset the selection to the original cell selection
    const newSelectionBox = selectedRect(editor.view.state);
    const firstCellPos = newSelectionBox.map.map[selectedCellIndices[0]] + newSelectionBox.tableStart;
    const lastCellPos =
      newSelectionBox.map.map[selectedCellIndices[selectedCellIndices.length - 1]] + newSelectionBox.tableStart;
    editor.commands.setCellSelection({ anchorCell: firstCellPos, headCell: lastCellPos });
  } else {
    doToggleList(editor, type);
  }
  return true;
};

export {
  getAllTextContents,
  getDominantTextStyleByColor,
  getTableData,
  updateAllCellBorderStyle,
  updateCellAttrs,
  updateColumnAttrsLeft,
  updateColumnAttrsRight,
  updateRowAttrsBelow,
  updateRowAttrsAbove,
  getClosestCellAttributes,
  handlePaste,
  toggleList,
  isList,
};

import { Node } from '@tiptap/core';

/**
 * This is a custom document node for the table widget.
 * It only accepts a table node as its content.
 */
export const Document = Node.create({
  name: 'doc',
  topNode: true,
  content: 'table',
});

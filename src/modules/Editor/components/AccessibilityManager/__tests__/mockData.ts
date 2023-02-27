import { TreeNode } from '../../../../../types/structuredContentTypes';
import { WidgetType } from '../../../../../types/widget.types';
import { generateWidgetId } from '../../../../../widgets/Widget.helpers';

const mockIds = [
  generateWidgetId(WidgetType.Text),
  generateWidgetId(WidgetType.Icon),
  generateWidgetId(WidgetType.Image),
];

const mockStructureTree = [
  'div',
  {},
  [
    ['p', {}, mockIds[0]],
    ['img', {}, mockIds[1]],
    ['svg', {}, mockIds[2]],
  ],
] as TreeNode[];

const nestedMockStructureTree = [
  'div',
  {},
  [
    [
      'div',
      {},
      [
        ['p', {}, mockIds[0]],
        ['svg', {}, mockIds[1]],
      ],
    ],
    ['img', {}, mockIds[2]],
  ],
] as TreeNode[];

export { mockIds, mockStructureTree, nestedMockStructureTree };

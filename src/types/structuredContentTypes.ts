import { WidgetId } from './idTypes';

type ContainerTags = 'div' | 'h1';
type TagOptions = {};
type TreeNode = [ContainerTags, TagOptions, TreeNode[] | WidgetId];

export type { TreeNode };

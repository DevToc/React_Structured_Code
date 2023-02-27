import cloneDeep from 'lodash.clonedeep';
import { WidgetId } from '../../../../types/idTypes';
import { TreeNode } from '../../../../types/structuredContentTypes';
import { AccessibleElement, WidgetType } from '../../../../types/widget.types';
import { findAllPropertyValues } from '../../../../utils/findAllPropertyValues';
import { ArrowStyleTypes, LineWidgetData } from '../../../../widgets/LineWidget/LineWidget.types';
import { TextWidgetData } from '../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { TextWidgetTag } from '../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { AllWidgetData } from '../../../../widgets/Widget.types';
import { ALT_TEXT_WIDGET_TYPES } from './AccessibilityChecker/AlternativeTextChecker/AlternativeTextChecker.helpers';
import { DEFAULT_LABEL, LineWidgetArrowType, WidgetIconMap } from './AccessibilityManager.config';
import { AccessibilityCheckers, NonTextWidgetTag } from './AccessibilityManager.types';
import { WidgetsMap } from 'types/infographTypes';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';
import { ComponentWidgetIdKeys as ResponsiveTextComponentKeys } from 'widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidget.types';
import { StatChartWidgetData } from 'widgets/ResponsiveWidgets/StatChartWidget/StatChartWidget.types';

const TAGS_ENABLED_CHECKERS = [AccessibilityCheckers.alternativeText, AccessibilityCheckers.headings];

// List of Widget types that represents tags for each checkers
const WIDGET_TYPES_FOR_TAG: { [key: string]: WidgetType[] } = {
  [AccessibilityCheckers.alternativeText]: ALT_TEXT_WIDGET_TYPES,
  [AccessibilityCheckers.headings]: [WidgetType.Text],
};

/**
 * A line style that excludes default 'none'
 */
const ArrowLineStyleTypes = Object.values(ArrowStyleTypes).filter((v) => v !== ArrowStyleTypes.none);

/**
 * Check whether line widget has arrow style
 *
 * @param widgetData - Widget data
 * @returns
 */
const isArrowLine = (widgetData: LineWidgetData): boolean =>
  ArrowLineStyleTypes.filter((v) => v === widgetData?.startArrowStyle || v === widgetData?.endArrowStyle).length > 0;

/**
 * Get the widget id of the widget whose data should be used when rendering the label
 * in the Reading order tab. The widget data will be passed to the 'getLabel' fn.
 *
 * Useful for responsive widgets that have different members.
 *
 * @param widgetId
 * @param widgets
 * @returns widget id
 */
const getLabelWidgetId = (widgetId: WidgetId, widgets: WidgetsMap): WidgetId => {
  let labelWidgetId = widgetId;
  const widgetType = getWidgetTypeFromId(widgetId);
  switch (widgetType) {
    case WidgetType.ResponsiveText: {
      // Responsive text should display the same as the text widget
      const widgetData = widgets[widgetId] as ResponsiveWidgetBaseData;
      labelWidgetId = widgetData?.componentWidgetIdMap[ResponsiveTextComponentKeys.Text];
      break;
    }
    default:
      break;
  }
  return labelWidgetId;
};

/**
 * Get the corresponding Icon component base on widget id and its subtype
 *
 * @param id - Widget id
 * @param widgetData - Widget data
 * @returns
 */
const getIconType = (id: WidgetId, widgetData: AllWidgetData): keyof WidgetIconMap => {
  const widgetType = getWidgetTypeFromId(id);

  if (widgetType === WidgetType.StatChart) return (widgetData as StatChartWidgetData).type;

  if (isArrowLine(widgetData as LineWidgetData)) return LineWidgetArrowType.arrow;

  return widgetType;
};

/**
 * Find raw text from text widget data.
 * All html tag will stripe out and up to 100 length by default.
 *
 * @param widgetData - Widget data
 * @param maxLength  - Max text length
 * @returns  Raw widget text
 */
const getTextWidgetLabel = (widgetData: TextWidgetData, maxLength = 100): string => {
  const texts = findAllPropertyValues(widgetData.proseMirrorData, ['text']);

  return texts
    .map((text) => String(text))
    .join('')
    .replace(/(<([^>]+)>)/gi, '')
    .substring(0, maxLength);
};

/**
 * Get the accessibility alt text or raw text from widget data.
 *
 * @param id - Widget id
 * @param widgetData - Widget data
 * @returns  Accessible alt text or raw text from widget
 */
const getLabel = (id: WidgetId, widgetData: AllWidgetData): string => {
  const widgetType = id.substring(0, 3) as WidgetType;

  switch (widgetType) {
    case WidgetType.Image:
      return `Image: ${(widgetData as AccessibleElement).altText || DEFAULT_LABEL}`;
    case WidgetType.Icon:
      return `Icon: ${(widgetData as AccessibleElement).altText || DEFAULT_LABEL}`;
    case WidgetType.BasicShape:
      return `Shape: ${(widgetData as AccessibleElement).altText || DEFAULT_LABEL}`;
    case WidgetType.Line: {
      const lineWidgetData = widgetData as LineWidgetData;
      return `${isArrowLine(lineWidgetData) ? 'Arrow' : 'Line'}: ${
        (widgetData as AccessibleElement).altText || DEFAULT_LABEL
      }`;
    }
    case WidgetType.Text:
      return `Text: ${getTextWidgetLabel(widgetData as TextWidgetData)}`;
    case WidgetType.Table:
      return 'Table';
    case WidgetType.AreaChart:
    case WidgetType.PieChart:
    case WidgetType.LineChart:
    case WidgetType.BarChart:
    case WidgetType.ColumnChart:
    case WidgetType.StackedAreaChart:
    case WidgetType.StackedBarChart:
    case WidgetType.StackedColumnChart:
      return `Chart: ${(widgetData as AccessibleElement).altText || DEFAULT_LABEL}`;
    case WidgetType.ResponsiveText:
      return `Text: ${getTextWidgetLabel(widgetData as TextWidgetData)}`;
    case WidgetType.StatChart:
      return `Chart: ${(widgetData as AccessibleElement).altText || DEFAULT_LABEL}`;
    default:
      break;
  }

  return '';
};

/**
 * Get all leaf node's widget id from giving page structure tree as list of widget id.
 *
 * @param node - Page structure tree
 * @returns  List of widget ids in logical order
 */
const getLeafNodes = (node: TreeNode | TreeNode[]): string[] => {
  if (!node || !Array.isArray(node)) return [];

  const [, , childNode] = node as TreeNode;

  if (typeof childNode === 'string' && childNode) {
    return [childNode];
  }

  return (node as TreeNode[]).reduce((result, node: TreeNode) => result.concat(getLeafNodes(node)), [] as string[]);
};

/**
 * Find a widget structure node from giving page structure tree that contains giving widget id.
 *
 * @param node - Structure tree
 * @param nodeId - Widget Id
 * @returns  The widget structure node
 */
const findNode = (node: TreeNode | TreeNode[], nodeId?: string): TreeNode | undefined => {
  if (!node || !Array.isArray(node) || !nodeId) return;

  const [, , childNodes] = node as TreeNode;

  if (Array.isArray(childNodes)) {
    return childNodes.find((childNode) => {
      const [, , id] = childNode as TreeNode;
      return typeof id === 'string' && id === nodeId;
    });
  }

  return node
    .map((child) => findNode(child as TreeNode))
    .filter((child) => child)
    .pop();
};

/**
 * Remove a widget structure node from giving page structure tree that match giving widget id.
 * Note: giving page structure tree will be modified in place.
 *
 * @param node - Structure tree
 * @param nodeId - Widget Id
 * @returns
 */
const removeNode = (node: TreeNode | TreeNode[], nodeId?: string): void => {
  if (!node || !Array.isArray(node) || !nodeId) return;

  const [, , childNodes] = node as TreeNode;

  if (Array.isArray(childNodes) && childNodes.length > 0) {
    for (const [index, childNode] of childNodes.entries()) {
      const [, , id] = childNode;
      if (typeof id === 'string' && id === nodeId) {
        childNodes.splice(index, 1);
        return;
      }
    }
  }

  node.forEach((child) => removeNode(child as TreeNode));
};

/**
 * Insert a widget structure node before target node to page structure tree.
 * Note: giving page structure tree will be modified in place.
 *
 * @param tree - Structure tree
 * @param node - Widget structure node
 * @param targetNodeId - Widget id
 * @returns
 */
const insertNodeBefore = (tree: TreeNode | TreeNode[], node: TreeNode | TreeNode[], targetNodeId: WidgetId): void => {
  if (!tree || !Array.isArray(tree) || !targetNodeId) return;

  const [, , childNodes] = tree as TreeNode;

  if (Array.isArray(childNodes) && childNodes.length > 0) {
    for (const [index, childNode] of childNodes.entries()) {
      const [, , id] = childNode;
      if (typeof id === 'string' && id === targetNodeId) {
        childNodes.splice(index, 0, node as TreeNode);
        return;
      }
    }
  }

  node.forEach((child) => insertNodeBefore(child as TreeNode, node, targetNodeId));
};

/**
 * Insert a widget structure node after target node to page structure tree.
 * Note: giving page structure tree will be modified in place.
 *
 * @param tree - Structure tree
 * @param node - Widget structure node
 * @param targetNodeId - Widget id
 * @returns
 */
const insertNodeAfter = (tree: TreeNode | TreeNode[], node: TreeNode | TreeNode[], targetNodeId: WidgetId): void => {
  if (!tree || !Array.isArray(tree) || !targetNodeId) return;

  const [, , childNodes] = tree as TreeNode;

  if (Array.isArray(childNodes) && childNodes.length > 0) {
    for (const [index, childNode] of childNodes.entries()) {
      const [, , id] = childNode;
      if (typeof id === 'string' && id === targetNodeId) {
        childNodes.splice(index + 1, 0, node as TreeNode);
        return;
      }
    }
  }

  node.forEach((child) => insertNodeAfter(child as TreeNode, node, targetNodeId));
};

/**
 * Swap source node with target node from giving node.
 * Note: input page structure tree will not be modified.
 *
 * @param node - Structure tree
 * @param sourceNodeId - Source node widget id
 * @param targetNodeId - Target node widget id
 * @param isInsertBefore - insert position flag
 * @returns  A new copy of page structure tree
 */
const reOrderStructureTree = (
  node: TreeNode | TreeNode[],
  sourceNodeId: WidgetId,
  targetNodeId: WidgetId,
  isInsertBefore = true,
): TreeNode | TreeNode[] | undefined => {
  const foundSourceNode = findNode(node, sourceNodeId);
  if (!foundSourceNode) return;

  const foundTargetNode = findNode(node, targetNodeId);
  if (!foundTargetNode) return;

  const newNode = cloneDeep(node);
  removeNode(newNode, sourceNodeId);

  if (isInsertBefore) {
    insertNodeBefore(newNode, foundSourceNode, targetNodeId);
  } else {
    insertNodeAfter(newNode, foundSourceNode, targetNodeId);
  }

  return newNode;
};

/**
 * Returns either non text tags(alt or decorative) or text tags based on widget type.
 * Returns null if widget type didn't fall in none of the categories
 * @param widgetType
 * @param textTag
 * @param isDecorative
 * @param altText
 *
 * @returns non text widget tag or text tag or null
 */
const getTag = (
  widgetType: WidgetType,
  textTag: TextWidgetTag,
  isDecorative: boolean,
  altText: string,
): TextWidgetTag | NonTextWidgetTag | null => {
  const nonTextTypes = WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.alternativeText];

  if (widgetType === WidgetType.Text) return textTag;

  if (nonTextTypes.includes(widgetType)) {
    if (isDecorative) return NonTextWidgetTag.Decorative;

    if (typeof altText === 'string' && altText !== '') {
      return NonTextWidgetTag.Alt;
    }

    return NonTextWidgetTag.MissingAlt;
  }

  return null;
};

/**
 * Check if newly selected checker's taggable widget types
 * match with each checker's assigned taggable widget types
 * @param taggedTypes - taggable widget types of each a11y checker, currently only Headings and Alternative Text
 * @param selectedTypes - selected checker's taggable widget types
 * @returns True if tagged types don't match with selected types
 */
const isTaggedTypesChanged = (taggedTypes: WidgetType[], selectedTypes: WidgetType[]): boolean => {
  if (taggedTypes.length !== selectedTypes.length) return true;

  return selectedTypes.some((type: WidgetType) => !taggedTypes.includes(type));
};

export {
  WIDGET_TYPES_FOR_TAG,
  TAGS_ENABLED_CHECKERS,
  getIconType,
  getLabel,
  getLeafNodes,
  reOrderStructureTree,
  getTextWidgetLabel,
  getTag,
  getLabelWidgetId,
  isTaggedTypesChanged,
};

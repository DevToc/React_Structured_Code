import clonedeep from 'lodash.clonedeep';
import mergeWith from 'lodash.mergewith';

import { Widget } from 'types/widget.types';
import { AllWidgetData } from 'widgets/Widget.types';
import { Subset } from 'types/object.types';
import { PageId, WidgetId } from 'types/idTypes';
import { InfographState } from 'types/infographTypes';
import { GroupWidgetData, WidgetFontProperty, WidgetMap } from 'widgets/Widget.types';
import { findAllPropertyValues } from 'utils/findAllPropertyValues';
import { generateWidgetId, getPageWidgetIds, getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { ResponsiveWidgetBaseData } from 'widgets/ResponsiveWidgets/ResponsiveWidgetBase.types';
import { AddGroupWidget, AddWidget } from 'modules/Editor/store/infographSlice.types';

/**
 * Moves an element in the array by one position, or to beginning, or end (in place?)
 *
 * If element is not found, nothing happens. (may be warn?)
 *
 * @param a Array (immr array)
 * @param el Element to move
 * @param dir direction
 */
export function moveElementInArray<T>(a: Array<T>, el: T, dir: 'left' | 'right' | 'first' | 'last') {
  // Where the element is in the array
  const targetIndex = a.indexOf(el);

  if (targetIndex < 0) {
    // target not found, nothing to do
    return;
  }

  switch (dir) {
    case 'left':
      if (targetIndex < 1) {
        // already at front, nothing to do
        break;
      } else {
        a.splice(targetIndex, 1);
        a.splice(targetIndex - 1, 0, el);
      }
      break;
    case 'right':
      if (targetIndex + 1 >= a.length) {
        // already at last, nothing to do
        break;
      } else {
        a.splice(targetIndex, 1);
        a.splice(targetIndex + 1, 0, el);
      }
      break;
    case 'first':
      if (targetIndex === 0) {
        // already first, nothing to do
        break;
      } else {
        // insert at beginning
        a.splice(targetIndex, 1);
        a.splice(0, 0, el);
      }
      break;
    case 'last':
      if (targetIndex === a.length - 1) {
        // already last, nothing to do
        break;
      } else {
        // append to last
        a.splice(targetIndex, 1);
        a.push(el);
      }
      break;
  }
}

/**
 *
 * @param node
 * @param widgetId
 * @param positionedNextTo If present, the new Widget ID will be added next to this Widget ID in the array, instead of last.
 */
export function addToLeafTree(
  node: [string, {}, Array<any> | string],
  widgetId: WidgetId,
  positionedNextTo: WidgetId = '',
) {
  const [, , l] = node;
  if (typeof l !== 'string') {
    const targetIndex = l.findIndex((elem) => elem[2] === positionedNextTo);

    const insertIndex = targetIndex === -1 ? l.length : targetIndex + 1; // If not found, push last.
    l.splice(insertIndex, 0, ['div', {}, widgetId]);
  }
}

export function removeFromTree(node: [string, {}, Array<any> | string], widgetId: WidgetId) {
  const [, , l] = node;
  let removeIndex = -1;

  // do nothing if leaf is not an array
  if (!l) return;

  // this node is already leaf, cannot remove this case... ? should this return empty array?
  if (typeof l === 'string') return;

  for (let i = 0; i < l.length; ++i) {
    const [, , ll] = l[i];
    if (ll === widgetId) {
      removeIndex = i;
      break;
    }
  }

  if (removeIndex !== -1) {
    l.splice(removeIndex, 1);
    return;
  }

  // not found, so recursively remove from all child
  for (const ll of l) {
    removeFromTree(ll, widgetId);
  }
}

// Mutates the state and removes the widget from all places
export const removeWidgetById = (widgetId: WidgetId, state: InfographState, pageId: PageId) => {
  const { widgetLayerOrder, widgetStructureTree } = state.pages[pageId];
  const widget = state.widgets[widgetId];

  if (widget) {
    // Remove from widget map
    delete state.widgets[widgetId];
  } else {
    console.warn(`No delete, Widget ${widgetId} not found in widgets map!`);
  }

  // Remove from layer order
  if (widgetLayerOrder) {
    const widgetIndex = widgetLayerOrder.findIndex((w) => w === widgetId);
    if (widgetIndex !== -1) widgetLayerOrder.splice(widgetIndex, 1);
  }

  // Remove from the content structure
  if (widgetStructureTree) {
    removeFromTree(widgetStructureTree, widgetId);
  }
};

/**
 * @param state
 * @param widget New widget data
 * @param positionedNextTo If present, the new widget will be positioned next to this widget ID in Reading Order and Layer Order
 * @param isGroupMember If the widget is group member
 */
export const addWidgetToState = (
  state: InfographState,
  widget: AddWidget,
  positionedNextTo: WidgetId = '',
  isGroupMember?: boolean,
) => {
  const { pageId, widgetId, widgetData, groupWidgets, isResponsiveGroup } = widget;
  const { widgetLayerOrder, widgetStructureTree } = state.pages[pageId];
  const isGroup = groupWidgets && groupWidgets.length;

  state.widgets[widgetId] = widgetData;

  // Add to layer - group members are not added to the layer order
  if (widgetLayerOrder && !isGroupMember) {
    const targetIndex = widgetLayerOrder.indexOf(positionedNextTo);
    const insertIndex = targetIndex === -1 ? widgetLayerOrder.length : targetIndex + 1; // If not found, push last.
    widgetLayerOrder.splice(insertIndex, 0, widgetId);
  }

  if (positionedNextTo && widgetStructureTree) {
    addToLeafTree(widgetStructureTree, widgetId, positionedNextTo);
  }

  // Add to tree structure
  if (!positionedNextTo && widgetStructureTree && (!isGroup || isResponsiveGroup)) {
    addToLeafTree(widgetStructureTree, widgetId);
  }

  if (isGroup) {
    groupWidgets.forEach((groupWidget: AddGroupWidget) => {
      const { widgetId, widgetData, groupWidgets } = groupWidget;
      // group widgets are not added to the widgetLayerOrder
      state.widgets[widgetId] = widgetData;

      // Add nested members to state.widgets
      if (groupWidgets) {
        groupWidgets.forEach((nestedGroupWidget: AddGroupWidget) => {
          const { widgetId: nestedWidgetId, widgetData: nestedWidgetData } = nestedGroupWidget;
          state.widgets[nestedWidgetId] = nestedWidgetData;
        });
      }

      // Add to tree structure
      if (widgetStructureTree && !isResponsiveGroup) addToLeafTree(widgetStructureTree, widgetId);
    });
  }
};

export function replaceInTree(node: [string, {}, Array<any> | string], widgetId: WidgetId, replaceId: WidgetId) {
  if (!node) {
    return;
  }

  const [, , l] = node;

  if (!l) return;
  if (typeof l === 'string') return;

  for (let i = 0; i < l.length; ++i) {
    const [, , ll] = l[i];

    if (ll === widgetId) {
      l[i][2] = replaceId;
      break;
    }
  }

  for (const ll of l) {
    replaceInTree(ll, widgetId, replaceId);
  }
}

/**
 * Find all font familes from giving infograph page
 *
 * @param infograph A infograph state
 * @param pageId - A page id
 * @returns  A list of font families
 */
export const findFontsInPage = (infograph: InfographState, pageId: string): string[] => {
  if (!pageId || !infograph?.pages?.[pageId]) return [];

  const allPageWidgetIds = getPageWidgetIds(infograph?.pages?.[pageId], infograph.widgets);
  const allPageWidgets = allPageWidgetIds.map((id) => infograph.widgets[id]);

  return findAllPropertyValues(allPageWidgets, Object.values(WidgetFontProperty)) as string[];
};

/**
 * Mutates the state and duplicates the member widgets of a group
 * Handles case when member widget is a parent (i.e. responsive widget)
 *
 * @param infograph state.infograph - will be updated
 * @param duplicatePageWidgets - page widget map
 * @param newWidgetStructureTree - widget structure tree will be updated
 *
 * @param memberWidgetIds - members to duplicate
 * @param parentWidget
 * @param parentWidgetId
 * @param isResponsiveGroup
 */
export const duplicateNestedMemberWidgets = (
  infograph: InfographState,
  duplicatePageWidgets: WidgetMap,
  newWidgetStructureTree: [string, {}, Array<any> | string],
  memberWidgetIds: WidgetId[],
  parentWidget: GroupWidgetData | ResponsiveWidgetBaseData,
  parentWidgetId: WidgetId,
  isResponsiveGroup: boolean,
) => {
  memberWidgetIds.forEach((mwId: WidgetId) => {
    const newWidgetType = getWidgetTypeFromId(mwId);
    const newWidgetId = generateWidgetId(newWidgetType);
    let newWidget = clonedeep(duplicatePageWidgets[mwId]);

    replaceInTree(newWidgetStructureTree, mwId, newWidgetId);

    // if nested, duplicate widget members, update memberWidgetIds, update componentWidgetIdMap
    let newNestedWidget = newWidget;
    if (newWidget.hasOwnProperty('memberWidgetIds')) {
      newNestedWidget = {
        ...newWidget,
        memberWidgetIds: [],
        componentWidgetIdMap: {},
      } as ResponsiveWidgetBaseData;

      duplicateNestedMemberWidgets(
        infograph,
        duplicatePageWidgets,
        newWidgetStructureTree,
        (newWidget as GroupWidgetData).memberWidgetIds,
        newNestedWidget as ResponsiveWidgetBaseData,
        mwId,
        true,
      );
      newWidget = newNestedWidget;
    }

    infograph.widgets[newWidgetId] = newWidget;
    parentWidget.memberWidgetIds.push(newWidgetId);

    if (isResponsiveGroup) {
      const { componentWidgetIdMap } = duplicatePageWidgets[parentWidgetId] as ResponsiveWidgetBaseData;
      const componentKey = Object.keys(componentWidgetIdMap).find((key) => componentWidgetIdMap[key] === mwId);
      if (componentKey) {
        (parentWidget as ResponsiveWidgetBaseData).componentWidgetIdMap[componentKey] = newWidgetId;
      }
    }
  });
};

/**
 * Update a widget with new properties.
 * The update is recursive and uses lodash.mergeWith
 *
 * @param widget widget that should be updated
 * @param newWidgetData - subset of widget data that should be updated
 *
 * e.g.
 * widget = { border: { color: 'red', weight: 10,  } }
 * newWidgetData = { border: { color: 'blue' } }
 *
 * result -> { border: { color: 'blue', weight: 10 } }
 *
 */

export const mergeWidgetData = (widget: Widget, newWidgetData: Subset<AllWidgetData>) =>
  // recursive merge properties for nested widget data
  // overwrite array properties
  mergeWith(widget, newWidgetData, (a, b) => (Array.isArray(b) ? b : undefined));

import { WidgetType } from 'types/widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { WidgetId } from '../../types/idTypes';

type MemberIndexPosition = number;
type WidgetMetadata = {
  isResponsiveWidgetBase: boolean;
  memberCount?: number;
} | null;

/**
 * A singleton in memory { widgetid - parentid } cache
 * used for checking if a widget id belongs to another widget.
 *
 * Format:
 * {
 *  [widgetId]: [widgetId, groupId, idx, widgetMetadata]
 * }
 * - widgetId is the id of the widget
 * - groupId is the id of the group the widget belongs to
 *   - See getParentId and getParentIdNested for behaviour
 * - idx is the index of the member in the group
 *   - See getGroupIdx for behaviour with nested groups
 * - widgetMetadata - contains additional info regarding responsive groups
 */
class GroupIdCache {
  private idMap: Map<WidgetId, [WidgetId, MemberIndexPosition, WidgetMetadata]>;
  private static instance: GroupIdCache;

  constructor() {
    this.idMap = new Map();
  }

  add = (widgetId: WidgetId, groupId: WidgetId, idx: number, widgetMetadata?: WidgetMetadata) => {
    this.idMap.set(widgetId, [groupId, idx, widgetMetadata || null]);
  };

  /**
   * Returns true if the widget is a responsive widget base container
   */
  isResponsiveWidgetBase = (widgetId: WidgetId): boolean => {
    return !!this.idMap.get(widgetId)?.[2]?.isResponsiveWidgetBase;
  };

  /**
   * Returns memberCount for responsive widgets
   *
   * @param widgetId
   * @returns
   */
  getMemberCount = (widgetId: WidgetId) => {
    return (this.isResponsiveWidgetBase(widgetId) && this.idMap.get(widgetId)?.[2]?.memberCount) || 0;
  };

  /**
   * Returns the immediate parent widget of widgetId if exists
   * For responsive widget members, will return the id of the responsive widget
   *
   * Example:
   * ResponsiveGroupA: Widget1, Widget2
   * GroupA: ResponsiveGroupA, Widget3
   *
   * getParentId(Widget1) -> ResponsiveGroupA
   * getParentId(ResponsiveGroupA) -> GroupA
   * getParentId(Widget3) -> GroupA
   */
  getParentId = (widgetId: WidgetId): WidgetId | undefined => {
    return this.idMap.get(widgetId)?.[0];
  };

  /**
   * Gets the oldest ancestor for the given widget id.
   *
   * Example:
   * ResponsiveGroupA: Widget1, Widget2
   * GroupA: ResponsiveGroupA, Widget3
   *
   * getParentIdNested(Widget1) -> GroupA
   * getParentIdNested(Widget2) -> GroupA
   *
   * Note: Currently only supports a single level of nesting to handle the case where
   * there is a responsive group in a regular group.
   */
  getParentIdNested = (widgetId: WidgetId): WidgetId | undefined => {
    let parentId = this.getParentId(widgetId);

    // Responsive member widgets point to the id of the responsive widget that they belong to.
    // If its parent widget belongs to a group, return the group
    const nestedGroupId = parentId && this.idMap.get(parentId)?.[0];
    if (parentId && nestedGroupId && nestedGroupId !== parentId) {
      parentId = this.idMap.get(parentId)?.[0];
    }
    return parentId;
  };

  /**
   * Return true if widget belongs to another widget
   * (i.e. Group widget or responsive widget)
   */
  hasParentWidget = (widgetId: WidgetId): boolean => {
    return !!this.getParentId(widgetId);
  };

  /**
   * TEMPORARY
   * Responsive group widgets are any group that don't have type WidgetType.Group
   * Returns TRUE if widget is part of a responsive group.
   * Will return FALSE for the actual responsive widget.
   */
  isResponsiveGroupMember = (widgetId: WidgetId): boolean => {
    const parentId = this.getParentId(widgetId);
    return !!parentId && getWidgetTypeFromId(parentId) !== WidgetType.Group && parentId !== widgetId;
  };

  getGroupIdx = (widgetId: WidgetId): number => {
    let groupIdx = this.idMap.get(widgetId)?.[1];

    // For responsive members, need to add the groupIdx of the parent to handle case
    // where the parent is part of a group
    if (typeof groupIdx === 'number' && this.isResponsiveGroupMember(widgetId)) {
      const parentGroupIdx = this.getGroupIdx(this.getParentId(widgetId) || '');
      groupIdx += parentGroupIdx > 0 ? parentGroupIdx : 0;
    }

    if (typeof groupIdx === 'number') return groupIdx;
    return -1;
  };

  remove = (widgetId: WidgetId) => {
    this.idMap.delete(widgetId);
  };

  clearGroupId = (groupId: WidgetId) => {
    this.idMap.forEach(([id, idx], widgetId) => {
      if (id === groupId) this.remove(widgetId);
    });
  };

  public static getInstance(): GroupIdCache {
    if (!GroupIdCache.instance) {
      GroupIdCache.instance = new GroupIdCache();
    }

    return GroupIdCache.instance;
  }
}

export const groupIdCache = GroupIdCache.getInstance();

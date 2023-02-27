import { useEffect, useCallback } from 'react';
import { WidgetId } from '../../types/idTypes';
import { groupIdCache } from './GroupIdCache';
import { useEventListener } from 'hooks/useEventListener';

// connect the groupIdCache with the GroupWidget
export const useGroupIdCache = (
  widgetId: WidgetId,
  memberWidgetIds: WidgetId[],
  isResponsiveWidgetBase?: boolean,
  memberCount?: number,
) => {
  const populateCache = useCallback(() => {
    // Keep the group id if exists
    const groupId = groupIdCache.getParentId(widgetId);
    groupIdCache.add(widgetId, groupId || widgetId, -1, {
      isResponsiveWidgetBase: !!isResponsiveWidgetBase,
      memberCount,
    });
    let prevGroupIdx = 0;
    memberWidgetIds.forEach((id, idx) => {
      let groupIdx = prevGroupIdx;

      // For responsive widget members, +1 to idx since the parent widget also has it's own bounding box
      if (isResponsiveWidgetBase) {
        groupIdx = idx + 1;
      } else if (groupIdCache.isResponsiveWidgetBase(memberWidgetIds[idx - 1])) {
        // If the previous member in a group is responsive, need to add the member count
        const memberCount = groupIdCache.getMemberCount(memberWidgetIds[idx - 1]);
        groupIdx += memberCount;
      }
      prevGroupIdx = groupIdx + 1;

      groupIdCache.add(id, widgetId, groupIdx, {
        isResponsiveWidgetBase: groupIdCache.isResponsiveWidgetBase(id),
        memberCount: groupIdCache.getMemberCount(id),
      });
    });
  }, [widgetId, memberWidgetIds, isResponsiveWidgetBase, memberCount]);

  // reset the groupIdCache when the history changes in case there was a delete/add of a group
  useEventListener('history', populateCache);

  useEffect(() => {
    populateCache();

    return () => {
      // Do not remove from cache if responsive widget is still in dom
      const widgetExistsInDom = document.getElementById(widgetId)!!;
      if (groupIdCache.isResponsiveWidgetBase(widgetId) && widgetExistsInDom) return;

      groupIdCache.remove(widgetId);
      memberWidgetIds.forEach((id) => groupIdCache.remove(id));
    };
  }, [widgetId, memberWidgetIds, populateCache]);
};

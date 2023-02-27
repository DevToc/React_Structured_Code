import { groupIdCache } from '../GroupIdCache';

describe('GroupWidget/GroupIdCache.ts', () => {
  test('should add group ids to cache', () => {
    groupIdCache.add('123', '456', 0);
    expect(groupIdCache.getParentId('123')).toEqual('456');
  });
  test('should remove group ids from the cache', () => {
    groupIdCache.remove('123');
    expect(groupIdCache.getParentId('123')).toBeUndefined();
  });
  test('should get group ids from the cache', () => {
    groupIdCache.add('123', '456', 4);
    expect(groupIdCache.getParentId('123')).toEqual('456');
  });
  test('should get group member position', () => {
    groupIdCache.add('abc', 'def', 3);
    expect(groupIdCache.getGroupIdx('abc')).toEqual(3);
  });
  test('should get nested parent', () => {
    groupIdCache.add('abc', 'def', 0);
    groupIdCache.add('ghi', 'abc', 0);
    expect(groupIdCache.getParentId('ghi')).toEqual('abc');
    expect(groupIdCache.getParentIdNested('ghi')).toEqual('def');
  });
  test('should get group member position with nested group', () => {
    groupIdCache.add('group1', 'group1', -1);
    // First member is non-parent
    groupIdCache.add('member1', 'group1', 0);

    // Second member is nested - the member group idx should be relative to the parent
    groupIdCache.add('respGroup1', 'group1', 1, { isResponsiveWidgetBase: true, memberCount: 2 });
    groupIdCache.add('respMember1', 'respGroup1', 1);
    groupIdCache.add('respMember2', 'respGroup1', 2);

    expect(groupIdCache.getGroupIdx('member1')).toBe(0);
    expect(groupIdCache.getGroupIdx('respGroup1')).toBe(1);
    expect(groupIdCache.getGroupIdx('respMember1')).toBe(2);
    expect(groupIdCache.getGroupIdx('respMember2')).toBe(3);
  });
  test('should check if group ids exist', () => {
    expect(groupIdCache.hasParentWidget('abc')).toEqual(true);
  });
  test('should clear all group ids', () => {
    const groupId = 'group-id';

    const widgetIds = ['w-1', 'w-2', 'w-3'];
    widgetIds.forEach((widgetId, idx) => groupIdCache.add(widgetId, groupId, idx));
    widgetIds.forEach((widgetId) => expect(groupIdCache.hasParentWidget(widgetId)).toEqual(true));

    groupIdCache.clearGroupId(groupId);
    widgetIds.forEach((widgetId) => expect(groupIdCache.hasParentWidget(widgetId)).toEqual(false));
    expect(groupIdCache.hasParentWidget('abc')).toEqual(true);
  });
});

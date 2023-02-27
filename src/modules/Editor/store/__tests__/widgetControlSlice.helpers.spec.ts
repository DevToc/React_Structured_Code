import { getNextActiveWidget, getPreviousActiveWidget } from '../widgetControlSlice.helpers';

describe('widgetControlSlice.helpers.ts', () => {
  it('should getNextActiveWidget as expected', async () => {
    const widgetOrder = ['a', 'b', 'c', 'd', 'e'];

    const normal = getNextActiveWidget(widgetOrder, [{ id: 'a', groupMembers: [], groupId: '' }]);
    expect(normal).toEqual('b');

    const lastActive = getNextActiveWidget(widgetOrder, [{ id: 'e', groupMembers: [], groupId: '' }]);
    expect(lastActive).toEqual('a');
  });
  it('should getNextActiveWidget as expected for groups', async () => {
    const widgetOrder = ['a', 'b', 'c', 'd', 'e'];

    const normal = getNextActiveWidget(widgetOrder, [{ id: 'gA', groupMembers: ['gA', 'gB'], groupId: '' }]);
    expect(normal).toEqual('gB');

    const lastActive = getNextActiveWidget(widgetOrder, [{ id: 'gB', groupMembers: ['gA', 'gB'], groupId: '' }]);
    expect(lastActive).toEqual('gA');
  });
  it('should getPreviousActiveWidget as expected', async () => {
    const widgetOrder = ['a', 'b', 'c', 'd', 'e'];

    const normal = getPreviousActiveWidget(widgetOrder, [{ id: 'b', groupMembers: [], groupId: '' }]);
    expect(normal).toEqual('a');

    const lastActive = getPreviousActiveWidget(widgetOrder, [{ id: 'a', groupMembers: [], groupId: '' }]);
    expect(lastActive).toEqual('e');
  });
  it('should getPreviousActiveWidget as expected for groups', async () => {
    const widgetOrder = ['a', 'b', 'c', 'd', 'e'];

    const normal = getPreviousActiveWidget(widgetOrder, [{ id: 'gA', groupMembers: ['gA', 'gB'], groupId: '' }]);
    expect(normal).toEqual('gB');

    const lastActive = getPreviousActiveWidget(widgetOrder, [{ id: 'gB', groupMembers: ['gA', 'gB'], groupId: '' }]);
    expect(lastActive).toEqual('gA');
  });
  it('getNextActiveWidget should work for groups with responsive widgets', () => {
    const groupWidgetId = '004-group';
    const widgetOrder = [groupWidgetId];
    const activeWidgets = [
      {
        id: '016-responsive-widget',
        groupMembers: ['006', '016-responsive-widget', '005'],
        groupId: groupWidgetId,
        responsiveGroupId: '',
      },
    ];

    const nextWidget = getNextActiveWidget(widgetOrder, activeWidgets);
    expect(nextWidget).toEqual('005');

    const nextActiveWidgets = [
      {
        id: '006',
        groupMembers: ['006', '016-responsive-widget', '005'],
        groupId: groupWidgetId,
        responsiveGroupId: '',
      },
    ];
    const nextWidgetMember = getNextActiveWidget(widgetOrder, nextActiveWidgets);
    expect(nextWidgetMember).toEqual('016-responsive-widget');
  });
  it('getNextActiveWidget should work for responsive widget members', () => {
    const responsiveWidgetId = '016-responsive-widget';
    const widgetOrder = [responsiveWidgetId];
    const widgets = {
      [responsiveWidgetId]: { memberWidgetIds: ['001', '002', '003'] },
      '001': { isHidden: false },
      '002': { isHidden: false },
      '003': { isHidden: false },
    };
    const activeWidgets = [{ id: '001', groupMembers: [], groupId: '', responsiveGroupId: responsiveWidgetId }];

    const nextWidget = getNextActiveWidget(widgetOrder, activeWidgets, widgets);
    expect(nextWidget).toEqual('002');
  });

  it('getNextActiveWidget should work for responsive widgets with hidden widget members', () => {
    const responsiveWidgetId = '016-responsive-widget';
    const widgetOrder = [responsiveWidgetId];
    const widgets = {
      [responsiveWidgetId]: { memberWidgetIds: ['001', '002', '003'] },
      '001': { isHidden: false },
      '002': { isHidden: true },
      '003': { isHidden: false },
    };
    const activeWidgets = [{ id: '001', groupMembers: [], groupId: '', responsiveGroupId: responsiveWidgetId }];

    const nextWidget = getNextActiveWidget(widgetOrder, activeWidgets, widgets);
    expect(nextWidget).toEqual('003');
  });

  it('getNextActiveWidget should work for responsive widgets with one visible widget members', () => {
    const responsiveWidgetId = '016-responsive-widget';
    const widgetOrder = [responsiveWidgetId];
    const widgets = {
      [responsiveWidgetId]: { memberWidgetIds: ['001', '002', '003'] },
      '001': { isHidden: false },
      '002': { isHidden: true },
      '003': { isHidden: true },
    };
    const activeWidgets = [{ id: '001', groupMembers: [], groupId: '', responsiveGroupId: responsiveWidgetId }];

    const nextWidget = getNextActiveWidget(widgetOrder, activeWidgets, widgets);
    expect(nextWidget).toEqual('001');
  });
  it('getPreviousActiveWidget should work for responsive widget members', () => {
    const responsiveWidgetId = '016-responsive-widget';
    const widgetOrder = [responsiveWidgetId];
    const widgets = {
      [responsiveWidgetId]: { memberWidgetIds: ['001', '002', '003'] },
      '001': { isHidden: false },
      '002': { isHidden: false },
      '003': { isHidden: false },
    };
    const activeWidgets = [{ id: '001', groupMembers: [], groupId: '', responsiveGroupId: responsiveWidgetId }];

    const nextWidget = getPreviousActiveWidget(widgetOrder, activeWidgets, widgets);
    expect(nextWidget).toEqual('003');
  });

  it('getPreviousActiveWidget should work for responsive widgets with hidden widget members', () => {
    const responsiveWidgetId = '016-responsive-widget';
    const widgetOrder = [responsiveWidgetId];
    const widgets = {
      [responsiveWidgetId]: { memberWidgetIds: ['001', '002', '003'] },
      '001': { isHidden: false },
      '002': { isHidden: true },
      '003': { isHidden: false },
    };
    const activeWidgets = [{ id: '001', groupMembers: [], groupId: '', responsiveGroupId: responsiveWidgetId }];

    const nextWidget = getPreviousActiveWidget(widgetOrder, activeWidgets, widgets);
    expect(nextWidget).toEqual('003');
  });

  it('getPreviousActiveWidget should work for responsive widgets with one visible widget members', () => {
    const responsiveWidgetId = '016-responsive-widget';
    const widgetOrder = [responsiveWidgetId];
    const widgets = {
      [responsiveWidgetId]: { memberWidgetIds: ['001', '002', '003'] },
      '001': { isHidden: false },
      '002': { isHidden: true },
      '003': { isHidden: true },
    };
    const activeWidgets = [{ id: '001', groupMembers: [], groupId: '', responsiveGroupId: responsiveWidgetId }];

    const nextWidget = getPreviousActiveWidget(widgetOrder, activeWidgets, widgets);
    expect(nextWidget).toEqual('001');
  });
});

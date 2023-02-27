import { AllWidgetData, NewWidget } from 'widgets/Widget.types';
import { generateWidgetId } from 'widgets/Widget.helpers';
import { PageId, WidgetId } from 'types/idTypes';
import { AddWidget } from './infographSlice';

export const parseWidgetData = (
  newWidgetData: NewWidget[] | NewWidget,
  pageId: PageId,
): [WidgetId[], AddWidget[] | AddWidget] => {
  const newWidgetIds: WidgetId[] = [];

  const parseNewWidget = (newWidget: NewWidget) => {
    const { widgetType, widgetData, groupWidgets, isResponsiveGroup } = newWidget;

    const componentWidgetIdMap: { [key: string]: WidgetId } = {};

    // For groups: create new widget ids for all the group member widgets
    if (groupWidgets && groupWidgets.length) {
      const newMemberWidgetIds: WidgetId[] = [];

      const newGroupWidgets = groupWidgets.map((groupWidget: NewWidget) => {
        const { widgetType, widgetData, componentKey, groupWidgets: nestedGroupWidgets } = groupWidget;
        const widgetId = generateWidgetId(widgetType);
        newMemberWidgetIds.push(widgetId);

        if (isResponsiveGroup && componentKey) {
          componentWidgetIdMap[componentKey] = widgetId;
        }

        // Handle nested groups when there is a responsive widget inside a group
        // Generate new ids for all the members and update the component widget id map
        let newNestedGroupWidgets: { widgetId: WidgetId; pageId: PageId; widgetData: AllWidgetData }[] = [];
        let newNestedMemberWidgetIds: WidgetId[] = [];
        let newComponentWidgetIdMap: { [key: string]: WidgetId } = {};

        if (nestedGroupWidgets && nestedGroupWidgets.length > 0) {
          newNestedGroupWidgets = nestedGroupWidgets.map((nestedWidget) => {
            const { widgetType, widgetData, componentKey } = nestedWidget;
            const newWidgetId = generateWidgetId(widgetType);
            newNestedMemberWidgetIds.push(newWidgetId);

            if (componentKey) {
              newComponentWidgetIdMap[componentKey] = newWidgetId;
            }

            return { widgetId: newWidgetId, pageId, widgetData };
          });
        }

        const nestedWidgetData =
          newNestedGroupWidgets.length > 0
            ? {
                ...widgetData,
                memberWidgetIds: newNestedMemberWidgetIds,
                componentWidgetIdMap: newComponentWidgetIdMap,
              }
            : widgetData;

        return {
          widgetId,
          pageId,
          widgetData: nestedWidgetData,
          ...(newNestedGroupWidgets.length > 0 && { groupWidgets: newNestedGroupWidgets }),
        };
      });

      const groupWidgetId = generateWidgetId(widgetType);
      newWidgetIds.push(groupWidgetId);

      // replace the member widget ids in the group
      const newGroupWidgetData = {
        ...widgetData,
        memberWidgetIds: newMemberWidgetIds,
        ...(isResponsiveGroup && { componentWidgetIdMap }),
      };

      const addGroupWidget = {
        widgetId: groupWidgetId,
        pageId,
        widgetData: newGroupWidgetData,
        groupWidgets: newGroupWidgets,
        isResponsiveGroup,
      };

      return addGroupWidget;
    }

    const widgetId = generateWidgetId(widgetType);
    newWidgetIds.push(widgetId);

    const addWidget = { widgetId, pageId, widgetData };
    return addWidget;
  };

  const addWidgets = Array.isArray(newWidgetData) ? newWidgetData.map(parseNewWidget) : parseNewWidget(newWidgetData);
  return [newWidgetIds, addWidgets];
};

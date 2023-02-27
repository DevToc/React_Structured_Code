import { RootState } from './store';
import { WidgetType } from 'types/widget.types';
import { AllWidgetUIControl } from 'widgets/Widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { ActiveWidgetIds, WidgetClipboard } from './widgetControlSlice';

const selectWidgetClipboard = (state: RootState): WidgetClipboard => state.widgetControl.widgetClipboard;

// includes all grouped widget ids
const selectActiveWidgetIds = (state: RootState): ActiveWidgetIds => state.widgetControl.activeWidgetIds;

const selectHasActiveWidget = (state: RootState): boolean =>
  !!(state.widgetControl.activeWidgetIds && state.widgetControl.activeWidgetIds.length);

const selectActiveWidgetType = (state: RootState): WidgetType | undefined => {
  if (!state.widgetControl.activeWidgets || !state.widgetControl.activeWidgets.length) return;

  const isSingleWidgetSelected = state.widgetControl.activeWidgets.length === 1;
  if (!isSingleWidgetSelected) return;

  return getWidgetTypeFromId(state.widgetControl.activeWidgets[0].id);
};

const selectTaggedWidgetType = (state: RootState): WidgetType[] => {
  return state.widgetControl.taggedWidgetTypes;
};

const selectActiveWidgetToolbarState = (state: RootState): AllWidgetUIControl | undefined => {
  if (!selectHasActiveWidget(state)) return undefined;

  return state.widgetControl.activeWidgetToolbarState;
};

/**
 * Selector that returns true if wId is the current active widget
 * or if it's a member of the active responsive group
 */
const selectIsActiveWidgetByGroup =
  (wId: string) =>
  (state: RootState): boolean => {
    const isSingleWidgetSelected = state.widgetControl.activeWidgets.length === 1;
    if (!isSingleWidgetSelected) return false;

    const activeWidget = state.widgetControl.activeWidgets[0];
    return (
      activeWidget.id === wId ||
      (!!activeWidget.responsiveGroupId && !activeWidget.groupId && activeWidget.groupMembers?.includes(wId))
    );
  };

const selectIsActiveWidget =
  (wId: string) =>
  (state: RootState): boolean => {
    const isSingleWidgetSelected = state.widgetControl.activeWidgets.length === 1;
    if (!isSingleWidgetSelected) return false;

    if (state.widgetControl.activeWidgets[0].id === wId) return true;
    return false;
  };
const selectCropId = (state: RootState): string => state.widgetControl.cropId;
const selectActiveWidgets = (state: RootState) => state.widgetControl.activeWidgets;
const selectShouldScrollToWidget = (state: RootState) => state.widgetControl.shouldScrollToWidget;

export {
  selectWidgetClipboard,
  selectActiveWidgetIds,
  selectHasActiveWidget,
  selectActiveWidgetType,
  selectActiveWidgetToolbarState,
  selectIsActiveWidget,
  selectCropId,
  selectActiveWidgets,
  selectTaggedWidgetType,
  selectIsActiveWidgetByGroup,
  selectShouldScrollToWidget,
};

import { WidgetId } from '../../../../types/idTypes';
import { ActiveWidgetIds, ActiveWidgets } from '../../store/widgetControlSlice';
import { HANDLE } from '../../../../constants/bounding-box';
import { getWidgetTypeFromId } from '../../../../widgets/Widget.helpers';
import { Widget, WidgetType } from '../../../../types/widget.types';
import {
  BoundingBoxFunction,
  SelectoTarget,
  WidgetEvent,
  Compute,
  Match,
  Hide,
  Frame,
  WidgetHandleDirection,
} from './BoundingBox.types';
import { WidgetBoundingBoxRef } from './useBoundingBox/useBoundingBox.types';
import { DEFAULT_WIDGET_BOUNDING_BOX_CONFIG, WIDGET_BOUNDING_BOX_CONFIG } from './BoundingBox.config';
import { parseStrictNumber } from '../../../../utils/number';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';

export const getWidgetElements = (
  activeWidgetIds: ActiveWidgetIds,
  widgetRefs: WidgetBoundingBoxRef,
): HTMLElement[] => {
  const widgetElements: HTMLElement[] = [];

  activeWidgetIds.forEach((widgetId) => {
    const isGroupWidget = getWidgetTypeFromId(widgetId) === WidgetType.Group;
    const widgetEl = widgetRefs[widgetId]?.element;

    // the responsive widget can conditionally render widget members
    // so we need to check if the widget is in the dom
    const widgetExistsInDom = document.getElementById(widgetId)!!;

    // the group widget is active but not a moveable target (is not resizble etc and does not need the bounding box events)
    if (widgetEl && !isGroupWidget && widgetExistsInDom) widgetElements.push(widgetEl);
  });

  return widgetElements;
};

export const getWidgetHandles = (activeWidgets: ActiveWidgets, selectedWidget: Widget): string[] => {
  if (!activeWidgets.length) return [];

  const isMultipleSelect = activeWidgets.length > 1;
  const isGroupWidget = !!activeWidgets[0].groupId;
  if (isMultipleSelect || isGroupWidget) return HANDLE.CORNERS;

  const activeWidget = activeWidgets[0].responsiveGroupId || activeWidgets[0].id;
  const widgetType = getWidgetTypeFromId(activeWidget);
  const widgetConfig = WIDGET_BOUNDING_BOX_CONFIG[widgetType];

  if (!widgetConfig || !widgetConfig.customHandle) return HANDLE.ALL;

  if (typeof widgetConfig.customHandle === 'function') return widgetConfig.customHandle(selectedWidget);
  return widgetConfig.customHandle;
};

export const getWidgetRotatable = (activeWidgetIds: ActiveWidgetIds): boolean => {
  if (!activeWidgetIds?.length) return false;

  // Rotation is disabled for group widgets
  const hasParentWidget = activeWidgetIds.find((wId) => !!groupIdCache.getParentId(wId));
  if (hasParentWidget) return false;

  // If any of the active widgets are not rotatable, return false
  for (const widgetId of activeWidgetIds) {
    const widgetType = getWidgetTypeFromId(widgetId);
    const widgetConfig = WIDGET_BOUNDING_BOX_CONFIG[widgetType];
    if (widgetConfig && widgetConfig.hasOwnProperty('rotatable') && !widgetConfig.rotatable) {
      return false;
    }
  }

  const isMultipleSelect = activeWidgetIds.length > 1;
  if (isMultipleSelect) return true;

  return true;
};

export const getWidgetResizable = (activeWidgetIds: ActiveWidgetIds): boolean => {
  if (!activeWidgetIds?.length) return false;

  const isGroup = activeWidgetIds.length > 1;
  if (isGroup) return true;

  const widgetType = getWidgetTypeFromId(activeWidgetIds[0]);
  const widgetConfig = WIDGET_BOUNDING_BOX_CONFIG[widgetType];

  if (!widgetConfig || !widgetConfig.hasOwnProperty('resizable')) return true;

  return widgetConfig.resizable ?? true;
};

export const getHideDefaultLines = (activeWidgetIds: ActiveWidgetIds): boolean => {
  if (!activeWidgetIds?.length) return true;

  const isGroup = activeWidgetIds.length > 1;
  if (isGroup || !activeWidgetIds.length) return false;

  const widgetType = getWidgetTypeFromId(activeWidgetIds[0]);
  const widgetConfig = WIDGET_BOUNDING_BOX_CONFIG[widgetType];

  if (!widgetConfig || !widgetConfig.hasOwnProperty('hideDefaultLines')) return false;

  return widgetConfig.hideDefaultLines ?? false;
};

export const getKeepAspectRatioHandles = (activeWidgetIds: ActiveWidgetIds): string[] | null => {
  if (!activeWidgetIds.length) return null;

  const isGroup = activeWidgetIds.length > 1;
  if (isGroup) return null;

  const widgetType = getWidgetTypeFromId(activeWidgetIds[0]);
  const widgetConfig = WIDGET_BOUNDING_BOX_CONFIG[widgetType];

  const defaultHandles = DEFAULT_WIDGET_BOUNDING_BOX_CONFIG.keepAspectRatioHandles as string[];

  if (!widgetConfig || !widgetConfig.hasOwnProperty('keepAspectRatioHandles')) return defaultHandles;

  return widgetConfig.keepAspectRatioHandles || defaultHandles;
};

export const checkActiveWidgetIdByTarget = (activeWidgetIds: ActiveWidgetIds, element: Element): boolean => {
  return activeWidgetIds.includes(element?.id);
};

export const getWidgetTargetIds = (targets: SelectoTarget[]): ActiveWidgetIds =>
  targets.map((target: SelectoTarget) => target.id);

interface ExtendWidgetCreator {
  activeWidgetIds: ActiveWidgetIds;
  widgetRefs: WidgetBoundingBoxRef;
  frameMap: Frame;
  compute: Compute;
  match: Match;
  hide: Hide;
  saveWidget: (id: WidgetId, data: object) => void;
}
/**
 * Allow widgets to access and override bounding box functions.
 * If there is a custom boundingBox event function in the widget call that function else call the default boundingBox function
 * e.g. a widget can implement their own onDrag or add logic before or after the onDrag event
 *
 * @param activeWidgetIds all active widget ids
 * @param widgetRefs all widget refs
 * @param frameMap frameMap with translate and rotate exposed to widget
 * @param Compute smartGuidelines function exposed to widget
 * @param Match smartGuidelines function exposed to widget
 * @param Hide smartGuidelines function exposed to widget
 * @param saveWidget Used for saving  updated widget data after the bounding box event has finished - exposed to `*.End` functions
 * @param boundingBoxFunction a function from boundingbox that should be passed to the widget e.g. onDrag
 * @param boundingBoxEvent event that is passed to the boundingBoxFunction e.g. OnDragEvent
 */

export const extendWidgetCreator =
  ({ activeWidgetIds, widgetRefs, frameMap, compute, match, hide, saveWidget }: ExtendWidgetCreator) =>
  (boundingBoxFunction: any, functionName: WidgetEvent) =>
  (boundingBoxEvent: any) => {
    const isSingleWidgetSelected = activeWidgetIds.length === 1;
    if (!isSingleWidgetSelected) return boundingBoxFunction(boundingBoxEvent);

    const [widgetId] = activeWidgetIds;
    const widgetOverrideSettings = widgetRefs[widgetId];
    if (!widgetOverrideSettings) return boundingBoxFunction(boundingBoxEvent);

    const widgetCustomFunction = widgetOverrideSettings[functionName as keyof BoundingBoxFunction];
    if (!widgetCustomFunction) return boundingBoxFunction(boundingBoxEvent);

    const isEndEvent =
      functionName === WidgetEvent.onDragEnd ||
      functionName === WidgetEvent.onResizeEnd ||
      functionName === WidgetEvent.onRotateEnd;

    // expose more internal bounding box state by passing them as arguments here:
    return widgetCustomFunction({
      event: boundingBoxEvent,
      [functionName]: boundingBoxFunction,
      smartGuide: { compute, match, hide },
      frameMap,
      ...(isEndEvent ? { saveWidget } : {}),
    });
  };

/**
 * Return the rotate deg value from the style.transform
 *
 * @param style
 * @returns
 */
export const getRotatDegFromStyle = (style: CSSStyleDeclaration): number => {
  const rotateData = style.transform.match(/rotate\((.+)\)/);
  return (rotateData && parseStrictNumber(rotateData?.[1])) || 0;
};

/**
 * Generates direction string from direction provided by Moveable resize
 * events.
 *
 * @param moveableDirection number[] direction provided by Moveable events
 * @returns
 */
export const getDirectionAsString = (moveableDirection: number[]): WidgetHandleDirection => {
  let direction = '';
  switch (moveableDirection[1]) {
    case -1:
      direction = 'n';
      break;
    case 1:
      direction = 's';
      break;
    default:
      break;
  }

  switch (moveableDirection[0]) {
    case -1:
      direction += 'w';
      break;
    case 1:
      direction += 'e';
      break;
    default:
      break;
  }

  return direction as WidgetHandleDirection;
};

// Check if a style (target.style.width, target.style.height) is a px value or string (auto, fit-content, percentage, etc)
export const isTargetStyleNumber = (style: string) => !Number.isNaN(parseFloat(style)) && style.indexOf('%') === -1;

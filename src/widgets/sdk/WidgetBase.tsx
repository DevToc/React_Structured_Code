import { ReactNode, useEffect, useCallback, useMemo, MouseEvent } from 'react';
import { Box, VisuallyHidden, Text } from '@chakra-ui/react';

import { LOCK_COLOR, WIDGETBASE_CLASS, SELECTO_TARGET_CLASS, WIDGET_LOCK_CLASS } from 'constants/bounding-box';
import { WidgetId } from 'types/idTypes';
import { AccessibleElement } from 'types/widget.types';
import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import {
  CustomOnDragStartFn,
  CustomOnDragFn,
  CustomOnDragEndFn,
  CustomOnResizeStartFn,
  CustomOnResizeFn,
  CustomOnResizeEndFn,
  CustomOnRotateStartFn,
  CustomOnRotateFn,
  CustomOnRotateEndFn,
  WidgetEvent,
} from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox/useBoundingBox';
import { useIsFirstRender } from 'hooks/useIsFirstRender';

import { SetCustomWidgetOverride, GetWidgetMemberComponent } from '../Widget.types';
import { WidgetTagOverlay } from './WidgetTagOverlay';
import { getWidgetLabelInformation, isAutoHeightWidget, isAutoWidthWidget } from '../Widget.helpers';
import { useResponsiveWidget } from '../ResponsiveWidgets/useResponsiveWidget';
import { useWidget } from './useWidget';

const useCustomBoundingBoxOverride = (
  widgetId: WidgetId,
  setCustomWidgetOverride: SetCustomWidgetOverride | undefined,
  overrideFunction: ((arg: any) => void) | undefined,
  overrideFunctionName: string,
) => {
  useEffect(() => {
    if (setCustomWidgetOverride && overrideFunction) {
      setCustomWidgetOverride(widgetId, overrideFunction, overrideFunctionName);
    }
  }, [widgetId, setCustomWidgetOverride, overrideFunction, overrideFunctionName]);
};

export interface WidgetBaseProp extends ReadOnlyWidgetBaseProp {
  onDragStart?: CustomOnDragStartFn;
  onDrag?: CustomOnDragFn;
  onDragEnd?: CustomOnDragEndFn;
  onResizeStart?: CustomOnResizeStartFn;
  onResize?: CustomOnResizeFn;
  onResizeEnd?: CustomOnResizeEndFn;
  onRotateStart?: CustomOnRotateStartFn;
  onRotate?: CustomOnRotateFn;
  onRotateEnd?: CustomOnRotateEndFn;
  // For the group widget to get widget components and render widgets
  getWidgetMemberComponent?: GetWidgetMemberComponent;
}

/**
 *
 * Base widget which controls location, size, orientation, locked/not locked, state of the widget.
 * this widget should wrap any specific widget.
 *
 * @param param0
 * @returns
 */
export const WidgetBase = ({
  children,
  onClick,
  onDoubleClick,
  onDragStart,
  onDrag,
  onDragEnd,
  onResizeStart,
  onResize,
  onResizeEnd,
  onRotateStart,
  onRotate,
  onRotateEnd,
  disableSingleSelect = false,
  isResponsiveWidgetBase = false,
  isFitContentWidth = false,
}: WidgetBaseProp) => {
  const { isLocked, widgetId } = useWidget();
  const { setWidgetRef, cleanupWidgetBoundingBoxConfig, setCustomWidgetOverride } = useBoundingBox();

  const safeCleanupRef = useCallback(() => {
    if (!cleanupWidgetBoundingBoxConfig) return;
    cleanupWidgetBoundingBoxConfig(widgetId);
  }, [widgetId, cleanupWidgetBoundingBoxConfig]);

  const safeSetWidgetRef = (ref: HTMLElement | null) => {
    if (!setWidgetRef) return null;
    setWidgetRef(widgetId, ref);
  };

  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onResizeStart, WidgetEvent.onResizeStart);
  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onResize, WidgetEvent.onResize);
  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onResizeEnd, WidgetEvent.onResizeEnd);

  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onDragStart, WidgetEvent.onDragStart);
  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onDrag, WidgetEvent.onDrag);
  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onDragEnd, WidgetEvent.onDragEnd);

  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onRotateStart, WidgetEvent.onRotateStart);
  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onRotate, WidgetEvent.onRotate);
  useCustomBoundingBoxOverride(widgetId, setCustomWidgetOverride, onRotateEnd, WidgetEvent.onRotateEnd);

  useEffect(() => () => safeCleanupRef(), [safeCleanupRef]);

  return (
    <ReadOnlyWidgetBase
      setWidgetRef={safeSetWidgetRef}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`${isLocked ? WIDGET_LOCK_CLASS : ''}`}
      hover={{ boxShadow: isLocked ? `0 0 0 1px ${LOCK_COLOR}` : '' }}
      cursor={'move'}
      disableSingleSelect={disableSingleSelect}
      isResponsiveWidgetBase={isResponsiveWidgetBase}
      isFitContentWidth={isFitContentWidth}
    >
      {children}
      <WidgetTagOverlay />
    </ReadOnlyWidgetBase>
  );
};

interface ReadOnlyWidgetBaseProp {
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onDoubleClick?: (e: MouseEvent<HTMLElement>) => void;
  setWidgetRef?: (ref: HTMLElement | null) => null | undefined;
  className?: string;
  hover?: object;
  cursor?: string;
  // optional prop for export
  includeAltTextImg?: boolean;
  disableSingleSelect?: boolean;
  // TRUE if it is a ResponsiveWidgetBase container
  isResponsiveWidgetBase?: boolean;
  isFitContentWidth?: boolean;
}

export const ReadOnlyWidgetBase = ({
  children,
  onClick,
  onDoubleClick,
  setWidgetRef,
  className,
  hover = {},
  cursor = '',
  disableSingleSelect = false,
  isResponsiveWidgetBase = false,
  isFitContentWidth = false,
}: ReadOnlyWidgetBaseProp) => {
  // Set the height on the first render using isFirst so that it prevents having the height 0 bounding box when exporting, adding a widget, etc
  const isFirst = useIsFirstRender();

  const { topPx, leftPx, widthPx, heightPx, zIndex, rotateDeg, widgetId } = useWidget();

  // Responsive widgets have static positioning for member widgets
  // Member widgets can also optionally take the full width/height of its container if it is
  // defined by the responsive widget base provider fitWidth/HeightWidgets arrayss
  const { responsiveWidgetId, fitWidthWidgets, fitHeightWidgets } = useResponsiveWidget();
  const isFitWidth = responsiveWidgetId && fitWidthWidgets?.includes(widgetId);
  const isFitHeight = responsiveWidgetId && fitHeightWidgets?.includes(widgetId);

  const widthStyle = useMemo(() => {
    let width = `${widthPx}px`;
    if ((!isFirst && isAutoWidthWidget(widgetId)) || isFitContentWidth) {
      width = 'fit-content';
    }

    if (isFitWidth) {
      width = '100%';
    }

    return width;
  }, [widgetId, isFirst, widthPx, isFitWidth, isFitContentWidth]);

  const heightStyle = useMemo(() => {
    let height = `${heightPx}px`;
    if ((!isFirst && isAutoHeightWidget(widgetId)) || isResponsiveWidgetBase) {
      height = 'fit-content';
    }

    if (isFitHeight) {
      height = '100%';
    }

    return height;
  }, [widgetId, isFirst, heightPx, isFitHeight, isResponsiveWidgetBase]);

  const style = useMemo(
    () => ({
      display: 'block',
      position: responsiveWidgetId ? undefined : ('absolute' as 'absolute'),
      top: `${topPx}px`,
      left: `${leftPx}px`,
      width: widthStyle,
      height: heightStyle,
      transform: `rotate(${rotateDeg}deg)`,
      zIndex: zIndex || 0,
      cursor,
    }),
    [responsiveWidgetId, cursor, leftPx, rotateDeg, topPx, zIndex, widthStyle, heightStyle],
  );

  const testId = `widgetbase-${widgetId}`;

  // TODO: decouple this from the text widget & AccessibleElement
  const { proseMirrorData, textTag, altText } = useWidget<TextWidgetData & AccessibleElement>();
  const { widgetLabel, widgetDescription } = getWidgetLabelInformation(widgetId, proseMirrorData, textTag, altText);

  const widgetBaseClassName = useMemo(
    () => [WIDGETBASE_CLASS, SELECTO_TARGET_CLASS, `${className ? className : ''}`].join(' '),
    [className],
  );

  return (
    <Box
      data-testid={testId}
      aria-label={widgetLabel}
      aria-describedby={`${widgetId}-description`}
      ref={setWidgetRef}
      id={widgetId}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      tabIndex={-1}
      style={style}
      className={widgetBaseClassName}
      _hover={hover}
      pointerEvents={disableSingleSelect ? 'none' : 'auto'}
    >
      {children}
      <VisuallyHidden>
        <Text id={`${widgetId}-description`}>{widgetDescription}</Text>
      </VisuallyHidden>
    </Box>
  );
};

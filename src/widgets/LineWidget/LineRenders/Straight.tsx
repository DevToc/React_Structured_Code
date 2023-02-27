import { ReactElement, useMemo } from 'react';
import {
  calculateDeltaPoint,
  parsePosListToPath,
  getPosListWithPadding,
  getDashArray,
  getStrokeLineCap,
  getMarkerPath,
} from '../LineWidget.helpers';
import { StraightLineProps, ArrowStyleTypes } from '../LineWidget.types';
import { DEFAULT_STROKE_SELECTION_TARGET, MIN_WIDGET_SIZE } from '../LineWidget.config';

export const Straight = ({
  widgetId,
  widthPx = MIN_WIDGET_SIZE,
  heightPx = MIN_WIDGET_SIZE,
  posList,
  delta,
  strokeWidth,
  strokeColor,
  strokeDashType,
  startArrowStyle,
  endArrowStyle,
  isReadonly = false,
}: StraightLineProps): ReactElement => {
  const newPosList = useMemo(() => {
    return delta?.targetIndex !== undefined && delta?.targetIndex >= 0 ? calculateDeltaPoint(posList, delta) : posList;
  }, [posList, delta]);

  const path = useMemo(() => {
    return parsePosListToPath(newPosList);
  }, [newPosList]);

  const pathWithPadding = useMemo(() => {
    const startDistance = startArrowStyle === ArrowStyleTypes.none ? 0 : strokeWidth * 2;
    const endDistance = endArrowStyle === ArrowStyleTypes.none ? 0 : strokeWidth * 2;
    const result = getPosListWithPadding(newPosList, startDistance, endDistance);
    return parsePosListToPath(result);
  }, [newPosList, startArrowStyle, endArrowStyle, strokeWidth]);

  const dashArray = useMemo(() => {
    return getDashArray(strokeDashType, strokeWidth);
  }, [strokeDashType, strokeWidth]);

  const strokeLineCap = useMemo(() => {
    return getStrokeLineCap(strokeDashType);
  }, [strokeDashType]);

  const startArrowMarkerPath = useMemo(() => {
    return getMarkerPath(startArrowStyle);
  }, [startArrowStyle]);

  const endArrowMarkerPath = useMemo(() => {
    return getMarkerPath(endArrowStyle);
  }, [endArrowStyle]);

  return (
    <>
      <svg
        style={{
          width: `${widthPx}px`,
          height: `${heightPx}px`,
          overflow: 'visible',
          position: 'absolute',
        }}
        data-testid='line-widget-renderer'
      >
        <defs>
          {/* Start arrow marker */}
          <marker id={`start-arrow-${widgetId}`} orient='auto-start-reverse' refX='10px' refY='5px' viewBox='0 0 10 10'>
            <path fill={strokeColor} d={startArrowMarkerPath}></path>
          </marker>

          {/* End arrow marker */}
          <marker id={`end-arrow-${widgetId}`} orient='auto' refX='10px' refY='5px' viewBox='0 0 10 10'>
            <path fill={strokeColor} d={endArrowMarkerPath}></path>
          </marker>
        </defs>

        {/* Line */}
        <path
          d={pathWithPadding}
          stroke={strokeColor}
          fill='transparent'
          strokeWidth={`${strokeWidth}px`}
          strokeDasharray={dashArray}
          strokeLinecap={strokeLineCap}
        ></path>

        {/* Arrow */}
        <path
          d={path}
          stroke='transparent'
          fill='transparent'
          strokeWidth={`${strokeWidth}px`}
          markerStart={`url(#start-arrow-${widgetId})`}
          markerEnd={`url(#end-arrow-${widgetId})`}
        ></path>

        {/* Selection area */}
        {!isReadonly && (
          <path
            id={widgetId}
            pointerEvents='stroke'
            d={path}
            stroke='transparent'
            fill='transparent'
            strokeWidth={`${
              strokeWidth > DEFAULT_STROKE_SELECTION_TARGET ? strokeWidth : DEFAULT_STROKE_SELECTION_TARGET
            }px`}
            strokeDasharray={dashArray}
            strokeLinecap={strokeLineCap}
          ></path>
        )}
      </svg>
    </>
  );
};

export default Straight;

import { useEffect, useCallback, useLayoutEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { WidgetsMap } from 'types/infographTypes';
import { WidgetId } from 'types/idTypes';
import { useWidget, useEditor, WidgetBaseProp, useGroupIdCache } from 'widgets/sdk';
import { useAppSelector } from 'modules/Editor/store/hooks';
import { selectWidgetProperty, selectWidgets } from 'modules/Editor/store/infographSelector';
import { GroupWidgetData } from './GroupWidget.types';

// The size and position of the group widget is inferred from the group members size and positions
const calculateGroupDimension = (memberWidgetIds: WidgetId[], widgets: WidgetsMap) => {
  const firstWidget = widgets[memberWidgetIds[0]];
  const { topPx, leftPx } = firstWidget;
  const groupDimension = { topPx, leftPx, widthPx: 0, heightPx: 0 };

  // find the group position (the smallest topPx / leftPx)
  for (const id of memberWidgetIds) {
    const widgetData = widgets[id];
    if (!widgetData) continue;

    const { topPx, leftPx } = widgetData;
    if (topPx < groupDimension.topPx) groupDimension.topPx = topPx;
    if (leftPx < groupDimension.leftPx) groupDimension.leftPx = leftPx;
  }

  // find the group width / height (requires position)
  // width is the largest rightPx - leftPx
  // height is the largest bottomPx - topPx
  for (const id of memberWidgetIds) {
    const widgetData = widgets[id];
    if (!widgetData) continue;

    const { heightPx: widgetHeight, widthPx: widgetWidth, leftPx: widgetLeft, topPx: widgetTop } = widgetData;
    const groupLeft = groupDimension.leftPx;
    const groupTop = groupDimension.topPx;

    const newWidth = widgetLeft - groupLeft + widgetWidth;
    const newHeight = widgetTop - groupTop + widgetHeight;

    if (newWidth > groupDimension.widthPx) groupDimension.widthPx = newWidth;
    if (newHeight > groupDimension.heightPx) groupDimension.heightPx = newHeight;
  }

  return groupDimension;
};

interface GroupAreaProps {
  rotateDeg: number;
  memberWidgetIds: WidgetId[];
  id: WidgetId;
  zIndex: number | undefined;
}

// Component that is used for for keyboard tabbing and focus (TODO: hover)
const GroupArea = ({ rotateDeg, memberWidgetIds, id, zIndex }: GroupAreaProps) => {
  const { setWidgetRef, cleanupWidgetBoundingBoxConfig } = useEditor();

  // TODO: this needs to be updated to only be member widgets instead of ALL widgets
  const widgets = useAppSelector(selectWidgets);
  const { topPx, leftPx, widthPx, heightPx } = calculateGroupDimension(memberWidgetIds, widgets);

  const safeCleanupRef = useCallback(() => {
    if (!cleanupWidgetBoundingBoxConfig) return;
    cleanupWidgetBoundingBoxConfig(id);
  }, [id, cleanupWidgetBoundingBoxConfig]);

  // The group area can be tabbed and focused by the keyboard similar to a normal widget
  const safeSetWidgetRef = (ref: HTMLElement | null) => {
    if (!setWidgetRef) return null;
    setWidgetRef(id, ref);
  };

  const style = {
    display: 'block',
    position: 'absolute',
    top: topPx + 'px',
    left: leftPx + 'px',
    width: widthPx + 'px',
    height: heightPx + 'px',
    transform: `rotate(${rotateDeg}deg)`,
    pointerEvents: 'none',
    outline: 'none',
  } as React.CSSProperties;

  const testId = `groupwidget-${id}`;

  useEffect(() => {
    return () => {
      safeCleanupRef();
    };
  }, [safeCleanupRef]);

  return <Box tabIndex={-1} ref={safeSetWidgetRef} style={style} data-testid={testId} id={id} />;
};

export const GroupWidget = ({ getWidgetMemberComponent }: WidgetBaseProp) => {
  const { rotateDeg, zIndex, widgetId } = useWidget<GroupWidgetData>();
  // select members directly from redux to avoid conflicts when a widget member is replaced
  const memberWidgetIds =
    useAppSelector(selectWidgetProperty<GroupWidgetData, 'memberWidgetIds'>(widgetId, 'memberWidgetIds')) || [];
  const { boundingBox } = useEditor();

  useGroupIdCache(widgetId, memberWidgetIds);

  useLayoutEffect(() => {
    // redraw the the bounding box after grouping to make sure the group + member bounding box area is correct
    // in case widgets auto-height widgets don't render instantly (e.g. text/table)
    setTimeout(() => boundingBox.updateRect(), 0);
  }, [boundingBox]);

  return (
    <>
      <GroupArea memberWidgetIds={memberWidgetIds} id={widgetId} rotateDeg={rotateDeg} zIndex={zIndex} />
      {memberWidgetIds.map((memberWidgetId: WidgetId) => {
        const GroupMemberWidget = getWidgetMemberComponent!();
        return (
          <GroupMemberWidget
            key={memberWidgetId}
            widgetId={memberWidgetId}
            getWidgetMemberComponent={getWidgetMemberComponent}
            zIndex={zIndex!}
          />
        );
      })}
    </>
  );
};

export const ReadOnlyGroupWidget = ({ getWidgetMemberComponent }: WidgetBaseProp) => {
  const { memberWidgetIds, zIndex } = useWidget<GroupWidgetData>();

  return (
    <>
      {memberWidgetIds.map((memberWidgetId: WidgetId) => {
        const GroupMemberWidget = getWidgetMemberComponent!();
        return (
          <GroupMemberWidget
            key={memberWidgetId}
            widgetId={memberWidgetId}
            getWidgetMemberComponent={getWidgetMemberComponent}
            zIndex={zIndex!}
            isReadOnly
          />
        );
      })}
    </>
  );
};

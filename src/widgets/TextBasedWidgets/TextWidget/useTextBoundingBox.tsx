import { useCallback } from 'react';
import {
  CustomOnResize,
  CustomOnResizeEnd,
  CustomOnResizeStart,
  CustomOnRotateStart,
  CustomOnDragEnd,
} from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { useWidget } from 'widgets/sdk';
import { parseStrictNumber } from 'utils/number';
import { WidgetState } from '../common/TextBasedWidgets.types';
import { UseTextBoundingBoxProps, TextWidgetData } from './TextWidget.types';
import { modifyAllFontSizes } from '../common/TextBasedWidgets.helpers';
import { isTargetStyleNumber } from 'modules/Editor/components/BoundingBox/BoundingBox.helpers';

export const useTextBoundingBox = ({ editor, setWidgetState, isWidgetSelected }: UseTextBoundingBoxProps) => {
  const { widthPx, proseMirrorData, rotateDeg } = useWidget<TextWidgetData>();

  const customOnResizeStart = useCallback(
    ({ event, onResizeStart, isGroup }: CustomOnResizeStart) => {
      if (isGroup) setWidgetState(WidgetState.Active);
      onResizeStart(event);

      const isResizeFromTyping = !event.inputEvent;
      if (!isResizeFromTyping && !isGroup) setWidgetState(WidgetState.Active);
    },
    [setWidgetState],
  );

  const customOnResize = useCallback(
    ({ event, smartGuide, frameMap, isGroup, isResponsiveGroup }: CustomOnResize) => {
      const target = event.target;

      const frame = frameMap.get(target);
      const [x, y] = event.drag.beforeTranslate;

      const isKeyboard = !event.inputEvent;
      const isRotated = Math.abs(rotateDeg) > 1;

      target.style.width = !isTargetStyleNumber(target.style.width) ? target.style.width : `${event.width}px`;

      // TODO: SmartGuide match snapping for rotation and group
      if (isRotated || isKeyboard || isGroup) {
        frame.translate = [x, y];

        if (!isResponsiveGroup) {
          target.style.transform = `translate(${x}px, ${y}px) rotate(${rotateDeg}deg)`;
        }

        if (isGroup) {
          const ratio = target.clientWidth / widthPx;

          // When scaling in a group, the font size can have a decimal value to prevent
          // glitchy behaviour due to rounding issues
          const newContent = modifyAllFontSizes(proseMirrorData, ratio);
          editor?.commands.setContent(newContent);
        }

        return;
      }

      const snapPosition = smartGuide.match({ e: event, frame });
      frame.translate = [parseStrictNumber(snapPosition.x as number) || frame.translate[0], 0];

      // keep y fixed to re-size text downwards
      // TODO: Need more calculation for the rotated widget.
      const fixedY = 0;
      target.style.transform = `translate(${frame.translate[0]}px, ${fixedY}px)`;
    },
    [rotateDeg, widthPx, proseMirrorData, editor],
  );
  const customOnResizeEnd = useCallback(
    ({ event, isGroup, onResizeEnd }: CustomOnResizeEnd) => {
      if (isGroup) {
        const target = event.target;
        const ratio = target.clientWidth / widthPx;

        // Need to remove the decimal value from font size and round to a whole number
        const newContent = modifyAllFontSizes(proseMirrorData, ratio, { round: true });
        editor?.commands.setContent(newContent);
      }

      onResizeEnd(event, isGroup ? { proseMirrorData: editor?.getJSON() } : {});
    },
    [editor, proseMirrorData, widthPx],
  );
  const customOnRotateStart = useCallback(
    ({ event, onRotateStart }: CustomOnRotateStart) => {
      onRotateStart(event);
      setWidgetState(WidgetState.Active);
    },
    [setWidgetState],
  );

  const customOnDragEnd = useCallback(
    ({ event, onDragEnd, isGroup }: CustomOnDragEnd) => {
      // For groups the widget can be dragged without being selected
      // Only set the widgetstate to active if the text widget within the group is dragged
      if (isWidgetSelected) setWidgetState(WidgetState.Active);

      onDragEnd(event);
    },
    [setWidgetState, isWidgetSelected],
  );

  return { customOnResizeStart, customOnResize, customOnResizeEnd, customOnDragEnd, customOnRotateStart };
};

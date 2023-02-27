import { useCallback, useEffect, forwardRef, useRef } from 'react';
import { Text } from '@chakra-ui/react';
import { CustomOnResize, CustomOnResizeEnd } from 'modules/Editor/components/BoundingBox';
import { ReadOnlyWidgetBase, WidgetBase, WidgetToolbar, useWidget, useEditor } from 'widgets/sdk';
import { isSideHandle } from 'utils/boundingBox';
import { LabelTextToolbar } from './LabelTextToolbar';
import { LabelTextWidgetData } from './LabelTextWidget.types';

export const LabelTextWidget = () => {
  const {
    widthPx,
    value,
    style: { fontSize, fontFamily, fontStyle, fontWeight, textDecoration },
  } = useWidget<LabelTextWidgetData>();
  const { boundingBox } = useEditor();

  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    boundingBox.updateRect();
  }, [value, fontFamily, fontWeight, fontSize, fontStyle, textDecoration, boundingBox]);

  // When scaling with group, scale font size
  const customOnResize = useCallback(
    ({ event, onResize, isGroup, isResponsiveGroup }: CustomOnResize) => {
      const { direction } = event;

      // for side handles in group don't resize the labels
      if (isGroup && isSideHandle(direction)) return;

      onResize(event);
      if (!isGroup && !isResponsiveGroup) return;

      const target = event.target;
      const widgetEl = textRef.current;
      if (!widgetEl) return;

      const ratio = target.clientWidth / widthPx;
      widgetEl.style.fontSize = `${fontSize * ratio}px`;
    },
    [fontSize, widthPx],
  );

  // Scale font size in widget data and reset styling set in onResize fn
  const customOnResizeEnd = useCallback(
    ({ event, onResizeEnd, isGroup }: CustomOnResizeEnd) => {
      const scaleFontSize = isGroup && !isSideHandle(event.lastEvent.direction);

      const target = event.target;
      const ratio = target.clientWidth / widthPx;
      const newFontSize = ratio * fontSize;

      onResizeEnd(event, scaleFontSize ? { style: { fontSize: newFontSize } } : {});

      // Wait for font size to update in widget data, then remove fontSize styling on text element
      // setTimeout is required to avoid BB glitching when resizing due to the font-size not being set yet
      setTimeout(() => {
        if (!isGroup) return;

        const widgetEl = textRef.current;
        if (widgetEl) {
          widgetEl.style.fontSize = '';
        }
      }, 0);
    },
    [fontSize, widthPx],
  );

  return (
    <WidgetBase onResize={customOnResize} onResizeEnd={customOnResizeEnd}>
      <WidgetToolbar>
        <LabelTextToolbar />
      </WidgetToolbar>
      <LabelText ref={textRef} />
    </WidgetBase>
  );
};

export const ReadOnlyLabelTextWidget = () => {
  return (
    <ReadOnlyWidgetBase>
      <LabelText />
    </ReadOnlyWidgetBase>
  );
};

const LabelText = forwardRef<HTMLParagraphElement, {}>((_, ref) => {
  const { widgetId, value, suffix, style } = useWidget<LabelTextWidgetData>();
  const { fontStyle, fontWeight, textDecoration, fontSize, fontFamily, color } = style;

  return (
    <Text
      id={`labeltext-${widgetId}`}
      fontWeight={fontWeight}
      fontSize={`${fontSize}px`}
      fontFamily={fontFamily}
      color={color}
      textDecoration={textDecoration}
      fontStyle={fontStyle}
      textAlign={'center'}
      lineHeight={1}
      ref={ref}
    >
      {value}
      {suffix}
    </Text>
  );
});

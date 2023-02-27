import { useState, useCallback } from 'react';

import { useResizeObserver } from 'hooks/useResizeObserver';

import { useBoundingBox } from 'modules/Editor/components/BoundingBox/useBoundingBox';
import { useAppSelector } from 'modules/Editor/store';
import { selectWidget } from 'modules/Editor/store/infographSelector';

import { BasicShapeWidgetData } from 'widgets/BasicShapeWidget/BasicShapeWidget.types';
import { SHAPE_RESIZE_MAP } from 'widgets/BasicShapeWidget/Shapes';
import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { GetWidgetMemberComponent } from 'widgets/Widget.types';

import { FlexLayout, AbsoluteContainer } from '../LayoutComponents';
import { DEFAULT_FIXED_PADDING } from './ResponsiveTextWidget.config';
import { ResponsiveTextWidgetData, ComponentWidgetIdKeys } from './ResponsiveTextWidget.types';
import { useWidget } from 'widgets/sdk';

interface ResponsiveTextLayoutProps {
  getWidgetMemberComponent: GetWidgetMemberComponent;
  isReadOnly: boolean;
}

/**
 * RESPONSIVE TEXT LAYOUT COMPONENT
 *
 * Renders a single text widget with a background shape that expands/contracts with the text
 */
export const ResponsiveTextLayout = ({ getWidgetMemberComponent, isReadOnly = false }: ResponsiveTextLayoutProps) => {
  const { boundingBox } = useBoundingBox();
  const { componentWidgetIdMap, widthPx } = useWidget<ResponsiveTextWidgetData>();

  // The ref is kept on state to make sure the resize observer is re-attached when the ref changes
  const [widgetRef, setWidgetRef] = useState<HTMLDivElement | null>(null);

  const textWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.Text];
  const shapeWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.BackgroundShape];

  const textWidgetData = useAppSelector(selectWidget(textWidgetId)) as TextWidgetData;
  const shapeWidgetData = useAppSelector(selectWidget(shapeWidgetId)) as BasicShapeWidgetData;

  const shapeType = shapeWidgetData.type;

  const TextWidget = getWidgetMemberComponent();
  const ShapeWidget = getWidgetMemberComponent();

  // When text box dimension changes, update the dimensions of the background shape widget to match
  // Since the basic shape widget needs the actual dimensions to generate the SVG, need to use the
  // SHAPE_RESIZE_MAP fns to update the SVGs
  const onResizeWidgetContainer = useCallback(
    ({ width, height }: { width: number | undefined; height: number | undefined }) => {
      if (isReadOnly || !width || !height) return;

      // Update the dimensions of the widget container
      const shapeWidgetEl = document.getElementById(shapeWidgetId);
      if (shapeWidgetEl) {
        shapeWidgetEl.style.width = '100%';
        shapeWidgetEl.style.height = '100%';
        boundingBox.updateRect();
      }

      // Update the shape svg
      if (SHAPE_RESIZE_MAP[shapeType]) {
        SHAPE_RESIZE_MAP[shapeType]({
          widthPx: width + 2 * DEFAULT_FIXED_PADDING,
          heightPx: height + 2 * DEFAULT_FIXED_PADDING,
          borderWidth: shapeWidgetData.border.width,
          widgetId: shapeWidgetId,
        });
      }
    },
    [isReadOnly, shapeType, shapeWidgetData.border.width, shapeWidgetId, boundingBox],
  );

  useResizeObserver({ ref: widgetRef, onResize: onResizeWidgetContainer });

  return (
    <FlexLayout
      direction={'column'}
      justifyContent={'center'}
      position={'relative'}
      p={`${DEFAULT_FIXED_PADDING}px`}
      ref={setWidgetRef}
    >
      <AbsoluteContainer top={0} left={0}>
        <ShapeWidget
          widgetId={shapeWidgetId}
          isReadOnly={isReadOnly}
          customWidgetData={{
            widthPx: widthPx ?? 0,
            heightPx: (textWidgetData.heightPx ?? 0) + 2 * DEFAULT_FIXED_PADDING,
          }}
        />
      </AbsoluteContainer>
      <TextWidget
        widgetId={textWidgetId}
        isReadOnly={isReadOnly}
        customWidgetData={{ widthPx: widthPx - 2 * DEFAULT_FIXED_PADDING ?? 0 }}
      />
    </FlexLayout>
  );
};

import { ReactElement, useState, useCallback, useEffect, Suspense } from 'react';
import { Box, Spinner } from '@chakra-ui/react';

import { CustomOnResize } from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { useWidget, WidgetBase, WidgetBaseProp, ReadOnlyWidgetBase, WidgetToolbar, TransparentImg } from 'widgets/sdk';
import { BasicShapeLayoutProps, BasicShapeToolbarMenuProps, BasicShapeWidgetData } from './BasicShapeWidget.types';
import { SHAPE_TYPE_MAP, SHAPE_RESIZE_MAP } from './Shapes';
import { generateShapeStyle } from './BasicShapeWidget.helpers';
import { useDynamicImport } from 'hooks/useDynamicImport';
import { WidgetComponentsMap } from 'widgets/components.lazy';

const BasicShapeWidgetToolbarMenu = (props: BasicShapeToolbarMenuProps): ReactElement => {
  const Component = useDynamicImport('basicShapeWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );
};

export const BasicShapeWidget = (): ReactElement => {
  const { widthPx, heightPx, border, type, widgetId } = useWidget<BasicShapeWidgetData>();
  const [dimension, setDimension] = useState({ width: widthPx, height: heightPx });

  useEffect(() => {
    setDimension({ width: widthPx, height: heightPx });
  }, [widthPx, heightPx]);

  /**
   * Custom onResize handler to update the shape dimensions
   * to allow for live rendering
   */
  const customOnResize = useCallback(
    ({ event, onResize }: CustomOnResize) => {
      onResize(event);

      if (SHAPE_RESIZE_MAP[type]) {
        const widthPx = event.target.clientWidth;
        const heightPx = event.target.clientHeight;

        // resize the shape without setting the new dimensions to the state
        SHAPE_RESIZE_MAP[type]({ widthPx, heightPx, borderWidth: border.width, widgetId });
      }
    },
    [border.width, type, widgetId],
  );

  return (
    <WidgetBase onResize={customOnResize}>
      <WidgetToolbar>
        <BasicShapeWidgetToolbarMenu />
      </WidgetToolbar>
      <BasicShapeLayout dimension={dimension} />
    </WidgetBase>
  );
};

export const ReadOnlyBasicShapeWidget = ({ includeAltTextImg }: WidgetBaseProp): ReactElement => {
  const { widthPx, heightPx } = useWidget<BasicShapeWidgetData>();
  const dimension = { width: widthPx, height: heightPx };

  return (
    <ReadOnlyWidgetBase>
      <BasicShapeLayout dimension={dimension} />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const BasicShapeLayout = ({ dimension }: BasicShapeLayoutProps): ReactElement => {
  const { type, border, fillColor, fillPercent, mirror, cornerRadius, widgetId } = useWidget<BasicShapeWidgetData>();
  const { width, height } = dimension;
  const Shape = SHAPE_TYPE_MAP[type];

  const style = generateShapeStyle(mirror);

  return (
    <Box w={'100%'} h={'100%'} position={'absolute'}>
      <Shape
        widgetId={widgetId}
        fillColor={fillColor}
        fillPercent={fillPercent}
        widthPx={width}
        heightPx={height}
        border={border}
        style={style}
        {...(cornerRadius && { cornerRadius })}
      />
    </Box>
  );
};

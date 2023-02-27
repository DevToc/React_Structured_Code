import { Flex } from '@chakra-ui/react';
import { memo, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectWidget } from 'modules/Editor/store/infographSelector';
import { updateWidget } from 'modules/Editor/store/infographSlice';

import { WidgetId } from 'types/idTypes';
import { BasicShapeWidgetData } from 'widgets/BasicShapeWidget/BasicShapeWidget.types';
import { ComponentWidgetIdKeys, ResponsiveTextWidgetData } from './ResponsiveTextWidget.types';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { useWidget } from 'widgets/sdk';

export const ResponsiveTextToolbar = () => {
  const { componentWidgetIdMap } = useWidget<ResponsiveTextWidgetData>();

  const shapeWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.BackgroundShape];

  const shapeWidgetData = useAppSelector(selectWidget(shapeWidgetId)) as BasicShapeWidgetData;

  return (
    <Flex gap='2' align='center' data-testid='responsive-text-widget-toolbar'>
      <BackgroundFillOption widgetId={shapeWidgetId} color={shapeWidgetData.fillColor[0]} />
      <BorderColorOption
        widgetId={shapeWidgetId}
        borderColor={shapeWidgetData.border.color}
        borderWidth={shapeWidgetData.border.width}
      />
    </Flex>
  );
};

interface ColorOptionProps {
  widgetId: WidgetId;
  color: string;
}

const BackgroundFillOption = memo(({ widgetId, color }: ColorOptionProps) => {
  const dispatch = useAppDispatch();
  const onUpdateBackgroundFill = useCallback(
    (fillColor: string) => {
      dispatch(
        updateWidget({
          widgetId,
          widgetData: {
            fillColor: [fillColor],
          },
        }),
      );
    },
    [widgetId, dispatch],
  );

  return <ColorPicker color={color} onChange={onUpdateBackgroundFill} label='Background Color' />;
});

interface BorderColorProps {
  widgetId: WidgetId;
  borderWidth: number;
  borderColor: string;
}

const BorderColorOption = ({ widgetId, borderWidth, borderColor }: BorderColorProps) => {
  const dispatch = useAppDispatch();

  const onUpdateBorderColor = useCallback(
    (color: string) => {
      dispatch(
        updateWidget({
          widgetId,
          widgetData: {
            border: {
              color,
              ...(borderWidth === 0 && { width: 5 }),
            },
          },
        }),
      );
    },
    [dispatch, widgetId, borderWidth],
  );

  return <ColorPicker color={borderColor} onChange={onUpdateBorderColor} label={'Border Color'} iconStyle={'border'} />;
};

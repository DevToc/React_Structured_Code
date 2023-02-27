import { ReactElement, memo } from 'react';
import { Text } from '@chakra-ui/react';
import { AllWidgetData } from '../../../../widgets/Widget.types';
import { getLabel } from './AccessibilityManager.helpers';
import { WidgetId } from '../../../../types/idTypes';

interface ReadOrderLabelProps {
  widgetId: WidgetId;
  widgetData: AllWidgetData;
}

const ReadOrderLabel = memo(({ widgetId, widgetData }: ReadOrderLabelProps): ReactElement => {
  const text = getLabel(widgetId, widgetData);

  return (
    <Text fontSize='14px' maxW='240' noOfLines={1}>
      {text}
    </Text>
  );
});

export { ReadOrderLabel };

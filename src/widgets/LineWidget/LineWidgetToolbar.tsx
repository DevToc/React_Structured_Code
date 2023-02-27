import { ReactElement } from 'react';
import { Flex, Tooltip, Select } from '@chakra-ui/react';
import { useWidget } from 'widgets/sdk';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';

import { LineWidgetData, LineWidgetDashArrayTypes, ArrowStyleTypes } from './LineWidget.types';

export const LineWidgetToolbarMenu = (): ReactElement => {
  const { strokeColor, strokeWidth, strokeDashType, startArrowStyle, endArrowStyle, updateWidget, widgetId } =
    useWidget<LineWidgetData>();

  const setStrokeWidth = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    updateWidget({ strokeWidth: parseInt(target.value) });
  };

  const setStrokeColor = (color: string) => updateWidget({ strokeColor: color });

  const setStrokeDash = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const result = target.value as LineWidgetDashArrayTypes;

    updateWidget({ strokeDashType: result });
  };

  const setStartArrowStyle = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const result = target.value as ArrowStyleTypes;

    updateWidget({ startArrowStyle: result });
  };

  const setEndArrowStyle = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const result = target.value as ArrowStyleTypes;

    updateWidget({ endArrowStyle: result });
  };

  const strokeWidthRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <Flex mr='8px' gap='8px' align='center'>
      <ColorPicker color={strokeColor} onChange={setStrokeColor} label={'Line Color'} showNoColorOption={false} />

      <Tooltip hasArrow placement='bottom' label='Line Size' bg='black'>
        <Select onChange={setStrokeWidth} value={strokeWidth} width='80px' size='sm' aria-label='Line Size'>
          {strokeWidthRange.map((v) => (
            <option key={`stroke-width-${v}`} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </Tooltip>

      <Tooltip hasArrow placement='bottom' label='Line Style' bg='black'>
        <Select onChange={setStrokeDash} value={strokeDashType} width='100px' size='sm' aria-label='Line Style'>
          <option value={LineWidgetDashArrayTypes.solid}>Solid</option>
          <option value={LineWidgetDashArrayTypes.dotted}>Dotted</option>
          <option value={LineWidgetDashArrayTypes.dashed}>Dashed</option>
          <option value={LineWidgetDashArrayTypes.dashDot}>Dash-Dot</option>
          <option value={LineWidgetDashArrayTypes.longDash}>Long Dash</option>
          <option value={LineWidgetDashArrayTypes.longDashDot}>Long Dash-Dot</option>
        </Select>
      </Tooltip>

      <Tooltip hasArrow placement='bottom' label='Line Start' bg='black'>
        <Select onChange={setStartArrowStyle} value={startArrowStyle} width='80px' size='sm' aria-label='Line Start'>
          <option value={ArrowStyleTypes.none}>None</option>
          <option value={ArrowStyleTypes.basic}>Basic</option>
          <option value={ArrowStyleTypes.long}>Long</option>
          <option value={ArrowStyleTypes.sharp}>Sharp</option>
        </Select>
      </Tooltip>

      <Tooltip hasArrow placement='bottom' label='Line Ending' bg='black'>
        <Select onChange={setEndArrowStyle} value={endArrowStyle} width='80px' size='sm' aria-label='Line Ending'>
          <option value={ArrowStyleTypes.none}>None</option>
          <option value={ArrowStyleTypes.basic}>Basic</option>
          <option value={ArrowStyleTypes.long}>Long</option>
          <option value={ArrowStyleTypes.sharp}>Sharp</option>
        </Select>
      </Tooltip>
      <AltTextMenu widgetId={widgetId} />
    </Flex>
  );
};
